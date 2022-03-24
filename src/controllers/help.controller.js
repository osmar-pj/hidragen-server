import Work from '../models/Work'
import Help from '../models/Help'

export const getHelp = async (req, res) => {
    try {
        const help = await Help.find()
        res.json(help)
    } catch (error) {
        console.error(error)
    }
}

export const getQtyEquipos = async (req, res) => {
    try {
        const { id } = req.params
        const works = await Work.find()
        const worksDone = works.filter(work => work.workers.some(data => data == id))
        res.status(200).json(worksDone)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const createData = async (req, res) => {
     
}