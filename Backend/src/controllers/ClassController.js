import { Sequelize } from "../models"
import db from "../models"
import ResponseClass from "../dtos/responses/class/ClassResponse"
const { Class } = db
import StudentClassStatus from "../constants/StudentClassStatus"
import { Op } from "sequelize"


export const getPublicClass = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    const whereClause = {
        public: true,
        ...(search.trim() && {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { status: { [Op.like]: `%${search}%` } },
            ],
        }),
    }

    const { rows: classes, count: total } = await Class.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
        message: '✅ Lấy danh sách lớp thành công!',
        data: classes,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    })
}

export const getAllClass = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit
    const sortOrder = req.query.sortOrder || 'DESC'

    const whereClause = {
        ...(search.trim() && {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { status: { [Op.like]: `%${search}%` } },
            ],
        }),
    }

    const { rows: classes, count: total } = await Class.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', sortOrder]],
    })

    return res.status(200).json({
        message: '✅ Lấy danh sách lớp thành công!',
        data: classes,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    })
}

export const getDetailClassByAdmin = async (req, res) => {
    const id = req.params.id

    const classItem = await db.Class.findOne({ where: { id } })

    if (!classItem) {
        return res.status(404).json({
            message: `Không tìm thấy lớp với ID: ${id}!`
        })
    }

    return res.status(200).json({
        message: '✅ Lấy thông tin lớp thành công!',
        data: classItem,
    })
}

export const getDetailClassByUser = async (req, res) => {
    const userId = req.user.id
    const id = req.params.id

    const classItem = await db.Class.findOne({ where: { id } })

    if (!classItem) {
        return res.status(404).json({
            message: `Không tìm thấy lớp với ID: ${id}!`
        })
    }

    const { status } = await db.StudentClassStatus.findOne({
        where: { studentId: userId, classId: id }
    })

    if (!status) {
        status = StudentClassStatus.NOT_JOINED
    }

    return res.status(200).json({
        message: '✅ Lấy thông tin lớp thành công!',
        data: classItem,
        studentClassStatus: status
    })
}

export const getClassByUser = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    const userId = req.user.id

    const whereClause = search.trim() ? {
        [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } },
        ],
    } : {}

    const classes = await db.StudentClassStatus.findAll({
        where: { studentId: userId },
        include: [
            {
                model: db.Class,
                as: 'class',
                where: whereClause,
            },
        ],
        limit,
        offset,
    })

    const formattedClasses = classes.map(classRecord => {
        const lop = classRecord.class
        const status = classRecord.status
        return new ResponseClass(lop, status)
    })
    const total = formattedClasses.length

    return res.status(200).json({
        message: '✅ Lấy danh sách lớp theo người dùng thành công!',
        data: formattedClasses,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    })
}

export const postClass = async (req, res) => {
    const newClass = await Class.create(req.body)
    return res.status(201).json({
        message: 'Tạo lớp học thành công',
        newClass
    })
}

export const putClass = async (req, res) => {
    const { id } = req.params

    const forbiddenFields = ['id', 'createdAt', 'updatedAt']

    const updatedData = Object.keys(req.body)
        .filter(key => !forbiddenFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = req.body[key]
            return obj
        }, {})

    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: 'Không có trường hợp lệ để cập nhật.' })
    }

    const [updated] = await Class.update(updatedData, { where: { id } })

    if (!updated) {
        return res.status(404).json({ message: 'Lớp học không tồn tại' })
    }

    const updatedClass = await Class.findByPk(id)

    return res.status(200).json({ message: 'Cập nhật lớp học thành công', data: new ResponseClass(updatedClass) })
}

export const deleteClass = async (req, res) => {
    const { id } = req.params

    const deleted = await Class.destroy({ where: { id } })

    if (!deleted) {
        return res.status(404).json({ message: 'Lớp học không tồn tại' })
    }

    return res.status(200).json({ message: 'Xóa lớp học thành công' })
}

export const joinClass = async (req, res) => {
    const userId = req.user.id;
    const { classId } = req.params;

    // Mở transaction
    const transaction = await db.sequelize.transaction();

    try {
        // ✅ 1. Kiểm tra lớp có công khai không
        const classInfo = await db.Class.findOne({ where: { id: classId }, transaction });
        if (!classInfo || !classInfo.public) {
            await transaction.rollback(); // 🔥 Rollback nếu lớp không công khai
            return res.status(400).json({ message: "Không thể tham gia lớp học này!" });
        }

        // ✅ 2. Thêm học sinh vào bảng `StudentClassStatus`
        const insert = await db.StudentClassStatus.create({
            studentId: userId,
            classId,
            status: StudentClassStatus.WAITED
        }, { transaction });

        if (!insert) {
            await transaction.rollback(); // 🔥 Rollback nếu không thêm được học sinh
            return res.status(500).json({ message: "Tham gia lớp học không thành công!" });
        }

        // ✅ 3. Cập nhật `studentCount` +1 trong bảng `Class`
        await db.Class.update(
            { studentCount: db.sequelize.literal('studentCount + 1') }, // 🔥 Cộng dồn
            { where: { id: classId }, transaction }
        );

        // ✅ 4. Commit transaction nếu mọi thứ thành công
        await transaction.commit();

        return res.status(200).json({ message: "Tham gia lớp học thành công!" });

    } catch (error) {
        // ❌ Nếu có lỗi, rollback transaction
        await transaction.rollback();
        console.error("❌ Lỗi khi tham gia lớp học:", error);
        return res.status(500).json({ message: "Lỗi server khi tham gia lớp học!" });
    }
};

export const acceptStudentJoinClass = async (req, res) => {
    const { studentId, classId } = req.params;

    const transaction = await db.sequelize.transaction();

    try {
        const update = await db.StudentClassStatus.update(
            { status: StudentClassStatus.JOINED },
            {
                where: { studentId, classId },
                transaction,
            }
        );

        if (!update[0]) {
            await transaction.rollback();
            return res.status(500).json({ message: 'Chấp nhận học viên tham gia lớp học không thành công!' });
        }

        const lessons = await db.Lesson.findAll({
            where: { classId },
            include: [{
                model: db.LearningItem,
                as: 'learningItems',
                attributes: ['id'],
            }],
            transaction,
        });

        const learningItemIds = lessons.flatMap(lesson =>
            lesson.learningItems?.map(item => item.id) || []
        );

        if (learningItemIds.length > 0) {
            const studentStudyStatuses = learningItemIds.map(learningItemId => ({
                studentId,
                learningItemId,
                isDone: false,
                studyTime: null,
            }));

            await db.StudentStudyStatus.bulkCreate(studentStudyStatuses, { transaction });
        }

        await transaction.commit();
        return res.status(200).json({ message: 'Chấp nhận học viên tham gia lớp học thành công!' });

    } catch (error) {
        console.error('Error accepting student into class:', error);
        await transaction.rollback();
        return res.status(500).json({ message: 'Có lỗi xảy ra khi chấp nhận học viên tham gia lớp học.' });
    }
};

export const kickStudentFromClass = async (req, res) => {
    const { studentId, classId } = req.params
    const deleteRecord = await db.StudentClassStatus.destroy({
        where: {
            studentId,
            classId
        }
    })
    if (deleteRecord) {
        return res.status(200).json({ message: 'Xóa học viên khỏi lớp học thành công!' })
    }
    return res.status(500).json({ message: 'Xóa học viên khỏi lớp học không thành công!' })
}