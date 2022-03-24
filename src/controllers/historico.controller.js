import { getDataByTurn, getUnits } from '../libs/orfData'

export const getDataWeek = async (req, res) => {
    try {
      console.log('START')
      const tags = await getUnits()
      let totalData = []
      const date = new Date().getDate()
      const month = new Date().getMonth()
      const start = new Date(2022, month, date - 6, 7, 30, 0).getTime()/1000
      const end = Math.floor(new Date().getTime()/1000)
      if (tags) {
        for (let i = 0; i < tags.length; i++) {
          console.log(1)
            const dataPerWeek = await getDataByTurn(tags[i].id, start, end)
            // if (!dataPerWeek) {
            //     break
            // }
            const teamDay = dataPerWeek.ratio.filter((item, index) => index%2 == 0)
            const teamNight = dataPerWeek.ratio.filter((item, index) => index%2 != 0)
            totalData.push({
                nm: tags[i].nm,
                teamDay,
                teamNight,
                radio: { id: 1, nm: 'combustible', description: 'Galones (gal)' },
            })
            // console.log(totalData)
        }
      }
      res.status(200).json({
        totalData
      })
    } 
    catch (error) {
      console.error(error)
      res.status(500).json({
          message: 'Error al obtener los datos'
      })
    }
}