import { Sequelize } from "../models"
import db from "../models"
import UserType from "../constants/UserType.js"
import { uploadImage, cleanupUploadedFiles } from "../utils/imageUpload.js"
import { or } from "sequelize"

export const getExam = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    let whereClause = {}
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { chapter: { [Op.like]: `%${search}%` } },
                { year: { [Op.like]: `%${search}%` } },
                { class: { [Op.like]: `%${search}%` } },
                { typeOfExam: { [Op.like]: `%${search}%` } }
            ]
        }
    }

    const [examList, total] = await Promise.all([
        db.Exam.findAll({
            where: whereClause,
            offset,
            limit
        }),
        db.Exam.count({
            where: whereClause
        })
    ])

    return res.status(200).json({
        message: 'Danh sách đề',
        data: examList,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    })
}

export const getExamPublic = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    let whereClause = {}
    if (search.trim() !== '') {
        whereClause = {
            public: true,
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { chapter: { [Op.like]: `%${search}%` } },
                { year: { [Op.like]: `%${search}%` } },
                { class: { [Op.like]: `%${search}%` } },
                { typeOfExam: { [Op.like]: `%${search}%` } }
            ]
        }
    }

    const [examList, total] = await Promise.all([
        db.Exam.findAll({
            where: whereClause,
            offset,
            limit
        }),
        db.Exam.count({
            where: whereClause
        })
    ])

    return res.status(200).json({
        message: 'Danh sách đề',
        data: examList,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    })
}

export const getExamById = async (req, res) => {
    const { id } = req.params
    const examDetail = await db.Exam.findByPk(id)
    if (!examDetail) {
        return res.status(404).json({ message: 'Đề không công khai hoặc không tồn tại' })
    }
    if (!examDetail.public && req.user.userType === UserType.STUDENT) {
        return res.status(401).json({ message: 'Đề không công khai hoặc không tồn tại' })
    }
    return res.status(200).json({
        message: 'Chi tiết đề',
        data: examDetail
    })
}

export const postExam = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    const uploadedFiles = []

    try {
        const { examData, questions } = JSON.parse(req.body.data)
        const examImage = req.files?.examImage?.[0]
        const questionImages = req.files?.questionImages || []
        const statementImages = req.files?.statementImages || []

        if (!examData || !Array.isArray(questions) || !questions.length) {
            return res.status(400).json({ message: "❌ Dữ liệu đề hoặc câu hỏi không hợp lệ!" })
        }

        const examImageUrl = await uploadImage(examImage)
        if (examImageUrl) uploadedFiles.push(examImageUrl)

        const newExam = await db.Exam.create(
            { ...examData, imageUrl: examImageUrl },
            { transaction }
        )

        let questionImageIndex = 0
        let statementImageIndex = 0

        const createdQuestions = await Promise.all(
            questions.map(async ({ questionData, statements }, i1) => {
                let questionImageUrl = null
                if (questionData.needImage && questionImages[questionImageIndex]) {
                    questionImageUrl = await uploadImage(questionImages[questionImageIndex])
                    if (questionImageUrl) uploadedFiles.push(questionImageUrl)
                    questionImageIndex++
                }

                const newQuestion = await db.Question.create(
                    { ...questionData, imageUrl: questionImageUrl },
                    { transaction }
                )

                await db.ExamQuestions.create(
                    { 
                        examId: newExam.id, 
                        questionId: newQuestion.id,
                        order: i1 + 1
                    },
                    { transaction }
                )

                let createdStatements = []

                if (Array.isArray(statements) && statements.length) {
                    createdStatements = await Promise.all(
                        statements.map(async (statement, i2) => {
                            let statementImageUrl = null

                            if (statement.needImage && statementImages[statementImageIndex]) {
                                statementImageUrl = await uploadImage(statementImages[statementImageIndex])
                                if (statementImageUrl) uploadedFiles.push(statementImageUrl)
                                statementImageIndex++
                            }

                            return db.Statement.create(
                                {
                                    ...statement,
                                    imageUrl: statementImageUrl,
                                    questionId: newQuestion.id,
                                    order: i2 + 1
                                },
                                { transaction }
                            )
                        })
                    )
                }

                return { question: newQuestion, statements: createdStatements }
            })
        )

        await transaction.commit()

        return res.status(201).json({
            message: "✅ Thêm đề thi thành công!",
            exam: newExam,
            questions: createdQuestions,
        })

    } catch (error) {
        console.error('❌ Lỗi khi thêm đề thi:', error)
        await cleanupUploadedFiles(uploadedFiles)
        await transaction.rollback()

        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}


export const putExam = async (req, res) => {
    const { id } = req.params
    const [updated] = await db.Exam.update(req.body, {
        where: { id }
    })

    if (!updated) {
        return res.status(404).json({ message: "Đề thi không tồn tại" })
    }

    const updatedExam = await db.Exam.findByPk(id)
    return res.status(200).json({ message: "Cập nhật đề thi thành công", data: updatedExam })
}

export const deleteExam = async (req, res) => {
    const { id } = req.params
    const deleted = await db.Exam.destroy({
        where: { id }
    })

    if (!deleted) {
        return res.status(404).json({ message: "Đề thi không tồn tại" })
    }

    return res.status(200).json({ message: "Xóa đề thi thành công" })
}
