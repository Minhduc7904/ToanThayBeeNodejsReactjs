import { Op } from "sequelize"
import db from "../models/index.js"
import { uploadImage, cleanupUploadedFiles } from "../utils/imageUpload.js"
import UserType from "../constants/UserType.js"

export const getStatementByQuestionId = async (req, res, next) => {
    const { questionId } = req.params
    const statements = await db.Statement.findAll({
        include: {
            model: db.Question,
            as: 'question',
            where: { questionId },
            attributes: []
        }
    })

    if (!statements || statements.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy mệnh đề nào cho câu hỏi này' })
    }

    return res.status(200).json({ message: 'Danh sách mệnh đề', data: statements })
}

export const getStatementById = async (req, res) => {
    const { id } = req.params
    const statementDetail = await db.Statement.findByPk(id)

    if (!statementDetail) {
        return res.status(404).json({ message: 'Mệnh đề không tồn tại' })
    }
    return res.status(200).json({ message: 'Chi tiết mệnh đề', data: statementDetail })
}

export const postStatement = async (req, res) => {
    const newstatement = await db.Statement.create(req.body)
    return res.status(201).json({ message: 'Thêm mệnh đề thành công', data: newstatement })
}

export const putStatement = async (req, res) => {
    const { id } = req.params
    const [updated] = await db.Statement.update(req.body, {
        where: { id }
    })

    if (!updated) {
        return res.status(404).json({ message: 'Mệnh đề không tồn tại' })
    }

    const updatedStatement = await db.Statement.findByPk(id)
    return res.status(200).json({ message: 'Cập nhật mệnh đề thành công', data: updatedStatement })
}

export const deleteStatement = async (req, res) => {
    const { id } = req.params
    const deleted = await db.Statement.destroy({
        where: { id }
    })

    if (!deleted) {
        return res.status(404).json({ message: 'Mệnh đề không tồn tại' })
    }

    return res.status(200).json({ message: 'Xóa mệnh đề thành công' })
}

export const putStatementImage = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    const { id } = req.params

    try {
        const statement = await db.Statement.findByPk(id, { transaction })

        if (!statement) {
            await transaction.rollback()
            return res.status(404).json({ message: '❌ Mệnh đề không tồn tại.' })
        }

        const oldImageUrl = statement.imageUrl
        const newImageFile = req.file
        let newImageUrl = null
        if (newImageFile) {
            newImageUrl = await uploadImage(newImageFile)
        }

        const [updated] = await db.Statement.update(
            { imageUrl: newImageUrl },
            { where: { id }, transaction }
        )

        if (!updated) {
            await cleanupUploadedFiles([newImageUrl])
            await transaction.rollback()
            return res.status(500).json({ message: '❌ Lỗi khi cập nhật ảnh mệnh đề.' })
        }

        if (oldImageUrl) {
            try {
                await cleanupUploadedFiles([oldImageUrl])
                console.log(`✅ Đã xóa ảnh cũ: ${oldImageUrl}`)
            } catch (err) {
                console.error(`❌ Lỗi khi xóa ảnh cũ: ${oldImageUrl}`, err)
                await cleanupUploadedFiles([newImageUrl])
                await transaction.rollback()
                return res.status(500).json({ message: 'Lỗi khi xóa ảnh cũ.', error: err.message })
            }
        }

        await transaction.commit()

        return res.status(200).json({
            message: '✅ Cập nhật ảnh mệnh đề thành công.',
            oldImageUrl,
            newImageUrl,
        })

    } catch (error) {
        console.error('❌ Lỗi khi cập nhật ảnh mệnh đề:', error)
        await transaction.rollback()
        return res.status(500).json({ message: 'Lỗi server.', error: error.message })
    }
}
