// index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AppRoute } from './routes/AppRoute.js';
import db from './models';
import os, { type } from 'os';
import path from 'path';
import { attempt } from 'joi';
import { submitExam } from './controllers/ExamController.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // gộp socket + express

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
const ngrokUrl = process.env.NGROK_URL || 'https://e0af-14-191-32-178.ngrok-free.app';

// Cấu hình middleware
app.use("/images", express.static(path.join(path.resolve(), "public")));
app.use(cookieParser());
app.use(cors({
    origin: [frontendUrl, "http://localhost:8081", "http://localhost:3000", ngrokUrl],
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
        origin: [frontendUrl, ngrokUrl],
        credentials: true,
    }
});

io.on("connection", (socket) => {
    console.log("📡 Client connected:", socket.id);

    socket.on("join_exam", async ({ studentId, examId }) => {
        try {
            // 🔍 Kiểm tra xem đã tồn tại attempt chưa
            let existingAttempt = await db.StudentExamAttempt.findOne({
                where: { studentId, examId, endTime: null }
            });

            if (!existingAttempt) {
                // 👉 Nếu chưa có, thì tạo mới
                existingAttempt = await db.StudentExamAttempt.create({
                    studentId,
                    examId,
                    startTime: new Date(),
                    endTime: null,
                    score: null
                });

                // Tạo các bản ghi answer như trước...
                const exam = await db.Exam.findByPk(examId, {
                    include: [{ model: db.Question, as: "questions" }]
                });

                const answers = exam.questions.map(q => ({
                    attemptId: existingAttempt.id,
                    questionId: q.id,
                    answerContent: "",
                    result: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));

                await db.Answer.bulkCreate(answers);
            }

            // 👉 Trả về thông tin attempt hiện tại (dù cũ hay mới)
            socket.emit("exam_started", {
                attemptId: existingAttempt.id,
                startTime: existingAttempt.startTime
            });

        } catch (err) {
            console.error("join_exam error:", err);
            socket.emit("exam_error", { message: "Lỗi khi bắt đầu bài thi." });
        }
    });

    socket.on("submit_exam", async ({ attemptId }) => {
        await submitExam(socket, attemptId);
    })

    socket.on("select_answer", async ({ attemptId, questionId, answerContent, studentId, type, statementId }) => {
        try {
            const existing = await db.Answer.findOne({ where: { attemptId, questionId } });

            let isCorrect = false;

            if (type === "TN") {
                const statement = await db.Statement.findByPk(answerContent);
                isCorrect = statement?.isCorrect || false;
            } else if (type === "DS") {
                if (!Array.isArray(answerContent)) {
                    throw new Error("Answer content phải là mảng các statement");
                }

                let allCorrect = true;

                for (const item of answerContent) {
                    const statement = await db.Statement.findByPk(item.statementId);
                    if (!statement) continue;

                    const correct = statement.isCorrect === item.answer;

                    if (!correct) {
                        allCorrect = false;
                    }
                }

                isCorrect = allCorrect;
            } else if (type === "TLN") {
                const question = await db.Question.findByPk(questionId);
                const formattedAnswer = answerContent.trim().replace(',', '.');
                isCorrect = question?.correctAnswer === formattedAnswer;
            }

            if (existing) {
                await db.Answer.update(
                    {
                        answerContent: JSON.stringify(answerContent),
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

            console.log("📝 Đã ghi đáp án:", studentId, questionId, answerContent, isCorrect);

            if (type === "DS" && answerContent.length !== 4) {
                return;
            }

            socket.emit("answer_saved", {
                questionId,
                answerContent,
                attemptId,
            });


            } catch (err) {
                console.error("❌ Lỗi khi ghi đáp án:", err);
                socket.emit("answer_error", { message: "Không thể lưu đáp án", questionId });
            }
        });

    const recentCheatLogs = new Map();

    socket.on("user_log", async (data) => {
        const { action, code, attemptId } = data;
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

        console.log("🔍 Log:", action, code, attemptId);

        if (["exit_fullscreen", "tab_blur", "copy_detected", "suspicious_key"].includes(action)) {
            socket.emit("cheating_warning", {
                message: `Phát hiện hành vi nghi vấn: ${action}`,
            });
        }

        // Lưu log vào database
        await db.Cheat.create({
            typeOfCheat: code,
            attemptId,
        });
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
server.listen(port, hostname, () => {
    console.log(`🚀 Server running at http://${hostname}:${port}`);
});
