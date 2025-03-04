import UserType from "../constants/UserType"
import { Sequelize } from "../models"
import db from "../models"
import { Op, literal } from 'sequelize'
const { AssistantReport } = db

export const getAssistantReport = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    const whereClause = search.trim()
        ? {
            [Op.or]: [
                { content: { [Op.like]: `%${search}%` } },
                literal(`CONCAT(user.lastName, ' ', user.firstName) LIKE '%${search}%'`),
                literal(`CONCAT(assistant.lastName, ' ', assistant.firstName) LIKE '%${search}%'`),
            ],
        }
        : {}

    const { rows: reports, count: total } = await db.AssistantReport.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'lastName', 'firstName'], // ✅ Lấy tên người dùng
            },
            {
                model: db.User,
                as: 'assistant',
                attributes: ['id', 'lastName', 'firstName'], // ✅ Lấy tên trợ lý
            },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
        message: '✅ Lấy danh sách báo cáo thành công!',
        data: reports,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    })

}


export const getAssistantReportById = async (req, res) => {
    const report = await AssistantReport.findByPk(req.params.id)
    if (!report) return res.status(404).json({ message: "Không tìm thấy báo cáo" })
    return res.status(200).json(report)
}

export const postAssistantReport = async (req, res) => {
    const data = req.body
    const assistant = await db.User.findByPk(data.assistantId)
    if (assistant.userType !== UserType.ASSISTANT) return res.status(400).json({ message: "Người dùng không phải trợ giảng" })

    const newReport = await AssistantReport.create(data)

    return res.status(201).json({
        message: 'Tạo báo cáo thành công',
        newReport
    })
}

export const deleteAssistantReport = async (req, res) => {
    const report = await AssistantReport.findByPk(req.params.id)
    if (!report) return res.status(404).json({ message: "Không tìm thấy báo cáo" })

    const del = await report.destroy()
    if (!del) return res.status(500).json({ message: "Xóa báo cáo thất bại" })
    return res.status(200).json({ message: "Xóa báo cáo thành công" })
}