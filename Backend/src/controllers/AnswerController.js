import { Sequelize } from "../models"
import db from "../models"
// AnswerController.js

export const getAnswerById = async (req, res) => {
}


export const getAnswerByAttempt = async (req, res) => {
    const { attemptId } = req.params;

    if (!attemptId) {
        return res.status(400).json({ message: "❌ attemptId không hợp lệ!" });
    }

    const answers = await db.Answer.findAll({
        where: { attemptId },
        attributes: ["id", "questionId", "answerContent"],
        include: [
            {
                model: db.Question,
                attributes: ["typeOfQuestion"],
            }
        ]
    });

    const formatted = answers.map(answer => ({
        questionId: answer.questionId,
        answerContent: answer.answerContent,
        typeOfQuestion: answer.Question?.typeOfQuestion || null
    }));

    return res.status(200).json({
        message: "✅ Lấy danh sách đáp án thành công!",
        data: formatted
    });
};



export const postAnswer = async (req, res) => {
}


export const putAnswer = async (req, res) => {
}


export const deleteAnswer = async (req, res) => {
}
