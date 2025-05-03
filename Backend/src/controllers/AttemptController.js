import db from "../models/index.js"

const { Op, literal, QueryTypes } = db.Sequelize;

export const getAttemptsByUser = async (req, res) => {
    const { id } = req.user;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Raw SQL để count tổng số bản ghi sau khi lọc
    const countResult = await db.sequelize.query(
        `
        SELECT COUNT(*) as total
        FROM \`studentExamAttempt\` AS s
        INNER JOIN \`exam\` AS e ON s.\`examId\` = e.\`id\`
        WHERE s.\`studentId\` = :studentId
        AND s.\`endTime\` IS NOT NULL
        AND s.\`score\` IS NOT NULL
        AND e.\`seeCorrectAnswer\` = true
        `,
        {
            replacements: { studentId: id },
            type: QueryTypes.SELECT,
        }
    );

    const count = parseInt(countResult[0].total, 10);

    // Truy vấn dữ liệu sau khi lọc, có phân trang
    const attempts = await db.StudentExamAttempt.findAll({
        where: {
            studentId: id,
            endTime: { [Op.ne]: null },
            score: { [Op.ne]: null },
        },
        include: [
            {
                model: db.Exam,
                as: "exam",
                attributes: ["name", "seeCorrectAnswer"],
                where: { seeCorrectAnswer: true }, // lọc ngay trong include
            },
        ],
        order: [["endTime", "DESC"]],
        offset,
        limit,
    });

    const attemptsWithDuration = attempts.map((attempt) => {
        const start = new Date(attempt.startTime);
        const end = new Date(attempt.endTime);
        const durationMs = end - start;

        return {
            ...attempt.toJSON(),
            duration: `${Math.floor(durationMs / 1000 / 60)} phút ${Math.floor((durationMs / 1000) % 60)} giây`,
        };
    });

    return res.status(200).json({
        message: "Lấy danh sách lượt làm bài thành công!",
        data: {
            data: attemptsWithDuration,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            limit,
        },
    });
};


export const getAttemptById = async (req, res) => {
    const { id } = req.params
    const attempt = await db.StudentExamAttempt.findByPk(id)

    if (!attempt) {
        return res.status(404).json({ message: 'Không tìm thấy lượt làm bài.' })
    }

    return res.status(200).json({ message: 'Lấy chi tiết lượt làm bài thành công!', data: attempt })
}

export const getAttemptByExamId = async (req, res) => {
    const { examId } = req.params;
    const { id } = req.user;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    // Kiểm tra đề thi
    const exam = await db.Exam.findByPk(examId);
    if (!exam) {
        return res.status(404).json({ message: 'Không tìm thấy đề thi!' });
    }

    if (!exam.public) {
        return res.status(403).json({ message: '🚫 Đề thi này hiện không được công khai!' });
    }

    if (!exam.seeCorrectAnswer) {
        return res.status(403).json({ message: '🚫 Đề thi này hiện không cho phép xem đáp án!' });
    }

    // Lấy danh sách attempts theo điểm cao ↓ (sẽ lọc + sắp lại theo thời gian sau)
    const { rows, count } = await db.StudentExamAttempt.findAndCountAll({
        where: {
            examId,
            endTime: { [db.Sequelize.Op.ne]: null },
            score: { [db.Sequelize.Op.ne]: null },
        },
        include: [
            {
                model: db.User,
                as: 'student',
                attributes: ['firstName', 'lastName', 'avatarUrl', 'id', 'highSchool', 'class', 'graduationYear'],
            }
        ],
        order: [['score', 'DESC']],
        limit: 1000, // lấy nhiều hơn rồi tự phân trang sau
    });

    // Tính duration + sort theo duration tăng dần nếu score bằng nhau
    const attemptsWithDuration = rows
        .map(attempt => {
            const start = new Date(attempt.startTime);
            const end = new Date(attempt.endTime);
            const durationMs = end - start;

            return {
                ...attempt.toJSON(),
                durationMs,
                duration: `${Math.floor(durationMs / 1000 / 60)} phút ${Math.floor((durationMs / 1000) % 60)} giây`,
                durationInSeconds: Math.floor(durationMs / 1000)
            };
        })
        .sort((a, b) => {
            // Sắp theo score giảm dần, nếu bằng thì so sánh thời gian làm bài tăng dần
            if (b.score !== a.score) return b.score - a.score;
            return a.durationMs - b.durationMs;
        });

    // Tìm rank của người dùng hiện tại
    let userRank = null;
    let userBestAttempt = null;

    // Tìm lượt làm bài tốt nhất của người dùng hiện tại
    const userAttempts = attemptsWithDuration.filter(attempt => attempt.studentId === id);
    const userAttemptCount = userAttempts.length;
    if (userAttempts.length > 0) {
        // Lấy lượt làm bài có điểm cao nhất của người dùng
        userBestAttempt = userAttempts[0]; // Đã được sắp xếp theo điểm cao nhất rồi

        // Tìm rank của người dùng trong danh sách
        userRank = attemptsWithDuration.findIndex(attempt =>
            attempt.id === userBestAttempt.id
        ) + 1; // +1 vì index bắt đầu từ 0
    }

    // Phân trang sau khi sort
    const paginated = attemptsWithDuration.slice(offset, offset + limit);

    return res.status(200).json({
        message: 'Lấy danh sách lượt làm bài theo mã đề thành công!',
        data: {
            attempts: paginated,
            currentPage: page,
            totalPages: Math.ceil(attemptsWithDuration.length / limit),
            totalItems: attemptsWithDuration.length,
            exam: {
                name: exam.name,
                attemptLimit: exam.attemptLimit,
                seeCorrectAnswer: exam.seeCorrectAnswer,
            },
            limit,
            userAttemptCount,
            userRank, // Thêm rank của người dùng vào response
            userBestAttempt, // Thêm thông tin lượt làm bài tốt nhất của người dùng

        },
    });
};

export const getAttemptsForAdminByExamId = async (req, res) => {
    const { examId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search?.toLowerCase() || "";

    const exam = await db.Exam.findByPk(examId);
    if (!exam) {
        return res.status(404).json({ message: "Không tìm thấy đề thi!" });
    }

    const whereClause = {
        examId,
    };

    const userWhereClause = search
        ? {
            [Op.or]: [
                db.Sequelize.where(
                    db.Sequelize.fn(
                        'LOWER',
                        db.Sequelize.fn('CONCAT', db.Sequelize.col('student.lastName'), ' ', db.Sequelize.col('student.firstName'))
                    ),
                    {
                        [Op.like]: `%${search}%`,
                    }
                ),
                db.Sequelize.where(
                    db.Sequelize.fn('LOWER', db.Sequelize.col('student.class')),
                    {
                        [Op.like]: `%${search}%`,
                    }
                ),
            ],
        }
        : {};

    const { rows, count } = await db.StudentExamAttempt.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: db.User,
                as: "student",
                where: userWhereClause,
                attributes: ["firstName", "lastName", "avatarUrl", "id", "highSchool", "class", "graduationYear"],
                required: true,
            },
        ],
        order: [["score", "DESC"]],
        offset,
        limit,
    });

    const attemptsWithDuration = rows.map((attempt) => {
        const start = new Date(attempt.startTime);
        const end = new Date(attempt.endTime);
        console.log("end", end);
        if (!end || new Date(end).getTime() === 0) {
            return {
                ...attempt.toJSON(),
                durationMs: null,
                duration: null,
                durationInSeconds: null,
            };
        }

        const durationMs = end - start;

        return {
            ...attempt.toJSON(),
            duration: `${Math.floor(durationMs / 1000 / 60)} phút ${Math.floor((durationMs / 1000) % 60)} giây`,
        };
    });

    return res.status(200).json({
        message: "Lấy danh sách lượt làm bài (admin) thành công!",
        data: {
            data: attemptsWithDuration,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            exam: {
                name: exam.name,
            },
            limit,
        },
    });
};



export const getAttemptByStudentId = async (req, res) => {
    const studentId = req.user.id;
    const examId = req.params.examId;

    // 📌 Kiểm tra đề thi
    const exam = await db.Exam.findByPk(examId);
    if (!exam) {
        return res.status(404).json({ message: 'Không tìm thấy đề thi!' });
    }
    if (!exam.public) {
        return res.status(403).json({ message: '🚫 Đề thi này hiện không được công khai!' });
    }
    if (exam.seeCorrectAnswer === false) {
        return res.status(403).json({ message: '🚫 Đề thi này hiện không cho phép xem đáp án!' });
    }

    // 📌 Lấy danh sách lượt làm bài
    const attempts = await db.StudentExamAttempt.findAll({
        where: { studentId, examId },
        order: [['startTime', 'DESC']],
    });

    // 📌 Tính duration cho mỗi attempt
    const formattedAttempts = attempts.map(attempt => {
        let duration = null;

        if (attempt.endTime && attempt.startTime) {
            const durationMs = new Date(attempt.endTime) - new Date(attempt.startTime);

            const seconds = Math.floor((durationMs / 1000) % 60);
            const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
            const hours = Math.floor((durationMs / (1000 * 60 * 60)));

            duration = hours > 0
                ? `${hours} giờ ${minutes} phút ${seconds} giây`
                : `${minutes} phút ${seconds} giây`;
        }

        return {
            ...attempt.toJSON(),
            duration,
        };
    });

    return res.status(200).json({
        message: 'Lấy danh sách lượt làm bài theo mã sinh viên thành công!',
        data: formattedAttempts,
        exam: {
            name: exam.name,
            seeCorrectAnswer: exam.seeCorrectAnswer,
        },
    });
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
    return res.status(201).json({ message: 'Thêm lượt làm bài thành công!', data: newAttempt })
}

export const putAttempt = async (req, res) => {
    return res.status(200).json({ message: '🔧 Chức năng đang phát triển!' })
}

export const deleteAttempt = async (req, res) => {
    const { id } = req.params
    const attempt = await db.StudentExamAttempt.findByPk(id)

    if (!attempt) {
        return res.status(404).json({ message: 'Không tìm thấy lượt làm bài để xóa.' })
    }

    await attempt.destroy()

    return res.status(200).json({ message: 'Xóa lượt làm bài thành công!' })
}
