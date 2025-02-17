import { Sequelize } from "../models";
import db from "../models";
const Op = Sequelize.Op;

// Lấy danh sách tất cả mã code
// GET http://localhost:3000/api/v1/code
export const getAllCode = async (req, res, next) => {
    try {
        const search = req.query.search || '';
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { code: { [Op.like]: `%${search}%` } },
                    { mo_ta: { [Op.like]: `%${search}%` } },
                    { kieu: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const [allCode, total] = await Promise.all([
            db.AllCode.findAll({ where: whereClause, offset, limit }),
            db.AllCode.count({ where: whereClause })
        ]);

        res.status(200).json({
            message: 'Danh sách tất cả mã code',
            data: allCode,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch (error) {
        next(error); // ✅ Đảm bảo lỗi được gửi đến middleware xử lý lỗi
    }
};

// Lấy chi tiết một mã code theo code
// GET http://localhost:3000/api/v1/code/:1
export const getCodeByCode = async (req, res) => {
    const code = req.params.code
    const codeDetail = await db.AllCode.findByPk(code);

    if (!codeDetail) {
        return res.status(404).json({
            message: 'Mã code không tồn tại'
        });
    }
    res.status(200).json({
        message: 'Chi tiết mã code',
        data: codeDetail
    });
};

// Thêm một mã code mới
// POST http://localhost:3000/api/v1/code
export const postCode = async (req, res) => {
    const newCode = await db.AllCode.create(req.body);
    return res.status(201).json({
        message: 'Mã code đã được tạo.',
        data: newCode
    });
};

// Cập nhật thông tin một mã code
// PUT http://localhost:3000/api/v1/code/:1
export const putCode = async (req, res) => {
    const code = req.params.code;
    const [updated] = await db.AllCode.update(req.body, {
        where: { code }
    });

    if (!updated) {
        return res.status(404).json({
            message: 'Mã code không tồn tại'
        });
    }

    const updatedCode = await db.AllCode.findByPk(code);
    return res.status(200).json({
        message: 'Cập nhật mã code thành công',
        data: updatedCode
    });
};
