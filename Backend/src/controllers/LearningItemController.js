import { Sequelize } from "../models"
import db from "../models"

export const getLearningItemById = async (req, res) => {
    const { id } = req.params
    const learningItem = await db.LearningItem.findOne({ where: { id } })
    if (!learningItem) {
        return res.status(404).json({
            message: `❌ Không tìm thấy mục học tập với ID: ${id}!`
        })
    }
    return res.status(200).json({
        message: '✅ Lấy thông tin mục học tập thành công!',
        data: learningItem
    })

}

export const getLearningItemByLesson = async (req, res) => {
    const { lessonId } = req.params
    const find = await db.Lesson.findByPk(lessonId)
    if (!find) {
        return res.status(404).json({
            message: `❌ Không tìm thấy buổi học với ID: ${lessonId}!`
        })
    }
    const learningItems = await db.LearningItem.findAll({
        where: { lessonId },
        include: [
            {
                model: db.Lesson,
                as: 'lesson',
                attributes: ['id', 'name', 'description']
            }
        ],
        order: [['createdAt', 'ASC']]
    })

    return res.status(200).json({
        message: '✅ Lấy danh sách mục học tập thành công!',
        data: learningItems
    })

}

export const postLearningItem = async (req, res) => {
    const t = await db.sequelize.transaction()
    try {
        const newLearningItem = await db.LearningItem.create(req.body, { transaction: t })

        const lessonUpdated = await db.Lesson.increment(
            { learningItemCount: 1 },
            {
                where: { id: req.body.lessonId },
                transaction: t
            }
        )

        if (!lessonUpdated[0]) {
            throw new Error("❌ Không tìm thấy buổi học để cập nhật learningItemCount.")
        }

        await t.commit()

        return res.status(201).json({
            message: "✅ Thêm mục học tập mới thành công và cập nhật learningItemCount!",
            data: newLearningItem
        })
    } catch (error) {
        await t.rollback()
        return res.status(500).json({
            message: "❌ Lỗi khi thêm mục học tập hoặc cập nhật learningItemCount.",
            error: error.message
        })
    }
}

export const putLearningItem = async (req, res) => {
    const { id } = req.params
    const learningItem = await db.LearningItem.findOne({ where: { id } })
    if (!learningItem) {
        return res.status(404).json({
            message: `❌ Không tìm thấy mục học tập với ID: ${id}!`
        })
    }

    await learningItem.update(req.body)
    return res.status(200).json({
        message: "✅ Cập nhật thông tin mục học tập thành công!",
        data: learningItem
    })
}

export const deleteLearningItem = async (req, res) => {
    const { id } = req.params
    const t = await db.sequelize.transaction()

    try {
        const learningItem = await db.LearningItem.findOne({ where: { id } })
        if (!learningItem) {
            return res.status(404).json({
                message: `❌ Không tìm thấy mục học tập với ID: ${id}!`
            })
        }

        await learningItem.destroy({ transaction: t })

        await db.Lesson.decrement(
            { learningItemCount: 1 },
            {
                where: { id: learningItem.lessonId },
                transaction: t
            }
        )

        await t.commit()

        return res.status(200).json({
            message: "✅ Xóa mục học tập thành công và cập nhật learningItemCount!"
        })
    } catch (error) {
        await t.rollback()
        return res.status(500).json({
            message: "❌ Lỗi khi xóa mục học tập hoặc cập nhật learningItemCount.",
            error: error.message
        })
    }
}
