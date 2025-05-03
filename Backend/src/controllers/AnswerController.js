import db from "../models/index.js"
// AnswerController.js

export const getAnswerById = async (req, res) => {
}

export const reExamination = async (req, res) => {
    const { attemptId } = req.params;

    if (!attemptId) {
        return res.status(400).json({ message: "attemptId không hợp lệ!" });
    }

    const transaction = await db.sequelize.transaction();

    try {
        const attempt = await db.StudentExamAttempt.findByPk(attemptId, { transaction });
        if (!attempt) {
            await transaction.rollback();
            return res.status(404).json({ message: "Không tìm thấy lượt làm bài!" });
        }

        const answers = await db.Answer.findAll({
            where: { attemptId },
            include: [{ model: db.Question, attributes: ["typeOfQuestion"] }],
            transaction,
        });

        let countUpdated = 0;
        let newScore = 0;

        // Thu thập statementIds cho TN và DS
        const tnStatementIds = answers
            .filter(a => a.Question?.typeOfQuestion === "TN")
            .map(a => a.answerContent);

        const dsStatementIds = answers
            .filter(a => a.Question?.typeOfQuestion === "DS")
            .flatMap(a => {
                try {
                    const parsed = JSON.parse(a.answerContent);
                    return Array.isArray(parsed) ? parsed.map(ans => ans.statementId) : [];
                } catch (err) {
                    console.warn("❗ answerContent không hợp lệ JSON:", a.answerContent);
                    return [];
                }
            });

        const allStatementIds = [...new Set([...tnStatementIds, ...dsStatementIds])];

        const allStatements = await db.Statement.findAll({
            where: { id: allStatementIds },
            transaction,
        });

        const statementMap = Object.fromEntries(allStatements.map(s => [s.id.toString(), s.isCorrect]));

        for (const answer of answers) {
            const question = answer.Question;

            if (question?.typeOfQuestion === "TN") {
                if (!answer.answerContent) continue;
                const isCorrect = statementMap[answer.answerContent] === true;

                if (answer.result !== isCorrect) {
                    await answer.update({ result: isCorrect }, { transaction });
                    countUpdated++;
                }

                if (isCorrect) {
                    newScore += 0.25;
                }

            } else if (question?.typeOfQuestion === "DS") {
                if (!answer.answerContent) continue;
                const ans = JSON.parse(answer.answerContent);
                const correctCount = ans.filter(a => statementMap[a.statementId] === a.answer).length;

                if (correctCount === 1) newScore += 0.1;
                else if (correctCount === 2) newScore += 0.25;
                else if (correctCount === 3) newScore += 0.5;
                else if (correctCount >= 4) newScore += 1.0;

            } else if (question?.typeOfQuestion === "TLN") {
                const fullQuestion = await db.Question.findByPk(answer.questionId, { transaction });
                if (!fullQuestion || !answer.answerContent) continue;

                const studentAns = answer.answerContent.trim().replace(',', '.');
                const correctAns = fullQuestion.correctAnswer?.trim().replace(',', '.');
                const check = studentAns === correctAns;

                if (answer.result !== check) {
                    await answer.update({ result: check }, { transaction });
                    countUpdated++;
                }

                if (check) {
                    newScore += 0.5;
                }
            }
        }

        await attempt.update({ score: newScore }, { transaction });
        await transaction.commit();

        return res.status(200).json({
            message: "Chấm lại thành công!",
            updated: countUpdated,
            total: answers.length,
        });

    } catch (error) {
        await transaction.rollback();
        console.error("❌ Lỗi khi chấm lại:", error);
        return res.status(500).json({ message: "Đã xảy ra lỗi khi chấm lại." });
    }
};




export const getAnswerByAttempt = async (req, res) => {
    const { attemptId } = req.params;

    if (!attemptId) {
        return res.status(400).json({ message: "attemptId không hợp lệ!" });
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
        message: "Lấy danh sách đáp án thành công!",
        data: formatted
    });
};

export const getQuestionsAndAnswersByAttempt = async (req, res) => {
    const { attemptId } = req.params;

    if (!attemptId) {
        return res.status(400).json({ message: "attemptId không hợp lệ!" });
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
        return res.status(404).json({ message: "Không tìm thấy lượt làm bài!" });
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
        message: "Lấy danh sách câu hỏi và đáp án thành công!",
        data: {
            questions,
            answers: formattedAnswers,
            exam: {
                name: attempt.exam?.name || "Không rõ",
                id: attempt.exam?.id,
                solutionPdfUrl: attempt.exam?.solutionPdfUrl || null,
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
