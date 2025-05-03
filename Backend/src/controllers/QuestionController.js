import { Op } from "sequelize"
import db from "../models/index.js"
import { uploadImage, cleanupUploadedFiles } from "../utils/imageUpload.js"
import UserType from "../constants/UserType.js"

export const getQuestion = async (req, res, next) => {
    const sortOrder = req.query.sortOrder || 'ASC'
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    let whereClause = {}
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { content: { [Op.like]: `%${search}%` } },
                { typeOfQuestion: { [Op.like]: `%${search}%` } },
                { chapter: { [Op.like]: `%${search}%` } },
                { difficulty: { [Op.like]: `%${search}%` } },
                { class: { [Op.like]: `%${search}%` } },
                { id: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ],
        }
    }

    const [questionList, total] = await Promise.all([
        db.Question.findAll({
            where: whereClause,
            offset,
            limit,
            include: [
                {
                    model: db.Statement,
                    as: 'statements',
                    attributes: ['content', 'order', 'isCorrect', 'imageUrl'],
                },
            ],
            order: [['createdAt', sortOrder]],
        }),
        db.Question.count({ where: whereClause }),
    ])

    return res.status(200).json({
        message: 'Lấy danh sách câu hỏi thành công',
        data: questionList,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    })
}

export const getQuestionById = async (req, res) => {
    const { id } = req.params

    const questionDetail = await db.Question.findByPk(id, {
        include: [
            {
                model: db.Statement,
                as: 'statements',
                attributes: ['id', 'content', 'isCorrect', 'imageUrl', 'difficulty'], // 📝 Chọn các trường cần thiết
            },
        ],
    })

    if (!questionDetail) {
        return res.status(404).json({ message: 'Câu hỏi không tồn tại' })
    }

    return res.status(200).json({
        message: 'Chi tiết câu hỏi kèm đáp án',
        data: questionDetail,
    })
}

export const getQuestionByExamId = async (req, res) => {
    const { examId } = req.params

    if (!examId) {
        return res.status(400).json({ message: "examId không hợp lệ!" })
    }

    const exam = await db.Exam.findByPk(examId, {
        include: [
            {
                model: db.Question,
                as: 'questions',
                through: { attributes: [] },
                include: [
                    {
                        model: db.Statement,
                        as: 'statements',
                        attributes: ['id', 'content', 'imageUrl'],
                    },
                ],
                attributes: ['id', 'content', 'typeOfQuestion', 'imageUrl'],
            },
        ],
    })

    if (!exam) {
        return res.status(404).json({ message: "Không tìm thấy đề thi!" })
    }

    return res.status(200).json({
        message: "Lấy danh sách câu hỏi thành công!",
        data: exam.questions,
    })
}

export const postQuestion = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    const uploadedFiles = []
    try {
        const { questionData, statementOptions, examId } = JSON.parse(req.body.data)
        const questionImage = req.files?.questionImage?.[0]
        const solutionImage = req.files?.solutionImage?.[0]
        const statementImages = req.files?.statementImages || []

        if (!questionData) {
            return res.status(400).json({ message: "Dữ liệu câu hỏi không hợp lệ!" })
        }

        const questionImageUrl = await uploadImage(questionImage)
        if (questionImageUrl) uploadedFiles.push(questionImageUrl)

        const solutionImageUrl = await uploadImage(solutionImage)
        if (solutionImageUrl) uploadedFiles.push(solutionImageUrl)

        const newQuestion = await db.Question.create(
            {
                ...questionData,
                imageUrl: questionImageUrl,
                solutionImageUrl: solutionImageUrl
            },
            { transaction }
        )

        let statements = []
        let imageIndex = 0

        if (Array.isArray(statementOptions) && statementOptions.length) {
            statements = await Promise.all(
                statementOptions.map(async (statement, index) => {
                    let statementImageUrl = null

                    if (statement.needImage && statementImages[imageIndex]) {
                        statementImageUrl = await uploadImage(statementImages[imageIndex])
                        if (statementImageUrl) uploadedFiles.push(statementImageUrl)
                        imageIndex++
                    }

                    return db.Statement.create(
                        {
                            ...statement,
                            questionId: newQuestion.id,
                            imageUrl: statementImageUrl,
                            order: index + 1
                        },
                        { transaction }
                    )
                })
            )
        }

        if (examId) {
            const exam = await db.Exam.findByPk(examId, { transaction })
            if (!exam) {
                await transaction.rollback()
                await cleanupUploadedFiles(uploadedFiles)
                return res.status(404).json({ message: "Đề thi không tồn tại!" })
            }

            const added = await db.ExamQuestions.create(
                { examId, questionId: newQuestion.id },
                { transaction }
            )

            if (!added) {
                await transaction.rollback()
                await cleanupUploadedFiles(uploadedFiles)
                return res.status(500).json({ message: "Lỗi khi thêm câu hỏi vào đề thi!" })
            }
        }

        await transaction.commit()

        return res.status(201).json({
            message: "Thêm câu hỏi thành công!",
            question: newQuestion,
            statements,
        })

    } catch (error) {
        await transaction.rollback()
        await cleanupUploadedFiles(uploadedFiles)

        console.error("Lỗi khi thêm câu hỏi:", error)
        return res.status(500).json({ message: "Lỗi server", error: error.message })
    }
}

export const putQuestion = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { questionData, statements } = req.body;

        // Kiểm tra xem câu hỏi có tồn tại không
        const existingQuestion = await db.Question.findByPk(id, { transaction });

        if (!existingQuestion) {
            await transaction.rollback();
            return res.status(404).json({ message: "Câu hỏi không tồn tại!" });
        }

        // Lọc bỏ các trường không được cập nhật
        const allowedFields = [
            "content",
            "difficulty",
            "chapter",
            "class",
            "description",
            "correctAnswer",
            "solution",
            "solutionUrl",
        ];

        const updateData = {};
        allowedFields.forEach((field) => {
            if (questionData[field] !== undefined) {
                updateData[field] = questionData[field];
            }
        });

        // Cập nhật câu hỏi (Không cập nhật imageUrl, solutionUrl)
        const [updated] = await db.Question.update(updateData, {
            where: { id },
            transaction,
        });

        if (!updated) {
            await transaction.rollback();
            return res.status(500).json({ message: "Lỗi khi cập nhật câu hỏi!" });
        }

        // Cập nhật danh sách mệnh đề (Không cập nhật imageUrl của statement)
        if (Array.isArray(statements) && statements.length > 0) {
            await Promise.all(
                statements.map(async (statement) => {
                    const { id: statementId, content, isCorrect, difficulty } = statement;

                    if (!statementId) return;

                    // Chỉ cập nhật các trường được phép
                    const statementUpdateData = {};
                    if (content !== undefined) statementUpdateData.content = content;
                    if (isCorrect !== undefined) statementUpdateData.isCorrect = isCorrect;
                    if (difficulty !== undefined) statementUpdateData.difficulty = difficulty;

                    await db.Statement.update(statementUpdateData, {
                        where: { id: statementId, questionId: id },
                        transaction,
                    });
                })
            );
        }

        // Commit transaction nếu mọi thứ thành công
        await transaction.commit();

        // Trả về dữ liệu cập nhật mới
        const updatedQuestion = await db.Question.findByPk(id, {
            include: [{ model: db.Statement, as: "statements" }],
        });

        return res.status(200).json({
            message: "Cập nhật câu hỏi và mệnh đề thành công!",
            data: updatedQuestion,
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Lỗi khi cập nhật câu hỏi:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};


export const putQuestionImage = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    const { id } = req.params

    try {
        const question = await db.Question.findByPk(id, { transaction })

        if (!question) {
            await transaction.rollback()
            return res.status(404).json({ message: 'Câu hỏi không tồn tại.' })
        }

        const oldImageUrl = question.imageUrl
        const newImageFile = req.file
        let newImageUrl = null
        if (newImageFile) {
            newImageUrl = await uploadImage(newImageFile)
        }

        const [updated] = await db.Question.update(
            { imageUrl: newImageUrl },
            { where: { id }, transaction }
        )

        if (!updated) {
            await cleanupUploadedFiles([newImageUrl])
            await transaction.rollback()
            return res.status(500).json({ message: 'Lỗi khi cập nhật ảnh câu hỏi.' })
        }

        if (oldImageUrl) {
            try {
                await cleanupUploadedFiles([oldImageUrl])
                console.log(`Đã xóa ảnh cũ: ${oldImageUrl}`)
            } catch (err) {
                console.error(`Lỗi khi xóa ảnh cũ: ${oldImageUrl}`, err)
                await cleanupUploadedFiles([newImageUrl])
                await transaction.rollback()
                return res.status(500).json({ message: 'Lỗi khi xóa ảnh cũ.', error: err.message })
            }
        }

        await transaction.commit()

        return res.status(200).json({
            message: 'Cập nhật ảnh câu hỏi thành công.',
            oldImageUrl,
            newImageUrl,
        })

    } catch (error) {
        console.error('Lỗi khi cập nhật ảnh câu hỏi:', error)
        await transaction.rollback()
        return res.status(500).json({ message: 'Lỗi server.', error: error.message })
    }
}

export const putQuestionSolutionImage = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    const { id } = req.params

    try {
        const question = await db.Question.findByPk(id, { transaction })

        if (!question) {
            await transaction.rollback()
            return res.status(404).json({ message: 'Câu hỏi không tồn tại.' })
        }

        const oldImageUrl = question.solutionImageUrl
        const newImageFile = req.file
        let newImageUrl = null
        if (newImageFile) {
            newImageUrl = await uploadImage(newImageFile)
        }

        const [updated] = await db.Question.update(
            { solutionImageUrl: newImageUrl },
            { where: { id }, transaction }
        )

        if (!updated) {
            await cleanupUploadedFiles([newImageUrl])
            await transaction.rollback()
            return res.status(500).json({ message: 'Lỗi khi cập nhật ảnh câu hỏi.' })
        }

        if (oldImageUrl) {
            try {
                await cleanupUploadedFiles([oldImageUrl])
                console.log(`Đã xóa ảnh cũ: ${oldImageUrl}`)
            } catch (err) {
                console.error(`Lỗi khi xóa ảnh cũ: ${oldImageUrl}`, err)
                await cleanupUploadedFiles([newImageUrl])
                await transaction.rollback()
                return res.status(500).json({ message: 'Lỗi khi xóa ảnh cũ.', error: err.message })
            }
        }

        await transaction.commit()

        return res.status(200).json({
            message: 'Cập nhật ảnh câu hỏi lời giải thành công.',
            oldImageUrl,
            newImageUrl,
        })

    } catch (error) {
        console.error('Lỗi khi cập nhật ảnh câu hỏi:', error)
        await transaction.rollback()
        return res.status(500).json({ message: 'Lỗi server.', error: error.message })
    }
}


export const deleteQuestion = async (req, res) => {
    const { id } = req.params
    const deleted = await db.Question.destroy({
        where: { id }
    })

    if (!deleted) {
        return res.status(404).json({ message: 'Câu hỏi không tồn tại' })
    }

    return res.status(200).json({ message: 'Xóa câu hỏi thành công' })
}

export const deleteQuestionImage = async (req, res) => {
    const { id } = req.params
    const transaction = await db.sequelize.transaction()
    try {
        const question = await db.Question.findByPk(id, { transaction })
        if (!question) {
            await transaction.rollback()
            return res.status(404).json({ message: 'Câu hỏi không tồn tại.' })
        }
        const oldImageUrl = question.imageUrl
        const [updated] = await db.Question.update(
            { imageUrl: null },
            { where: { id }, transaction }
        )
        if (!updated) {
            await transaction.rollback()
            return res.status(500).json({ message: 'Lỗi khi xóa ảnh câu hỏi.' })
        }

        if (oldImageUrl) {
            try {
                await cleanupUploadedFiles([oldImageUrl])
                console.log(`Đã xóa ảnh cũ: ${oldImageUrl}`)
            } catch (err) {
                console.error(`Lỗi khi xóa ảnh cũ: ${oldImageUrl}`, err)
                await transaction.rollback()
                return res.status(500).json({ message: 'Lỗi khi xóa ảnh cũ.', error: err.message })
            }
        }

        await transaction.commit()
        return res.status(200).json({
            message: 'Xóa ảnh câu hỏi thành công.',
            oldImageUrl
        })
    } catch (error) {
        console.error('Lỗi khi xóa ảnh câu hỏi:', error)
        await transaction.rollback()
        return res.status(500).json({ message: 'Lỗi server.', error: error.message })
    }
}

