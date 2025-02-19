import { Op } from "sequelize";
import db from "../models/index.js";
import { formatImageUrl, checkLocalImageExists } from "../utils/imageHelper.js";


// GET http://localhost:3000/api/v1/question
export const getQuestion = async (req, res, next) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { content: { [Op.like]: `%${search}%` } },
                { typeOfQuestion: { [Op.like]: `%${search}%` } },
                { chapter: { [Op.like]: `%${search}%` } },
                { difficulty: { [Op.like]: `%${search}%` } },
                { class: { [Op.like]: `%${search}%` } }
            ]
        };
    }

    const [questionList, total] = await Promise.all([
        db.Question.findAll({
            where: whereClause,
            offset,
            limit
        }),
        db.Question.count({
            where: whereClause
        })
    ]);

    return res.status(200).json({
        message: 'Danh sách câu hỏi',
        data: questionList,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    });
};

// GET http://localhost:3000/api/v1/question/:id
export const getQuestionById = async (req, res) => {
    const { id } = req.params;
    const questionDetail = await db.Question.findByPk(id);
    if (!questionDetail) {
        return res.status(404).json({ message: 'Câu hỏi không tồn tại' });
    }
    return res.status(200).json({ message: 'Chi tiết câu hỏi', data: questionDetail });
};

// GET http://localhost:3000/api/v1/question/exam/:1
export const getQuestionByExamId = async (req, res) => {

};

// POST http://localhost:3000/api/v1/question
export const postQuestion = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { questionData, answerOptions } = req.body;

        if (!questionData || !answerOptions || !answerOptions.length) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
        }

        if (!checkLocalImageExists(questionData.imageUrl)) {
            return res.status(400).json({ message: "❌ Ảnh câu hỏi không tồn tại trên server!" });
        }

        for (let answer of answerOptions) {
            if (!checkLocalImageExists(answer.imageUrl)) {
                return res.status(400).json({ message: `❌ Ảnh của đáp án '${answer.content}' không tồn tại trên server!` });
            }
        }

        const newQuestion = await db.Question.create(
            {
                class: questionData.class,
                content: questionData.content,
                typeOfQuestion: questionData.typeOfQuestion,
                correctAnswer: questionData.correctAnswer,
                difficulty: questionData.difficulty,
                chapter: questionData.chapter,
                description: questionData.description,
                solutionUrl: formatImageUrl(questionData.solutionUrl),
                imageUrl: formatImageUrl(questionData.imageUrl)
            },
            { transaction }
        );

        const statements = await Promise.all(
            answerOptions.map(async (answer) => {
                return await db.Statement.create(
                    {
                        questionId: newQuestion.QuestionId,
                        content: answer.content,
                        imageUrl: formatImageUrl(answer.imageUrl),
                        difficulty: answer.difficulty,
                        isCorrect: answer.isCorrect
                    },
                    { transaction }
                );
            })
        );

        // ✅ Commit transaction nếu tất cả đều thành công
        await transaction.commit();

        return res.status(201).json({
            message: "✅ Thêm câu hỏi thành công!",
            question: newQuestion,
            statements
        });
    } catch (error) {
        await transaction.rollback();
        console.error("❌ Lỗi khi thêm câu hỏi:", error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};




// http://localhost:3000/api/v1/question/:id
export const putQuestion = async (req, res) => {
    const { id } = req.params;
    const [updated] = await db.Question.update(req.body, {
        where: { id }
    });

    if (!updated) {
        return res.status(404).json({ message: 'Câu hỏi không tồn tại' });
    }

    const updatedQuestion = await db.Question.findByPk(id);
    return res.status(200).json({ message: 'Cập nhật câu hỏi thành công', data: updatedQuestion });
};

// http://localhost:3000/api/v1/question/:id
export const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    const deleted = await db.Question.destroy({
        where: { id }
    });

    if (!deleted) {
        return res.status(404).json({ message: 'Câu hỏi không tồn tại' });
    }

    return res.status(200).json({ message: 'Xóa câu hỏi thành công' });
};

