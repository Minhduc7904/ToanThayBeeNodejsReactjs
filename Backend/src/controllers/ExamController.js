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
    const sortOrder = req.query.sortOrder || 'DESC'

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
            limit,
            order: [['createdAt', sortOrder]]
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
            limit,
            order: [['createdAt',]]
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

export const getExamPublicById = async (req, res) => {
    const { id } = req.params
    const examDetail = await db.Exam.findByPk(id)
    if (!examDetail) {
        return res.status(404).json({ message: 'Đề không công khai hoặc không tồn tại' })
    }
    if (!examDetail.public) {
        return res.status(401).json({ message: 'Đề không công khai hoặc không tồn tại' })
    }
    return res.status(200).json({
        message: 'Chi tiết đề',
        data: examDetail
    })
}

import { Op } from "sequelize";

export const getQuestionByExamId = async (req, res) => {
    const { examId } = req.params;

    if (!examId) {
        return res.status(400).json({ message: "❌ examId không hợp lệ!" });
    }

    const sortOrder = req.query.sortOrder || "ASC";
    const search = req.query.search || "";
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    try {
        // Tìm đề thi trước
        const exam = await db.Exam.findByPk(examId, {
            include: [
                {
                    model: db.Question,
                    as: "questions",
                    through: { attributes: [] },
                    include: [
                        {
                            model: db.Statement,
                            as: "statements",
                            attributes: ["id", "content", "imageUrl", "isCorrect"],
                        },
                    ],
                },
            ],
        });

        if (!exam) {
            return res.status(404).json({ message: "❌ Không tìm thấy đề thi!" });
        }

        // Lọc danh sách câu hỏi sau khi đã tìm thấy đề thi
        let filteredQuestions = exam.questions;

        if (search.trim() !== "") {
            filteredQuestions = filteredQuestions.filter((question) =>
                [
                    question.content,
                    question.typeOfQuestion,
                    question.chapter,
                    question.difficulty,
                    question.class,
                    question.id?.toString(),
                    question.description,
                ]
                    .filter(Boolean) // Loại bỏ giá trị `null` hoặc `undefined`
                    .some((field) => field.toLowerCase().includes(search.toLowerCase()))
            );
        }

        filteredQuestions.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return sortOrder === "ASC"
                ? new Date(a.createdAt) - new Date(b.createdAt)
                : new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Áp dụng phân trang
        const total = filteredQuestions.length;
        const paginatedQuestions = filteredQuestions.slice(offset, offset + limit);

        return res.status(200).json({
            message: "Lấy danh sách câu hỏi thành công!",
            data: paginatedQuestions,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            exam: exam,
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy câu hỏi:", error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};



export const getExamById = async (req, res) => {
    const { id } = req.params
    const examDetail = await db.Exam.findByPk(id)
    if (!examDetail) {
        return res.status(404).json({ message: 'Đề không tồn tại' })
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
        console.log(req.body.data)
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

export const putImageExam = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    const { id } = req.params
    try {
        const exam = await db.Exam.findByPk(id)
        if (!exam) {
            await transaction.rollback()
            return res.status(404).json({ message: "Đề thi không tồn tại" })
        }

        const oldImageUrl = exam.imageUrl
        const newImageFile = req.file
        let newImageUrl = null
        if (newImageFile) {
            newImageUrl = await uploadImage(newImageFile)
        }

        const [updated] = await db.Exam.update(
            { imageUrl: newImageUrl },
            { where: { id } }
        )

        if (!updated) {
            await cleanupUploadedFiles([newImageUrl])
            await transaction.rollback()
            return res.status(500).json({ message: "Lỗi khi cập nhật ảnh đề thi" })
        }

        if (oldImageUrl) {
            try {
                await cleanupUploadedFiles([oldImageUrl])
            } catch (error) {
                await cleanupUploadedFiles([newImageUrl])
                await transaction.rollback()
                return res.status(500).json({ message: "Lỗi khi xóa ảnh cũ" })
            }
        }

        await transaction.commit()

        return res.status(200).json({
            message: "Cập nhật ảnh đề thi thành công",
            oldImageUrl,
            newImageUrl
        })
    } catch (error) {
        console.error("Lỗi khi cập nhật ảnh đề thi:", error)
        await transaction.rollback()
        return res.status(500).json({ message: "Lỗi server", error: error.message })
    }
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
