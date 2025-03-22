import { Op } from 'sequelize'
import db from "../models"

export const getAttempts = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    const whereClause = {
        ...(search.trim() && {
            [Op.or]: [
                { studentId: { [Op.like]: `%${search}%` } },
                { examId: { [Op.like]: `%${search}%` } },
                { startTime: { [Op.like]: `%${search}%` } },
                { endTime: { [Op.like]: `%${search}%` } },
                { score: { [Op.like]: `%${search}%` } },
            ],
        }),
    }

    const { rows: attempts, count: total } = await db.StudentExamAttempt.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
        message: '✅ Lấy danh sách lượt làm bài thành công!',
        data: attempts,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    })

}

export const getAttemptById = async (req, res) => {
    const { id } = req.params
    const attempt = await db.StudentExamAttempt.findByPk(id)

    if (!attempt) {
        return res.status(404).json({ message: '❌ Không tìm thấy lượt làm bài.' })
    }

    return res.status(200).json({ message: '✅ Lấy chi tiết lượt làm bài thành công!', data: attempt })
}

export const getAttemptByExamId = async (req, res) => {
    const { examId } = req.params
    const attempts = await db.StudentExamAttempt.findAll({
        where: { examId },
        order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
        message: '✅ Lấy danh sách lượt làm bài theo mã đề thành công!',
        data: attempts,
    })

}

const startExam = async (req, res) => {
    try {
        const { studentId, examId, questionIds } = req.body;

        // 1. Tạo bản ghi StudentExamAttempt mới
        const newAttempt = await db.StudentExamAttempt.create({
            studentId,
            examId,
            startTime: new Date(),
            endTime: null,
            score: null,
        });

        // 2. Lấy attemptId
        const attemptId = newAttempt.id;

        // 3. Tạo danh sách các Answer với answerContent = "", result = null
        const answerRecords = questionIds.map((questionId) => ({
            attemptId,
            questionId,
            answerContent: "",
            result: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        // 4. Bulk insert vào bảng answer
        await db.Answer.bulkCreate(answerRecords);

        return res.status(201).json({
            message: "Bắt đầu làm bài thành công",
            attemptId,
        });
    } catch (error) {
        console.error("Lỗi khi bắt đầu làm bài:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

export const postAttempt = async (req, res) => {
    const studentId = req.user.id
    const { examId } = req.body
    const newAttempt = await db.StudentExamAttempt.create({
        studentId,
        examId,
        startTime: new Date(),
        endTime: null,
        score: null,
    })
    return res.status(201).json({ message: '✅ Thêm lượt làm bài thành công!', data: newAttempt })
}

export const putAttempt = async (req, res) => {
    return res.status(200).json({ message: '🔧 Chức năng đang phát triển!' })
}

export const deleteAttempt = async (req, res) => {
    const { id } = req.params
    const attempt = await db.StudentExamAttempt.findByPk(id)

    if (!attempt) {
        return res.status(404).json({ message: '❌ Không tìm thấy lượt làm bài để xóa.' })
    }

    await attempt.destroy()

    return res.status(200).json({ message: '✅ Xóa lượt làm bài thành công!' })
}
