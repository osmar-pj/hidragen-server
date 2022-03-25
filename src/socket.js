import mqtt from 'mqtt'
import { getDataRatio, getUnits, getDataPerHourDay } from './libs/orfData'
import { createArrNulls, createArrNullsBefore } from './libs/lib'

const socketIO = require('socket.io')

const socket = {}
let io

function connect(server) {
    io = socketIO(server)
    socket.io = io
    let USERS = {}
    io.on('connection', socket => {
        console.log(`${socket.id} se conecto`)
        USERS[socket.id] = socket
        socket.on('disconnect', () => {
            console.log(`${socket.id} se desconecto`)
        })
    })

    const options = {
        clientId: 'TEST-CHORRILLOS',
        username: 'mqttChorrillos',
        password: ''
      }
      
    const connectUrl = process.env.URL_MQTT
    const client = mqtt.connect(connectUrl, options)
    client.on('connect', () => {
    // console.log('Client connected by SERVER:')
    // Subscribe
    client.subscribe(process.env.TOPIC_MQTT_SENSOR, { qos: 0 })
    })
    
    let sensors = []
    let datasFiltered = []
      
    client.on('message', async (topic, message) => {
        const data = JSON.parse(message.toString())
        data.createdAt = new Date()
        sensors.push(data)
        if (sensors.length > 10) {
            // reverse sensors
            // borrar ultimo dato
            sensors.shift()
        }
        if (sensors) {
            datasFiltered = sensors.reverse().filter((elem, index, self) => {
                return self.map(item => item.nm.toString()).indexOf(elem.nm.toString()) === index
            })
        }
    })
    setInterval(async () => {
        const tags = await getUnits()
        let totalData = []
        const date = new Date().getDate()
        const month = new Date().getMonth()
        const start = new Date(2022, month, date, 0, 0, 0).getTime()/1000
        const end = Math.floor(new Date().getTime()/1000)
        if (tags) {
            for (let i = 0; i < tags.length; i++) {
                let dataPerHourDay = await getDataPerHourDay(tags[i].id, start, end)
                if (dataPerHourDay) {
                    const firstDate = parseInt(dataPerHourDay.ratio[0].combustible.x)
                    const lastDate = parseInt(dataPerHourDay.ratio[dataPerHourDay.ratio.length - 1].combustible.x)
                    const arrBefore = createArrNullsBefore(firstDate)
                    const arrAfter = createArrNulls(lastDate)
                    const data = arrBefore.dato.concat(dataPerHourDay.ratio, arrAfter.dato)
                    let teamDay = data.filter((item, index) => index < 12)
                    let teamNight = data.filter((item, index) => index >= 12)
                    const hidragen = datasFiltered.filter(item => item.nm === tags[i].nm)
                    if (hidragen.length) {
                        totalData.push({
                            nm: tags[i].nm,
                            teamDay,
                            teamNight,
                            radio: { id: 1, nm: 'combustible', description: 'Galones (gal)' },
                            hidragen: hidragen.map(item => {
                                return {
                                    status: true,
                                    power: !!parseInt(item.HydraON.Status),
                                    agua: !!parseInt(item.H2O.Status)
                                }
                            })[0]
                        })
                    } else {
                        totalData.push({
                            nm: tags[i].nm,
                            teamDay,
                            teamNight,
                            radio: { id: 1, nm: 'combustible', description: 'Galones (gal)' },
                            hidragen:  {
                                status: false,
                                power: false,
                                agua: false
                            }
                        })
                    }
                }
            }
        }
        // console.log(totalData[0].teamDay, totalData[0].teamNight)
        for (let i in USERS) {
            USERS[i].emit('data', {
                totalData
            })
        }
    }, 60000)

    setInterval(async () => {
        const tags = await getUnits()
        let ratioData = []
        if (tags) {
            for (let i = 0; i < tags.length; i++) {
                const start2 = new Date(2022, 2, 1, 0, 0, 0).getTime()/1000
                const end = Math.floor(new Date().getTime()/1000)
                const ratio = await getDataRatio(tags[i].id, start2, end)
                if (!ratio) {
                    break
                }
                // console.log(ratio.ratio)
                ratio.ratio.push({ galPerHora: { x: new Date(2022, 3, 30), y: null }, galPerKm: { x: new Date(2022, 3, 30), y: null } })
                ratioData.push({
                    nm: tags[i].nm,
                    data: ratio.ratio
                })
            }
        }
        for (let i in USERS) {
            USERS[i].emit('ratio', {
                ratioData
            })
        }
    }, 10000)
}

module.exports = {
    connect,
    socket
}

// PARA LLAMAR AL SOCKET DESDE DONDE SEA DEL BACKEND

/*
    const socket = require($route of socket.js$).socket
    const {socket} = require($route of socket.js$)
    socket.io.emit('data', data)
*/
