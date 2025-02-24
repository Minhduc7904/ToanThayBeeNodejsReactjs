import { Sequelize } from "../models"
import db from "../models"
// LoiController.js


export const getLoi = async (req, res) => {

    res.status(200).json({ message: 'Hello from getLoi' })
}


export const getLoiByLuotLamBai = async (req, res) => {

    res.status(200).json({ message: `Hello from getLoiByLuotLamBai, ma_lam_bai: ${req.params.ma_lam_bai}` })
}


export const postLoi = async (req, res) => {
    try {
        const CheatList = await db.Cheat.create(req.body)
        res.status(201).json(CheatList)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export const deleteLoi = async (req, res) => {

    res.status(200).json({ message: 'Hello from deleteLoi' })
}
