import db from "../models/index.js"
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

export const getQuestionsAndAnswersByAttempt = async (req, res) => {
    const { attemptId } = req.params;

    if (!attemptId) {
        return res.status(400).json({ message: "❌ attemptId không hợp lệ!" });
    }

    // Dùng include để lấy cả exam => giảm 1 lần query
    const attempt = await db.StudentExamAttempt.findByPk(attemptId, {
        include: [
            {
                model: db.Exam,
                as: "exam", // phải đúng với alias trong associate
            }
        ]
    });

    if (!attempt) {
        return res.status(404).json({ message: "❌ Không tìm thấy lượt làm bài!" });
    }

    const answers = await db.Answer.findAll({
        where: { attemptId },
        attributes: ["id", "questionId", "answerContent", "result"],
        include: [
            {
                model: db.Question,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                    {
                        model: db.Statement,
                        as: "statements",
                        attributes: ["id", "content", "imageUrl", "isCorrect"],
                    },
                ],
            }
        ]
    });
    

    const questions = [];
    const questionMap = new Set(); // Tránh bị trùng câu hỏi nếu cùng questionId

    const formattedAnswers = answers.map(answer => {
        if (answer.Question && !questionMap.has(answer.Question.id)) {
            questions.push(answer.Question);
            questionMap.add(answer.Question.id);
        }

        return {
            id: answer.id,
            typeOfQuestion: answer.Question?.typeOfQuestion,
            questionId: answer.questionId,
            answerContent: answer.answerContent,
            result: answer.result,
        };
    });

    return res.status(200).json({
        message: "✅ Lấy danh sách câu hỏi và đáp án thành công!",
        data: {
            questions,
            answers: formattedAnswers,
            exam: {
                name: attempt.exam?.name || "Không rõ",
                id: attempt.exam?.id,
            },
            score: attempt.score,
        }
    });
};




export const postAnswer = async (req, res) => {
}


export const putAnswer = async (req, res) => {
}


export const deleteAnswer = async (req, res) => {
}
