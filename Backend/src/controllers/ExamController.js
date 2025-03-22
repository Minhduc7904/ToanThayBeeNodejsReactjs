import { Sequelize } from "../models"
import db from "../models"
import UserType from "../constants/UserType.js"
import { uploadImage, cleanupUploadedFiles } from "../utils/imageUpload.js"
import { Op } from "sequelize";

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
    const userId = req.user.id; // ✅ lấy userId từ token hoặc middleware
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit
    const sortOrder = req.query.sortOrder || 'DESC'

    let whereClause = { public: true }

    if (search.trim() !== '') {
        whereClause = {
            ...whereClause,
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

    // Lấy danh sách đề và tổng số đề
    const [examList, total] = await Promise.all([
        db.Exam.findAll({
            where: whereClause,
            offset,
            limit,
            order: [['createdAt', sortOrder]]
        }),
        db.Exam.count({ where: whereClause })
    ])

    const examIds = examList.map(exam => exam.id)

    // Truy vấn trạng thái từ bảng studentExamStatus
    const statuses = await db.StudentExamStatus.findAll({
        where: {
            studentId: userId,
            examId: examIds
        }
    })

    // Map dữ liệu theo examId để dễ lookup
    const statusMap = {};
    statuses.forEach(status => {
        statusMap[status.examId] = {
            isDone: status.isDone,
            isSave: status.isSave
        }
    })

    // Gắn trạng thái vào từng exam
    const examListWithStatus = examList.map(exam => {
        const status = statusMap[exam.id] || { isDone: false, isSave: false }
        return {
            ...exam.toJSON(), // chuyển từ instance Sequelize sang object thường
            isDone: status.isDone,
            isSave: status.isSave
        }
    })

    return res.status(200).json({
        message: 'Danh sách đề',
        data: examListWithStatus,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    })
}

// examHandlers.js
export const submitExam = async (socket, attemptId) => {
    const t = await db.sequelize.transaction(); // 🔒 Bắt đầu transaction
    try {
        console.log("📝 Nộp bài:", attemptId);
        const attempt = await db.StudentExamAttempt.findByPk(attemptId, { transaction: t });
        if (!attempt) {
            await t.rollback();
            return socket.emit("submit_error", { message: "Nộp bài thất bại, vui lòng thử lại." });
        }

        if (attempt.endTime) {
            await t.rollback();
            return socket.emit("exam_submitted", { message: "Bài thi đã được nộp trước đó." });
        }

        attempt.endTime = new Date();

        const status = await db.StudentExamStatus.findOne({
            where: { studentId: attempt.studentId, examId: attempt.examId },
            transaction: t
        });

        if (status) {
            status.isDone = true;
            await status.save({ transaction: t });
        } else {
            await db.StudentExamStatus.create({
                studentId: attempt.studentId,
                examId: attempt.examId,
                isDone: true
            }, { transaction: t });
        }

        // 👉 Lấy tất cả answer + typeOfQuestion từ Question
        const answers = await db.Answer.findAll({
            where: { attemptId },
            include: {
                model: db.Question,
                attributes: ['id', 'typeOfQuestion']
            },
            transaction: t
        });

        // 👉 Tính điểm
        const groupedDS = {};
        let totalScore = 0;

        for (const answer of answers) {
            const { typeOfQuestion } = answer.Question;
            const isCorrect = answer.result === true;

            if (typeOfQuestion === 'TN' && isCorrect) {
                totalScore += 0.25;
            } else if (typeOfQuestion === 'TLN' && isCorrect) {
                totalScore += 0.5;
            } else if (typeOfQuestion === 'DS') {
                let count = 0;
                if (!answer.answerContent || answer.answerContent == []) continue;
                const answersDS = JSON.parse(answer.answerContent); // [{statementId, answer: true/false}]

                for (const answerDS of answersDS || []) {
                    const statement = await db.Statement.findByPk(answerDS.statementId);
                    if (statement && statement.isCorrect === answerDS.answer) {
                        count++;
                    }
                }

                // Tính điểm dựa vào số lượng đúng
                if (count === 1) totalScore += 0.1;
                else if (count === 2) totalScore += 0.25;
                else if (count === 3) totalScore += 0.5;
                else if (count >= 4) totalScore += 1.0;
            }
        }


        attempt.score = parseFloat(totalScore.toFixed(2));
        await attempt.save({ transaction: t });

        await t.commit(); // ✅ Commit nếu mọi thứ ổn

        socket.emit("exam_submitted", {
            message: "Nộp bài thành công!",
            timestamp: new Date(),
            attemptId,
            score: attempt.score,
            answers: answers.map(a => ({
                id: a.id,
                questionId: a.questionId,
                answerContent: a.answerContent,
                result: a.result,
                typeOfQuestion: a.Question?.typeOfQuestion || null,
            }))
        });

    } catch (err) {
        await t.rollback(); // ❌ Rollback nếu có lỗi
        console.error("❌ Lỗi submit_exam:", err);
        socket.emit("submit_error", { message: "Nộp bài thất bại, vui lòng thử lại." });
    }
};



export const getExamPublicById = async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const examDetail = await db.Exam.findByPk(id);

    if (!examDetail) {
        return res.status(404).json({ message: 'Đề không công khai hoặc không tồn tại' });
    }

    if (!examDetail.public) {
        return res.status(401).json({ message: 'Đề không công khai hoặc không tồn tại' });
    }

    // Mặc định trạng thái
    let isDone = false;
    let isSave = false;

    // Nếu có user => check trạng thái
    if (userId) {
        const status = await db.StudentExamStatus.findOne({
            where: {
                studentId: userId,
                examId: id
            }
        });

        if (status) {
            isDone = status.isDone;
            isSave = status.isSave;
        }
    }

    return res.status(200).json({
        message: 'Chi tiết đề',
        data: {
            ...examDetail.toJSON(),
            isDone,
            isSave
        }
    });
}


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

};


export const getPublicQuestionByExamId = async (req, res) => {
    const { examId } = req.params;

    if (!examId) {
        return res.status(400).json({ message: "❌ examId không hợp lệ!" });
    }

    const exam = await db.Exam.findOne({
        where: { id: examId, public: true }, // ✅ Chỉ lấy exam public
        attributes: ['name', 'testDuration'], // 👉 chỉ trả về name & thời gian

        include: [
            {
                model: db.Question,
                as: "questions",
                through: { attributes: [] },
                attributes: ["id", "content", "typeOfQuestion", "imageUrl"],
                include: [
                    {
                        model: db.Statement,
                        as: "statements",
                        attributes: ["id", "content"],
                    },
                ],
            },
        ],
        order: [[{ model: db.Question, as: "questions" }, "id", "ASC"]],

    });

    if (!exam) {
        return res.status(404).json({ message: "❌ Không tìm thấy đề thi công khai!" });
    }

    return res.status(200).json({
        message: "Lấy danh sách câu hỏi rút gọn thành công!",
        questions: exam.questions,
        exam: {
            name: exam.name,
            testDuration: exam.testDuration,
        }
    });
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
                    const image = questionImages[questionImageIndex]
                    questionImageIndex++
                    questionImageUrl = await uploadImage(image)
                    if (questionImageUrl) uploadedFiles.push(questionImageUrl)
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
                                const image1 = statementImages[statementImageIndex]
                                statementImageIndex++
                                statementImageUrl = await uploadImage(image1)
                                if (statementImageUrl) uploadedFiles.push(statementImageUrl)

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

export const saveExamForUser = async (req, res) => {
    const userId = req.user.id;
    const { examId } = req.body;

    if (!examId) {
        return res.status(400).json({ message: 'examId là bắt buộc.' });
    }

    // Kiểm tra exam tồn tại
    const exam = await db.Exam.findByPk(examId);
    if (!exam) {
        return res.status(404).json({ message: 'Không tìm thấy đề thi.' });
    }

    // Tìm hoặc tạo trạng thái lưu đề cho user
    const [status, created] = await db.StudentExamStatus.findOrCreate({
        where: { studentId: userId, examId },
        defaults: {
            isSave: true,
            isDone: false,
            completionTime: null
        }
    });

    // Nếu đã tồn tại thì cập nhật isSave = true
    if (!created) {
        status.isSave = !status.isSave;
        await status.save();
    }

    return res.status(200).json({
        message: 'Thành công.',
        data: {
            examId,
            isSave: status.isSave
        }
    });
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
