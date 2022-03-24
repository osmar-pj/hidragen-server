const wialon = require('wialon')

export const getUnits = async () => {
    try {
        const session = await wialon().session
        await session.start({
            token: process.env.ORF_TOKEN
        })
        const paramsUnit = {
            spec: {
                itemsType: 'avl_unit',
                propName: 'sys_name',
                propValueMask: '*',
                sortType: 'sys_name'
            },
            force: 0,
            from: 0,
            to: 0,
            flags: 1
        }
        const units = await session.request('core/search_items', paramsUnit)
        await session.request('core/logout', {})
        return units.items
    } catch (error) {
        console.error(error);
    }
}

export const getTripsByUnit = async (unitId) => {
    try {
        const session = await wialon().session
        await session.start({
            token: process.env.ORF_TOKEN
        })
        const paramsExecReport = {
            reportResourceId: 9878,
            reportTemplateId: 7,
            reportObjectId: unitId,
            reportObjectSecId: 0,
            reportObjectIdList: 0,
            interval: {
                from: Math.floor((new Date().getTime() - 1000*60*60*10)/1000),
                to: Math.floor(new Date().getTime()/1000),
                flags: 0
            }
        }
    
        const reports = await session.request('report/exec_report', paramsExecReport)
        const paramsGetResultRows = {
            tableIndex: 0, // 0 para trips
            indexFrom: 0,
            indexTo: reports.reportResult.tables[0].rows,
        }
        
        const rows = await session.request('report/get_result_rows', paramsGetResultRows)
        // await session.request('core/logout', {})
        return rows
    } catch (error) {
        console.error(error);
    }
}

export const getHoursEngineByUnit = async (unitId, start, end) => {
    try {
        const session = await wialon().session
        await session.start({
            token: process.env.ORF_TOKEN
        })
        const paramsExecReport = {
            reportResourceId: 9878,
            reportTemplateId: 7,
            reportObjectId: unitId,
            reportObjectSecId: 0,
            reportObjectIdList: 0,
            interval: {
                from: Math.floor((new Date().getTime() - 1000*60*60*10)/1000),
                to: Math.floor((new Date().getTime() - 1000*60*60*5)/1000),
                flags: 0
            }
        }
    
        const reports = await session.request('report/exec_report', paramsExecReport)
        const paramsGetResultRows = {
            tableIndex: 1, // 1 para engine hours
            indexFrom: 0,
            indexTo: reports.reportResult.tables[0].rows,
        }
        
        const rows = await session.request('report/get_result_rows', paramsGetResultRows)
        // await session.request('core/logout', {})
        return rows
    } catch (error) {
        console.error(error);
    }
}

export const getFuelConsumptionByShift = async (unitId, start, end) => {
    try {
        const session = await wialon().session
        await session.start({
            token: process.env.ORF_TOKEN
        })
        const paramsExecReport = {
            reportResourceId: 9878,
            reportTemplateId: 7,
            reportObjectId: unitId,
            reportObjectSecId: 0,
            reportObjectIdList: 0,
            interval: {
                from: start,
                to: end,
                flags: 0
            }
        }
    
        const reports = await session.request('report/exec_report', paramsExecReport)
        const paramsGetResultRows = {
            tableIndex: 1, // 1 para engine hours
            indexFrom: 0,
            indexTo: reports.reportResult.tables[0].rows,
        }
        
        const rows = await session.request('report/get_result_rows', paramsGetResultRows)
        // await session.request('core/logout', {})
        const data = rows.map(item => {
            return {
                
            }
        })
        return rows
    } catch (error) {
        console.error(error);
    }
}

export const getStats = async (unitId, start, end) => {
    try {
        const session = await wialon().session
        const data = await session.start({
            token: process.env.ORF_TOKEN
        })
        const paramsExecReport = {
            reportResourceId: 9878,
            reportTemplateId: 7,
            reportObjectId: unitId,
            reportObjectSecId: 0,
            reportObjectIdList: 0,
            interval: {
                from: start,
                to: end,
                flags: 0
            }
        }
    
        const reports = await session.request('report/exec_report', paramsExecReport)
        const stats = reports.reportResult.stats
        const hourEngine = parseFloat(stats[7][1].split(':').reduce((acc, curr) => acc * 60 + +curr, 0)/3600)
        return {
            unit: stats[1][1],
            timeReport: stats[2][1],
            startDate: stats[3][1],
            endDate: stats[4][1],
            totalDistance: parseFloat(stats[5][1].split(' ')[0]), // km
            totalFuelConsumption: parseFloat(stats[6][1].split(' ')[0]), // gal
            totalRatioKmByConsumption: hourEngine == 0 ? 0 : (parseFloat(stats[6][1].split(' ')[0]) / hourEngine).toFixed(2), // gal/h
            totalHoursEngineFormat: stats[7][1],
            totalHoursEngine: hourEngine.toFixed(2)
        }
    } catch (error) {
        console.error(error);
    }
}

export const getDataByTurn = async (unitId, start, end) => {
    try {
        const session = await wialon().session
        await session.start({
            token: process.env.ORF_TOKEN
        })
        const paramsExecReport = {
            reportResourceId: 9878,
            reportTemplateId: 6,
            reportObjectId: unitId,
            reportObjectSecId: 0,
            reportObjectIdList: 0,
            interval: {
                from: start,
                to: end,
                flags: 0
            }
        }
    
        const reports = await session.request('report/exec_report', paramsExecReport)
        const paramsGetResultRows = {
            tableIndex: 1,
            indexFrom: 0,
            indexTo: reports.reportResult.tables[0].rows * 3
        }
        
        const rows = await session.request('report/get_result_rows', paramsGetResultRows)
        const rowsMap = rows.map(item => {
            // let date = new Date(item.t1*1000).toLocaleString()
            const week = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']
            const day = new Date(item.t1*1000).getDay()
            const date = `${week[day]} ${new Date(item.t1*1000).getDate()}`
            let gls = parseFloat(item.c[2].split(' ')[0])
            let hrs = parseFloat((item.c[3].split(':').reduce((acc, curr) => acc * 60 + +curr, 0)/3600).toFixed(2))
            let kms = parseInt(item.c[4].split(' ')[0])
            let speedAv = parseInt(item.c[6].split(' ')[0])
            let speedMax = item.c[7].t ? parseInt((item.c[7].t).split(' ')[0]) : parseInt(item.c[7].split(' ')[0])
            return {
                combustible: {
                    x: date,
                    y: gls
                },
                kilometraje: {
                    x: date,
                    y: kms
                },
                horas: {
                    x: date,
                    y: hrs
                },
                speedAv: {
                    x: date,
                    y: speedAv
                },
                speedMax: {
                    x: date,
                    y: speedMax
                }
            }
        })
        return {
            ratio: rowsMap
        }
    } catch (error) {
        console.error(error);
    }
}

// Envia los datos para el main por ratios de comsumo y eficiencia
export const getDataRatio = async (unitId, start, end) => {
    try {
        const session = await wialon().session
        await session.start({
            token: process.env.ORF_TOKEN
        })
        const paramsExecReport = {
            reportResourceId: 9878,
            reportTemplateId: 3,
            reportObjectId: unitId,
            reportObjectSecId: 0,
            reportObjectIdList: 0,
            interval: {
                from: start,
                to: end,
                flags: 0
            }
        }
    
        const reports = await session.request('report/exec_report', paramsExecReport)
        const paramsGetResultRows = {
            tableIndex: 0,
            indexFrom: 0,
            indexTo: reports.reportResult.tables[0].rows * 3
        }
        
        const rows = await session.request('report/get_result_rows', paramsGetResultRows)
        const rowsMap = rows.map(item => {
            const timestamp = item.t1*1000
            const date = (new Date(timestamp).toLocaleDateString()).split('/').reverse().join('/')
            const gph = parseFloat(item.c[2].split(' ')[0]) // galones por hora
            const gpk = parseFloat(item.c[3].split(' ')[0]) // kilometro por galon
            return {
                galPerHora: {
                    x: date,
                    y: gph
                },
                galPerKm: {
                    x: date,
                    y: gpk
                }
            }
        })
        
        return {
            ratio: rowsMap
        }
    } catch (error) {
        console.error(error);
    }
}

export const getDataPerHourDay = async (unitId, start, end) => {
    try {
        const session = await wialon().session
        await session.start({
            token: process.env.ORF_TOKEN
        })
        const paramsExecReport = {
            reportResourceId: 9878,
            reportTemplateId: 8,
            reportObjectId: unitId, // unitId || 9925
            reportObjectSecId: 0,
            reportObjectIdList: 0,
            interval: {
                from: start,
                to: end,
                flags: 0
            }
        }
    
        const reports = await session.request('report/exec_report', paramsExecReport)
        const paramsGetResultRows = {
            tableIndex: 0,
            indexFrom: 0,
            indexTo: reports.reportResult.tables[0].rows * 3
        }
        
        const rows = await session.request('report/get_result_rows', paramsGetResultRows)
        const rowsMap = rows.map(item => {
            let date = new Date(item.t1*1000).toLocaleTimeString().split(':')[0]
            let gls = parseFloat(item.c[6].split(' ')[0])
            let hrs = parseFloat((item.c[5].split(':').reduce((acc, curr) => acc * 60 + +curr, 0)/3600).toFixed(2))
            let kms = parseInt(item.c[2].split(' ')[0])
            let speedAv = parseInt(item.c[3].split(' ')[0])
            let speedMax = item.c[4].t ? parseInt((item.c[4].t).split(' ')[0]) : parseInt(item.c[4].split(' ')[0])
            return {
                combustible: {
                    x: date,
                    y: gls
                },
                kilometraje: {
                    x: date,
                    y: kms
                },
                horas: {
                    x: date,
                    y: hrs
                },
                speedAv: {
                    x: date,
                    y: speedAv
                },
                speedMax: {
                    x: date,
                    y: speedMax
                }
            }
        })
        return {
            ratio: rowsMap
        }
    } catch (error) {
        console.error(error);
    }
}