import { Sequelize } from "../models"
import db from "../models"
import { Op, literal } from 'sequelize'

const { QuestionReport } = db

export const getQuestionReport = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    const whereClause = search.trim()
        ? {
            [Op.or]: [
                { content: { [Op.like]: `%${search}%` } },
                literal(`CONCAT(user.lastName, ' ', user.firstName) LIKE '%${search}%'`),
                literal(`question.content LIKE '%${search}%'`),
            ],
        }
        : {}

    const { rows: reports, count: total } = await QuestionReport.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'lastName', 'firstName'], 
            },
            {
                model: db.Question,
                as: 'question',
                attributes: ['id', 'content'], 
            },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
        message: '✅ Lấy danh sách báo cáo câu hỏi thành công!',
        data: reports,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    })
}

export const getQuestionReportById = async (req, res) => {
    const report = await QuestionReport.findByPk(req.params.id, {
        include: [
            { model: db.User, as: 'user', attributes: ['id', 'lastName', 'firstName'] },
            { model: db.Question, as: 'question', attributes: ['id', 'content'] },
        ],
    })

    if (!report) {
        return res.status(404).json({ message: "❌ Không tìm thấy báo cáo" })
    }
    return res.status(200).json({
        message: "✅ Lấy chi tiết báo cáo câu hỏi thành công!",
        data: report,
    })
}

export const postQuestionReport = async (req, res) => {
    const data = req.body

    const question = await db.Question.findByPk(data.questionId)
    if (!question) {
        return res.status(400).json({ message: "❌ Câu hỏi không tồn tại" })
    }

    const newReport = await QuestionReport.create(data)

    return res.status(201).json({
        message: "✅ Tạo báo cáo câu hỏi thành công!",
        newReport,
    })
}

export const deleteQuestionReport = async (req, res) => {
    const report = await QuestionReport.findByPk(req.params.id)

    if (!report) {
        return res.status(404).json({ message: "❌ Không tìm thấy báo cáo" })
    }

    await report.destroy()

    return res.status(200).json({
        message: "✅ Xóa báo cáo câu hỏi thành công!"
    })
}