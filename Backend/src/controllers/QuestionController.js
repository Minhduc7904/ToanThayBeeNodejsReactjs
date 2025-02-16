import { Op } from "sequelize";
import db from "../models/index.js";

// GET http://localhost:3000/api/question
export const getQuestion = async (req, res, next) => {
    try {
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
                ]
            };
        }

        const [questionList, total] = await Promise.all([
            db.question.findAll({
                where: whereClause,
                offset,
                limit
            }),
            db.question.count({
                where: whereClause
            })
        ]);

        res.status(200).json({
            message: 'Danh sách câu hỏi',
            data: questionList,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });

    } catch (error) {
        next(error);
    }
};

// GET http://localhost:3000/api/v1/question/:id
export const getQuestionById = async (req, res) => {
    const { id } = req.params;
    const questionDetail = await db.question.findByPk(id);
    if (!questionDetail) {
        return res.status(404).json({ message: 'Câu hỏi không tồn tại' });
    }
    return res.status(200).json({ message: 'Chi tiết câu hỏi', data: questionDetail });
};

// GET http://localhost:3000/api/question/exam/:1
export const getQuestionByExamId = async (req, res) => {
    
};

// POST http://localhost:3000/api/question
export const postQuestion = async (req, res) => {
    const question = await db.question.create(req.body);
    if (!question) {
        return res.status(500).json({ message: 'Thêm câu hỏi không thành công' });
    }
    return res.status(201).json({ message: 'Thêm câu hỏi thành công', data: question });
};

// PUT http://localhost:3000/api/question/:id
export const putQuestion = async (req, res) => {

    res.status(200).json({ message: 'Hello from putCauHoi' });
};

// DELETE http://localhost:3000/api/question/:id
export const deleteQuestion = async (req, res) => {

    res.status(200).json({ message: 'Hello from deleteCauHoi' });
};
