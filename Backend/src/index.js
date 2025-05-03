// index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AppRoute } from './routes/AppRoute.js';
import db from './models/index.js'; // ĐÚNG
import os from 'os';
import path from 'path';
import { submitExam } from './controllers/ExamController.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // gộp socket + express

const port = process.env.PORT || 3000;
// const hostname= '192.168.0.106'
const frontendUrl = process.env.FRONTEND_URL || 'https://toanthaybee.edu.vn';
const ngrokUrl = process.env.NGROK_URL

// Cấu hình middleware
app.use("/images", express.static(path.join(path.resolve(), "public")));
app.use(cookieParser());
const allowedOrigins = [
    frontendUrl,
    'https://toanthaybee.edu.vn',
    ngrokUrl
].filter(Boolean); // loại bỏ undefined nếu có

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS: ' + origin));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization'],
    maxAge: 600, // Cache CORS preflight requests for 10 minutes
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Thêm middleware CORS trước các routes
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/healthcheck", async (req, res) => {
    try {
        await db.sequelize.authenticate();
        return res.status(200).json({
            status: "OK",
            message: "Service is running",
            timestamp: new Date().toISOString(),
            database: "Connected",
            memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            uptime: `${process.uptime().toFixed(2)} seconds`,
            cpuUsage: os.loadavg()
        });
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: "Service is down",
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

// Gắn route
AppRoute(app);

// -------------------------
// 🧠 Socket.IO setup
// -------------------------
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS: ' + origin));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
    },
    transports: ['websocket', 'polling'], // Thêm polling làm fallback
    pingTimeout: 60000, // Tăng timeout để tránh ngắt kết nối
    pingInterval: 25000
});
const prefixTN = ["A", "B", "C", "D"];
io.on("connection", (socket) => {
    console.log("📡 Client connected:", socket.id);

    socket.on("join_exam", async ({ studentId, examId }) => {
        try {

            const exam = await db.Exam.findByPk(examId, {
                include: [{ model: db.Question, as: "questions" }]
            });

            if (!exam) {
                return socket.emit("exam_error", { message: "Đề thi không tồn tại." });
            }

            // 🔍 Lấy tất cả các lần làm bài
            const allAttempts = await db.StudentExamAttempt.findAll({
                where: { studentId, examId },
            });

            const unfinishedAttempt = allAttempts.find(attempt => attempt.endTime === null);

            // 🧠 Nếu đã làm >= giới hạn và tất cả đều hoàn thành => chặn
            const hasReachedLimit = exam.attemptLimit !== null &&
                allAttempts.length >= exam.attemptLimit &&
                !unfinishedAttempt;
            console.log("Đã làm bài:", allAttempts.length, "Giới hạn:", exam.attemptLimit);
            if (hasReachedLimit) {
                return socket.emit("exam_error", {
                    message: "Bạn đã đạt giới hạn số lần làm bài cho phép.",
                });
            }

            // Nếu có bài chưa hoàn thành thì tiếp tục bài cũ
            let currentAttempt = unfinishedAttempt;

            if (!currentAttempt) {
                // 👉 Nếu không có bài nào đang làm, tạo attempt mới
                currentAttempt = await db.StudentExamAttempt.create({
                    studentId,
                    examId,
                    startTime: new Date(),
                    endTime: null,
                    score: null
                });

                // Khởi tạo đáp án
                const answers = exam.questions.map(q => ({
                    attemptId: currentAttempt.id,
                    questionId: q.id,
                    answerContent: "",
                    result: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));

                await db.Answer.bulkCreate(answers);
            }

            // Trả về attempt đang dùng
            socket.emit("exam_started", {
                attemptId: currentAttempt.id,
                startTime: currentAttempt.startTime
            });

        } catch (err) {
            console.log("Lỗi khi tham gia bài thi:", err);
            console.error("join_exam error:", err);
            socket.emit("exam_error", { message: "Lỗi khi bắt đầu bài thi." });
        }
    });

    socket.on("submit_exam", async ({ attemptId }) => {
        await submitExam(socket, attemptId);
    })

    socket.on("select_answer", async ({ attemptId, questionId, answerContent, studentId, type, examId, name }) => {
        try {
            const existing = await db.Answer.findOne({ where: { attemptId, questionId } });
            let answer = '';
            let isCorrect = false;

            if (type === "TN") {
                const statement = await db.Statement.findByPk(answerContent);
                answer = prefixTN[statement.order - 1]
                isCorrect = statement?.isCorrect || false;
            } else if (type === "DS") {
                if (!Array.isArray(answerContent)) {
                    throw new Error("Answer content phải là mảng các statement");
                }

                const statementIds = answerContent.map(item => item.statementId);
                const statements = await db.Statement.findAll({
                    where: { id: statementIds },
                    attributes: ['id', 'order', 'isCorrect']
                });

                const enrichedAnswerContent = answerContent.map(item => {
                    const stmt = statements.find(s => s.id === item.statementId);
                    return {
                        ...item,
                        order: stmt?.order || 0,
                        isCorrect: stmt?.isCorrect
                    };
                }).sort((a, b) => a.order - b.order);

                answer = '';
                let allCorrect = true;

                for (const item of enrichedAnswerContent) {
                    answer += item.answer ? 'Đ ' : 'S ';
                    if (item.isCorrect !== item.answer) {
                        allCorrect = false;
                    }
                }

                isCorrect = allCorrect;
            } else if (type === "TLN") {
                const question = await db.Question.findByPk(questionId);
                const formattedAnswer = answerContent.trim().replace(',', '.');
                isCorrect = question?.correctAnswer === formattedAnswer;
                answer = formattedAnswer;
            }

            if (existing) {
                await db.Answer.update(
                    {
                        answerContent: type === "DS" ? JSON.stringify(answerContent) : answerContent,
                        result: isCorrect
                    },
                    { where: { id: existing.id } }
                );
            } else {
                await db.Answer.create({
                    attemptId,
                    questionId,
                    answerContent,
                    studentId,
                    result: isCorrect
                });
            }


            const isDSFullyAnswered = type === "DS" && Array.isArray(answerContent) && answerContent.length >= 4;

            if (type !== "DS" || isDSFullyAnswered) {
                io.to(`exam-admin-${examId}`).emit("admin_student_answer", {
                    studentId,
                    attemptId,
                    questionId,
                    answerContent: answer,
                    isCorrect,
                    type,
                    name,
                    timestamp: new Date().toISOString(),
                });
            }
            socket.emit("answer_saved", {
                questionId,
                answerContent,
                attemptId,
            });
            console.log("Đã gửi đáp án cho admin:", studentId, questionId, answerContent, isCorrect);

        } catch (err) {
            console.error("Lỗi khi ghi đáp án:", err);
            socket.emit("answer_error", { message: "Không thể lưu đáp án", questionId });
            return;
        }

    });



    socket.on("calculate_score", async ({ attemptId, answers, examId, student }) => {
        try {
            const t = await db.sequelize.transaction();

            // Lấy attempt hiện tại
            const attempt = await db.StudentExamAttempt.findByPk(attemptId, { transaction: t });
            if (!attempt) {
                await t.rollback();
                return socket.emit("score_calculation_error", { message: "Không tìm thấy lượt làm bài." });
            }

            // Lấy tất cả questionIds và statementIds cần thiết
            const questionIds = [];
            const tnStatementIds = [];
            const dsStatementIdsMap = {};

            for (const answer of answers) {
                const { questionId, typeOfQuestion, answerContent } = answer;
                questionIds.push(questionId);

                if (typeOfQuestion === 'TN' && answerContent) {
                    tnStatementIds.push(answerContent);
                } else if (typeOfQuestion === 'DS' && answerContent) {
                    const answersDS = typeof answerContent === 'string' ?
                        JSON.parse(answerContent) : answerContent;

                    if (Array.isArray(answersDS)) {
                        dsStatementIdsMap[questionId] = answersDS.map(a => a.statementId);
                    }
                }
            }

            // Lấy tất cả câu hỏi trong một lần truy vấn
            const questions = await db.Question.findAll({
                where: { id: questionIds },
                transaction: t
            });

            // Tạo map câu hỏi để truy cập nhanh
            const questionMap = {};
            questions.forEach(q => {
                questionMap[q.id] = q;
            });

            // Lấy tất cả statements cho câu hỏi trắc nghiệm
            const allStatementIds = [...tnStatementIds, ...Object.values(dsStatementIdsMap).flat()];
            const statements = await db.Statement.findAll({
                where: { id: allStatementIds },
                transaction: t
            });

            // Tạo map statements để truy cập nhanh
            const statementMap = {};
            statements.forEach(s => {
                statementMap[s.id] = s;
            });

            // Tính điểm
            let totalScore = 0;

            for (const answer of answers) {
                const { questionId, typeOfQuestion, answerContent } = answer;
                const question = questionMap[questionId];
                if (!question) continue;

                if (typeOfQuestion === 'TN') {
                    const statement = statementMap[answerContent];
                    if (statement && statement.isCorrect) {
                        totalScore += 0.25;
                    }
                } else if (typeOfQuestion === 'TLN') {
                    const formattedAnswer = answerContent.trim().replace(',', '.');
                    if (question.correctAnswer === formattedAnswer) {
                        totalScore += 0.5;
                    }
                } else if (typeOfQuestion === 'DS') {
                    let count = 0;
                    if (!answerContent || (Array.isArray(answerContent) && answerContent.length === 0)) continue;

                    const answersDS = typeof answerContent === 'string' ?
                        JSON.parse(answerContent) : answerContent;

                    for (const answerDS of answersDS || []) {
                        const statement = statementMap[answerDS.statementId];
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

            // Cập nhật điểm vào attempt (không cập nhật endTime)
            attempt.score = parseFloat(totalScore.toFixed(2));
            await attempt.save({ transaction: t });

            io.to(`exam-admin-${examId}`).emit("admin_score_calculated", {
                attempt,
                student
            });

            console.log("Đã tính điểm:", attemptId, attempt.score);

            await t.commit();

        } catch (err) {
            console.error("Lỗi khi tính điểm:", err);
            socket.emit("score_calculation_error", { message: "Không thể tính điểm", error: err.message });
        }
    });

    const recentCheatLogs = new Map();
    socket.on("user_log", async (data) => {
        const { action, code, attemptId, examId, name } = data;
        if (!attemptId) return;
        const now = Date.now();
        // ⚠️ Key duy nhất cho mỗi loại hành động và attempt
        const logKey = `${attemptId}-${code}`;

        // Nếu đã log trong vòng 10 giây, thì bỏ qua
        const lastLogged = recentCheatLogs.get(logKey);
        if (lastLogged && now - lastLogged < 10_000) {
            return;
        }

        // Cập nhật timestamp mới
        recentCheatLogs.set(logKey, now);

        console.log("🛡️ User log:",
            action,
            code,
            attemptId,
            examId,
            new Date().toISOString()
        );


        io.to(`exam-admin-${examId}`).emit("admin_user_log", {
            action,
            code,
            attemptId,
            name,
            timestamp: new Date().toISOString(),
        });

        // if (["exit_fullscreen", "tab_blur", "copy_detected", "suspicious_key"].includes(action)) {
        //     socket.emit("cheating_warning", {
        //         message: `Phát hiện hành vi nghi vấn: ${action}`,
        //     });

        // }

        // Lưu log vào database
        await db.Cheat.create({
            typeOfCheat: code,
            attemptId,
        });
    });

    socket.on("admin_join_exam_tracking", ({ examId }) => {
        socket.join(`exam-admin-${examId}`);
        console.log(`📊 Admin joined tracking room for exam ${examId}`);
    });


    socket.on("request_time", ({ examId }) => {
        const remainingTime = 10 * 60;
        socket.emit("exam_timer", { remainingTime });
    });

    socket.on("send_notification", ({ examId, message }) => {
        io.to(`exam-${examId}`).emit("exam_notification", { message });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Khởi chạy server
server.listen(port, () => {
    console.log(`🚀 Server running at port ${port}`);
});
