// index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AppRoute } from './routes/AppRoute.js';
import db from './models/index.js'; // ✅ ĐÚNG
import os from 'os';
import path from 'path';
import { submitExam } from './controllers/ExamController.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // gộp socket + express

const port = process.env.PORT || 3000;
// const hostname= '192.168.0.106'
const frontendUrl = process.env.FRONTEND_URL || 'https://toanthaybee.edu.vn';
const ngrokUrl = process.env.NGROK_URL || 'https://4e04-14-191-32-178.ngrok-free.app';

// Cấu hình middleware
app.use("/images", express.static(path.join(path.resolve(), "public")));
app.use(cookieParser());
app.use(cors({
    origin: [frontendUrl, "https://toanthaybee.edu.vn", "http://localhost:8081", "http://192.168.147.164:8081", "https://toanthaybee.edu.vn", 'http://localhost:4000', ngrokUrl],
    // origin: "*",
    credentials: true,
}));
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
        origin: [frontendUrl, ngrokUrl, "https://toan-thay-bee-frontend-reactjs-d5fo.vercel.app", "http://localhost:8081", 'http://localhost:4000'],
        // origin: "*",
        credentials: true,
    }
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

            // ✅ Nếu có bài chưa hoàn thành thì tiếp tục bài cũ
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
            console.log("❌ Lỗi khi tham gia bài thi:", err);
            console.error("join_exam error:", err);
            socket.emit("exam_error", { message: "Lỗi khi bắt đầu bài thi." });
        }
    });

    socket.on("submit_exam", async ({ attemptId }) => {
        await submitExam(socket, attemptId);
    })

    socket.on("select_answer", async ({ attemptId, questionId, answerContent, studentId, type, statementId, examId, name }) => {
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

           
            console.log('', examId)
            if (type === "DS" && answerContent.length !== 4) {
                return;
            }

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
            socket.emit("answer_saved", {
                questionId,
                answerContent,
                attemptId,
            });

            console.log("Đã gửi đáp án cho admin:", studentId, questionId, answerContent, isCorrect);

        } catch (err) {
            console.error("❌ Lỗi khi ghi đáp án:", err);
            socket.emit("answer_error", { message: "Không thể lưu đáp án", questionId });
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
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Khởi chạy server
server.listen(port, () => {
    console.log(`🚀 Server running at port ${port}`);
});
