import { Sequelize } from "../models";
import db from "../models";
// BuoiHocController.js

// Lấy chi tiết một buổi học theo id
// GET http://localhost:3000/api/buoi-hoc/:id
export const getLessonById = async (req, res) => {
    const { id } = req.params
    const lesson = await db.Lesson.findOne({ where: { id } })
    if (!lesson) {
        return res.status(404).json({
            message: `Không tìm thấy buổi học với ID: ${id}!`
        });
    }
    return res.status(200).json({
        message: '✅ Lấy thông tin buổi học thành công!',
        data: lesson
    });
};

// Lấy danh sách buổi học theo id của lớp
// GET http://localhost:3000/api/buoi-hoc/lop/:ma_lop
export const getLessonByClassId = async (req, res) => {
    const { classId } = req.params;

    const lessons = await db.Lesson.findAll({
        where: { classId },
        include: [
            {
                model: db.Class,
                as: 'class', // 🔑 Trùng với alias trong Lesson.belongsTo
                attributes: ['id', 'name', 'description'], // Lấy thuộc tính cần thiết từ Class
            },
        ],
        order: [['createdAt', 'ASC']], // 👉 Sắp xếp theo thời gian tạo
    });

    return res.status(200).json({
        message: '✅ Lấy danh sách buổi học thành công!',
        data: lessons,
    });
};

// Thêm một buổi học mới
// POST http://localhost:3000/api/buoi-hoc
export const insertLesson = async (req, res) => {
    const newLesson = await db.Lesson.create(req.body);
    return res.status(201).json({
        message: '✅ Tạo buổi học mới thành công!',
        data: newLesson,
    });
};

// Cập nhật thông tin một buổi học
// PUT http://localhost:3000/api/buoi-hoc/:id
export const changeLesson = async (req, res) => {
    const id = req.params.id;
    const lesson = await db.Lesson.findOne({ where: { id } });
    if (!lesson) {
        return res.status(404).json({
            message: `Không tìm thấy buổi học với ID: ${id}!`
        });
    }
    await lesson.update(req.body);
    return res.status(200).json({
        message: '✅ Cập nhật thông tin buổi học thành công!',
    });
};

// Xóa một buổi học theo id
// DELETE http://localhost:3000/api/buoi-hoc/:id
export const deleteLesson = async (req, res) => {
    const { id } = req.params;
    const lesson = await db.Lesson.findOne({ where: { id } });
    if (!lesson) {
        return res.status(404).json({
            message: `Không tìm thấy buổi học với ID: ${id}!`
        });
    }
    const deleted = await lesson.destroy();
    return res.status(200).json({
        message: '✅ Xóa buổi học thành công!',
    });
};
