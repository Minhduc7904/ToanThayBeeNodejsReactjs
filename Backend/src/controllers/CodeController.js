import { Sequelize } from "../models"
import db from "../models"
const Op = Sequelize.Op

export const getAllCode = async (req, res, next) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    let whereClause = {}
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { code: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { type: { [Op.like]: `%${search}%` } }
            ]
        }
    }

    const [allCode, total] = await Promise.all([
        db.AllCode.findAll({ where: whereClause, offset, limit }),
        db.AllCode.count({ where: whereClause })
    ])

    res.status(200).json({
        message: 'Danh sách tất cả mã code',
        data: allCode,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    })
}

export const getCodeByCode = async (req, res) => {
    const code = req.params.code
    const codeDetail = await db.AllCode.findByPk(code)

    if (!codeDetail) {
        return res.status(404).json({
            message: 'Mã code không tồn tại'
        })
    }
    res.status(200).json({
        message: 'Chi tiết mã code',
        data: codeDetail
    })
}

export const postCode = async (req, res) => {
    const newCode = await db.AllCode.create(req.body)
    return res.status(201).json({
        message: 'Mã code đã được tạo.',
        data: newCode
    })
}

export const putCode = async (req, res) => {
    const code = req.params.code
    const [updated] = await db.AllCode.update(req.body, {
        where: { code }
    })

    if (!updated) {
        return res.status(404).json({
            message: 'Mã code không tồn tại'
        })
    }

    const updatedCode = await db.AllCode.findByPk(code)
    return res.status(200).json({
        message: 'Cập nhật mã code thành công',
        data: updatedCode
    })
}
