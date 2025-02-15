import { Sequelize } from "../models";
import db from "../models";
const Op = Sequelize.Op;

// Lấy danh sách tất cả mã code
// GET http://localhost:3000/api/code
export const getAllCode = async (req, res, next) => {
    try {
        const { search = '', page = 1, limit = 2 } = req.query;
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
            db.All_code.findAll({ where: whereClause, offset, limit }),
            db.All_code.count({ where: whereClause })
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
// GET http://localhost:3000/api/code/:code
export const getCodeByCode = async (req, res) => {
    const code = req.params.code
    const codeDetail = await db.All_code.findByPk(code);

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
// POST http://localhost:3000/api/code
export const postCode = async (req, res) => {
    const newCode = await db.All_code.create(req.body);
    return res.status(201).json({
        message: 'Mã code đã được tạo.',
        data: newCode
    });
};

// Cập nhật thông tin một mã code
// PUT http://localhost:3000/api/code/:code
export const putCode = async (req, res) => {
    // Ví dụ sử dụng model AllCode (nếu có)
    //   try {
    //     const [updated] = await AllCode.update(req.body, { where: { code: req.params.code } });
    //     if (updated) {
    //       const updatedAllCode = await AllCode.findOne({ where: { code: req.params.code } });
    //       return res.status(200).json(updatedAllCode);
    //     }
    //     throw new Error('Mã code không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from putAllCode' });
};
