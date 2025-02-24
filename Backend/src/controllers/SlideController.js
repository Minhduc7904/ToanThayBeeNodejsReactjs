import { Sequelize, Op } from "sequelize"
import db from "../models/index.js"
import { formatImageUrl, checkLocalImageExists } from "../utils/imageHelper.js"

export const getSlides = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    let whereClause = {}
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ]
        }
    }

    const [slideList, total] = await Promise.all([
        db.Slide.findAll({ where: whereClause, offset, limit }),
        db.Slide.count({ where: whereClause })
    ])

    return res.status(200).json({
        message: "Danh sách slide",
        data: slideList,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    })

}

export const getSlideById = async (req, res) => {
    const { id } = req.params
    const slideDetail = await db.Slide.findByPk(id)

    if (!slideDetail) {
        return res.status(404).json({ message: "Slide không tồn tại" })
    }

    return res.status(200).json({
        message: "Chi tiết slide",
        data: slideDetail
    })

}

export const postSlide = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    try {
        const { title, description, images } = req.body

        if (!title || !images || !images.length) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ!" })
        }

        const newSlide = await db.Slide.create(
            { title, description },
            { transaction }
        )

        for (let imageUrl of images) {
            if (!checkLocalImageExists(imageUrl)) {
                return res.status(400).json({ message: `❌ Ảnh '${imageUrl}' không tồn tại trên server!` })
            }
        }

        const slideImages = await Promise.all(
            images.map(async (imageUrl) => {
                return await db.SlideImage.create(
                    {
                        slideId: newSlide.id,
                        imageUrl: formatImageUrl(imageUrl)
                    },
                    { transaction }
                )
            })
        )

        await transaction.commit()

        return res.status(201).json({
            message: "✅ Thêm slide thành công!",
            slide: newSlide,
            images: slideImages
        })
    } catch (error) {
        await transaction.rollback()
        console.error("❌ Lỗi khi thêm slide:", error)
        return res.status(500).json({ message: "Lỗi server", error: error.message })
    }
}

export const putSlide = async (req, res) => {
    const { id } = req.params
    const [updated] = await db.Slide.update(req.body, {
        where: { id }
    })

    if (!updated) {
        return res.status(404).json({ message: "Slide không tồn tại" })
    }

    const updatedSlide = await db.Slide.findByPk(id)
    return res.status(200).json({ message: "Cập nhật slide thành công", data: updatedSlide })

}

export const deleteSlide = async (req, res) => {
    const { id } = req.params
    const deleted = await db.Slide.destroy({ where: { id } })

    if (!deleted) {
        return res.status(404).json({ message: "Slide không tồn tại" })
    }

    return res.status(200).json({ message: "Xóa slide thành công" })

}
