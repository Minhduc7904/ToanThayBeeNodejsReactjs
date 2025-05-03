import db from "../models/index.js"
import { Op } from "sequelize"
import { uploadImage, cleanupUploadedFiles } from "../utils/imageUpload.js"

// Achievement Categories CRUD operations
export const getAllAchievementCategories = async (req, res) => {
    try {
        const search = req.query.search || ''
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 10
        const offset = (page - 1) * limit
        const sortOrder = req.query.sortOrder || 'ASC'
        const sortBy = req.query.sortBy || 'display_order'

        let whereClause = {}
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { id: { [Op.like]: `%${search}%` } },
                    { label: { [Op.like]: `%${search}%` } },
                    { title: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            }
        }

        const [categories, total] = await Promise.all([
            db.AchievementCategory.findAll({
                where: whereClause,
                order: [[sortBy, sortOrder]],
                limit,
                offset
            }),
            db.AchievementCategory.count({ where: whereClause })
        ])

        return res.status(200).json({
            message: 'Danh sách danh mục thành tích',
            data: categories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const getAchievementCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const category = await db.AchievementCategory.findByPk(id, {
            include: [
                { model: db.AchievementStat, as: 'stats', order: [['display_order', 'ASC']] },
                { model: db.AchievementImage, as: 'images', order: [['display_order', 'ASC']] }
            ]
        })

        if (!category) {
            return res.status(404).json({ message: 'Danh mục thành tích không tồn tại' })
        }

        return res.status(200).json({
            message: 'Chi tiết danh mục thành tích',
            data: category
        })
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết danh mục thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const createAchievementCategory = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    try {
        const { id, label, title, description, display_order, stats, images } = req.body

        // Validate required fields
        if (!id || !label || !title || !description || display_order === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
        }

        // Check if category with this ID already exists
        const existingCategory = await db.AchievementCategory.findByPk(id)
        if (existingCategory) {
            return res.status(400).json({ message: 'ID danh mục đã tồn tại' })
        }

        // Create the category
        const newCategory = await db.AchievementCategory.create(
            { id, label, title, description, display_order },
            { transaction }
        )

        // Create stats if provided
        if (stats && stats.length > 0) {
            await Promise.all(
                stats.map(async (stat, index) => {
                    return await db.AchievementStat.create(
                        {
                            category_id: newCategory.id,
                            value: stat.value,
                            label: stat.label,
                            display_order: stat.display_order || index
                        },
                        { transaction }
                    )
                })
            )
        }

        // Create images if provided
        if (images && images.length > 0) {
            await Promise.all(
                images.map(async (image, index) => {
                    return await db.AchievementImage.create(
                        {
                            category_id: newCategory.id,
                            image_url: image.image_url,
                            caption: image.caption,
                            display_order: image.display_order || index,
                            is_featured: image.is_featured || false
                        },
                        { transaction }
                    )
                })
            )
        }

        await transaction.commit()

        // Fetch the created category with its related data
        const createdCategory = await db.AchievementCategory.findByPk(newCategory.id, {
            include: [
                { model: db.AchievementStat, as: 'stats' },
                { model: db.AchievementImage, as: 'images' }
            ]
        })

        return res.status(201).json({
            message: 'Tạo danh mục thành tích thành công',
            data: createdCategory
        })
    } catch (error) {
        await transaction.rollback()
        console.error('Lỗi khi tạo danh mục thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const updateAchievementCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { label, title, description, display_order } = req.body

        // Check if category exists
        const category = await db.AchievementCategory.findByPk(id)
        if (!category) {
            return res.status(404).json({ message: 'Danh mục thành tích không tồn tại' })
        }

        // Update the category
        const [updated] = await db.AchievementCategory.update(
            { label, title, description, display_order },
            { where: { id } }
        )

        if (!updated) {
            return res.status(400).json({ message: 'Cập nhật danh mục thành tích thất bại' })
        }

        const updatedCategory = await db.AchievementCategory.findByPk(id)
        return res.status(200).json({
            message: 'Cập nhật danh mục thành tích thành công',
            data: updatedCategory
        })
    } catch (error) {
        console.error('Lỗi khi cập nhật danh mục thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const deleteAchievementCategory = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    try {
        const { id } = req.params

        // Check if category exists
        const category = await db.AchievementCategory.findByPk(id)
        if (!category) {
            return res.status(404).json({ message: 'Danh mục thành tích không tồn tại' })
        }

        // Delete related stats and images (cascade delete should handle this, but being explicit)
        await db.AchievementStat.destroy({ where: { category_id: id }, transaction })
        await db.AchievementImage.destroy({ where: { category_id: id }, transaction })

        // Delete the category
        await db.AchievementCategory.destroy({ where: { id }, transaction })

        await transaction.commit()
        return res.status(200).json({ message: 'Xóa danh mục thành tích thành công' })
    } catch (error) {
        await transaction.rollback()
        console.error('Lỗi khi xóa danh mục thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

// Achievement Stats CRUD operations
export const getAllAchievementStats = async (req, res) => {
    try {
        const { category_id } = req.query
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 10
        const offset = (page - 1) * limit
        const sortOrder = req.query.sortOrder || 'ASC'

        let whereClause = {}
        if (category_id) {
            whereClause.category_id = category_id
        }

        const [stats, total] = await Promise.all([
            db.AchievementStat.findAll({
                where: whereClause,
                order: [['display_order', sortOrder]],
                limit,
                offset,
                include: [{ model: db.AchievementCategory, as: 'category' }]
            }),
            db.AchievementStat.count({ where: whereClause })
        ])

        return res.status(200).json({
            message: 'Danh sách thống kê thành tích',
            data: stats,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thống kê thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const getAchievementStatById = async (req, res) => {
    try {
        const { id } = req.params
        const stat = await db.AchievementStat.findByPk(id, {
            include: [{ model: db.AchievementCategory, as: 'category' }]
        })

        if (!stat) {
            return res.status(404).json({ message: 'Thống kê thành tích không tồn tại' })
        }

        return res.status(200).json({
            message: 'Chi tiết thống kê thành tích',
            data: stat
        })
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết thống kê thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const createAchievementStat = async (req, res) => {
    try {
        const { category_id, value, label, display_order } = req.body

        // Validate required fields
        if (!category_id || !value || !label || display_order === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
        }

        // Check if category exists
        const category = await db.AchievementCategory.findByPk(category_id)
        if (!category) {
            return res.status(404).json({ message: 'Danh mục thành tích không tồn tại' })
        }

        // Create the stat
        const newStat = await db.AchievementStat.create({
            category_id,
            value,
            label,
            display_order
        })

        return res.status(201).json({
            message: 'Tạo thống kê thành tích thành công',
            data: newStat
        })
    } catch (error) {
        console.error('Lỗi khi tạo thống kê thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const updateAchievementStat = async (req, res) => {
    try {
        const { id } = req.params
        const { value, label, display_order } = req.body

        // Check if stat exists
        const stat = await db.AchievementStat.findByPk(id)
        if (!stat) {
            return res.status(404).json({ message: 'Thống kê thành tích không tồn tại' })
        }

        // Update the stat
        const [updated] = await db.AchievementStat.update(
            { value, label, display_order },
            { where: { id } }
        )

        if (!updated) {
            return res.status(400).json({ message: 'Cập nhật thống kê thành tích thất bại' })
        }

        const updatedStat = await db.AchievementStat.findByPk(id)
        return res.status(200).json({
            message: 'Cập nhật thống kê thành tích thành công',
            data: updatedStat
        })
    } catch (error) {
        console.error('Lỗi khi cập nhật thống kê thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const deleteAchievementStat = async (req, res) => {
    try {
        const { id } = req.params

        // Check if stat exists
        const stat = await db.AchievementStat.findByPk(id)
        if (!stat) {
            return res.status(404).json({ message: 'Thống kê thành tích không tồn tại' })
        }

        // Delete the stat
        await db.AchievementStat.destroy({ where: { id } })

        return res.status(200).json({ message: 'Xóa thống kê thành tích thành công' })
    } catch (error) {
        console.error('Lỗi khi xóa thống kê thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

// Achievement Images CRUD operations
export const getAllAchievementImages = async (req, res) => {
    try {
        const { category_id } = req.query
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 10
        const offset = (page - 1) * limit
        const sortOrder = req.query.sortOrder || 'ASC'

        let whereClause = {}
        if (category_id) {
            whereClause.category_id = category_id
        }

        const [images, total] = await Promise.all([
            db.AchievementImage.findAll({
                where: whereClause,
                order: [['display_order', sortOrder]],
                limit,
                offset,
                include: [{ model: db.AchievementCategory, as: 'category' }]
            }),
            db.AchievementImage.count({ where: whereClause })
        ])

        return res.status(200).json({
            message: 'Danh sách hình ảnh thành tích',
            data: images,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Lỗi khi lấy danh sách hình ảnh thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const getAchievementImageById = async (req, res) => {
    try {
        const { id } = req.params
        const image = await db.AchievementImage.findByPk(id, {
            include: [{ model: db.AchievementCategory, as: 'category' }]
        })

        if (!image) {
            return res.status(404).json({ message: 'Hình ảnh thành tích không tồn tại' })
        }

        return res.status(200).json({
            message: 'Chi tiết hình ảnh thành tích',
            data: image
        })
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết hình ảnh thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const createAchievementImage = async (req, res) => {
    try {
        const { category_id, caption, display_order, is_featured } = req.body

        // Validate required fields
        if (!category_id || !req.file || display_order === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
        }

        // Check if category exists
        const category = await db.AchievementCategory.findByPk(category_id)
        if (!category) {
            return res.status(404).json({ message: 'Danh mục thành tích không tồn tại' })
        }

        // Upload image to Firebase
        const folder = 'achievement-images'
        const uploadedImage = await uploadImage(req.file, folder)

        if (!uploadedImage) {
            return res.status(500).json({ message: 'Lỗi khi tải lên hình ảnh' })
        }

        // If this image is featured, unset featured flag on other images
        if (is_featured) {
            await db.AchievementImage.update(
                { is_featured: false },
                { where: { category_id, is_featured: true } }
            )
        }

        // Create the image
        const newImage = await db.AchievementImage.create({
            category_id,
            image_url: uploadedImage,
            caption,
            display_order,
            is_featured: is_featured || false
        })

        return res.status(201).json({
            message: 'Tạo hình ảnh thành tích thành công',
            data: newImage
        })
    } catch (error) {
        console.error('Lỗi khi tạo hình ảnh thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const updateAchievementImage = async (req, res) => {
    try {
        const { id } = req.params
        const { caption, display_order, is_featured } = req.body

        // Check if image exists
        const image = await db.AchievementImage.findByPk(id)
        if (!image) {
            return res.status(404).json({ message: 'Hình ảnh thành tích không tồn tại' })
        }

        // If this image is being set as featured, unset featured flag on other images
        if (is_featured) {
            await db.AchievementImage.update(
                { is_featured: false },
                {
                    where: {
                        category_id: image.category_id,
                        is_featured: true,
                        id: { [Op.ne]: id }
                    }
                }
            )
        }

        let updateData = { caption, display_order, is_featured }

        // If a new image file is uploaded, process it
        if (req.file) {
            // Upload new image to Firebase
            const folder = 'achievement-images'
            const uploadedImage = await uploadImage(req.file, folder)

            if (!uploadedImage) {
                return res.status(500).json({ message: 'Lỗi khi tải lên hình ảnh' })
            }

            // Store the old image URL for cleanup
            const oldImageUrl = image.image_url

            // Add the new image URL to update data
            updateData.image_url = uploadedImage

            // Clean up the old image after successful update
            try {
                await cleanupUploadedFiles([oldImageUrl])
            } catch (cleanupError) {
                console.error('Lỗi khi xóa ảnh cũ:', cleanupError)
                // Continue with the update even if cleanup fails
            }
        }

        // Update the image
        const [updated] = await db.AchievementImage.update(
            updateData,
            { where: { id } }
        )

        if (!updated) {
            return res.status(400).json({ message: 'Cập nhật hình ảnh thành tích thất bại' })
        }

        const updatedImage = await db.AchievementImage.findByPk(id)
        return res.status(200).json({
            message: 'Cập nhật hình ảnh thành tích thành công',
            data: updatedImage
        })
    } catch (error) {
        console.error('Lỗi khi cập nhật hình ảnh thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const deleteAchievementImage = async (req, res) => {
    try {
        const { id } = req.params

        // Check if image exists
        const image = await db.AchievementImage.findByPk(id)
        if (!image) {
            return res.status(404).json({ message: 'Hình ảnh thành tích không tồn tại' })
        }

        // Store the image URL for cleanup
        const imageUrl = image.image_url

        // Delete the image record from database
        await db.AchievementImage.destroy({ where: { id } })

        // Clean up the image file from storage
        try {
            await cleanupUploadedFiles([imageUrl])
            console.log(`Đã xóa ảnh: ${imageUrl}`)
        } catch (cleanupError) {
            console.error(`Lỗi khi xóa ảnh ${imageUrl}:`, cleanupError)
            // Continue even if cleanup fails
        }

        return res.status(200).json({ message: 'Xóa hình ảnh thành tích thành công' })
    } catch (error) {
        console.error('Lỗi khi xóa hình ảnh thành tích:', error)
        return res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}
