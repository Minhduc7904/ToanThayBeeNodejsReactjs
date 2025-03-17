import { Sequelize } from "../models"
import db from "../models"
import { Op, or } from "sequelize";

export const getAllCode = async (req, res, next) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit
    const sortOrder = req.query.sortOrder || 'ASC'

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
        db.AllCode.findAll({ where: whereClause, offset, limit, order: [ ['createdAt', sortOrder], ['type', 'ASC']] }),
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

export const getCodeByType = async (req, res) => {
    const types = req.query.types; // Nhận danh sách types từ query params

    if (!types || !Array.isArray(types) || types.length === 0) {
        return res.status(400).json({
            message: "Danh sách types không hợp lệ"
        });
    }

    const codes = await db.AllCode.findAll({
        where: { type: { [Op.in]: types } }
    });

    if (!codes || codes.length === 0) {
        return res.status(404).json({
            message: "Không tìm thấy mã code cho các type này"
        });
    }

    res.status(200).json({
        message: "Danh sách mã code theo type",
        data: codes
    });
};

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
