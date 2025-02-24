import { Sequelize } from "../models"
import db from "../models"

export const getLessonById = async (req, res) => {
    const { id } = req.params
    const lesson = await db.Lesson.findOne({ where: { id } })
    if (!lesson) {
        return res.status(404).json({
            message: `Không tìm thấy buổi học với ID: ${id}!`
        })
    }
    return res.status(200).json({
        message: '✅ Lấy thông tin buổi học thành công!',
        data: lesson
    })
}

export const getLessonByClassId = async (req, res) => {
    const { classId } = req.params

    const lessons = await db.Lesson.findAll({
        where: { classId },
        include: [
            {
                model: db.Class,
                as: 'class',
                attributes: ['id', 'name', 'description'],
            },
        ],
        order: [['createdAt', 'ASC']],
    })

    return res.status(200).json({
        message: '✅ Lấy danh sách buổi học thành công!',
        data: lessons,
    })
}

export const insertLesson = async (req, res) => {
    const t = await db.sequelize.transaction()

    try {
        const newLesson = await db.Lesson.create(req.body, { transaction: t })

        const classUpdated = await db.Class.increment(
            { lessonCount: 1 },
            {
                where: { id: req.body.classId },
                transaction: t
            }
        )

        if (!classUpdated[0]) {
            throw new Error("❌ Không tìm thấy lớp để cập nhật lessonCount.")
        }

        await t.commit()

        return res.status(201).json({
            message: "✅ Tạo buổi học mới thành công và cập nhật lessonCount!",
            data: newLesson,
        })

    } catch (error) {
        await t.rollback()

        return res.status(500).json({
            message: "❌ Lỗi khi tạo buổi học hoặc cập nhật lessonCount.",
            error: error.message,
        })
    }
}

export const changeLesson = async (req, res) => {
    const id = req.params.id
    const lesson = await db.Lesson.findOne({ where: { id } })
    if (!lesson) {
        return res.status(404).json({
            message: `Không tìm thấy buổi học với ID: ${id}!`
        })
    }
    await lesson.update(req.body)
    return res.status(200).json({
        message: '✅ Cập nhật thông tin buổi học thành công!',
    })
}

export const deleteLesson = async (req, res) => {
    const { id } = req.params
    const lesson = await db.Lesson.findOne({ where: { id } })
    if (!lesson) {
        return res.status(404).json({
            message: `Không tìm thấy buổi học với ID: ${id}!`
        })
    }
    const deleted = await lesson.destroy()
    return res.status(200).json({
        message: '✅ Xóa buổi học thành công!',
    })
}
