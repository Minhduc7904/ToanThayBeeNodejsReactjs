import { Op } from "sequelize";
import db from "../models/index.js";

// Lấy danh sách tất cả các câu hỏi
// GET http://localhost:3000/api/cauhoi
export const getCauHoi = async (req, res, next) => {
    try {
        // 📌 Nhận tham số từ query string (nếu không có giá trị, dùng mặc định)
        const search = req.query.search || '';
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        // 📌 Điều kiện tìm kiếm (nếu có)
        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { noi_dung: { [Op.like]: `%${search}%` } }, // Tìm theo nội dung câu hỏi
                    { kieu_cau_hoi: { [Op.like]: `%${search}%` } },
                    { chuong: { [Op.like]: `%${search}%` } },// Tìm theo loại câu hỏi
                ]
            };
        }

        // 📌 Truy vấn database lấy danh sách câu hỏi + tổng số câu hỏi
        const [cauHoiList, total] = await Promise.all([
            db.Cau_hoi.findAll({
                where: whereClause,
                offset,
                limit
            }),
            db.Cau_hoi.count({
                where: whereClause
            })
        ]);

        // 📌 Trả về kết quả JSON
        res.status(200).json({
            message: 'Danh sách câu hỏi',
            data: cauHoiList,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });

    } catch (error) {
        next(error); // 📌 Gửi lỗi đến middleware xử lý lỗi của Express
    }
};


// Lấy chi tiết một câu hỏi theo id
// GET http://localhost:3000/api/cauhoi/:id
export const getCauHoiById = async (req, res) => {
    res.status(200).json({ message: 'Hello from getCauHoiById' });
};

// Lấy danh sách câu hỏi theo id của đề
// GET http://localhost:3000/api/cauhoi/de/:ma_de
export const getCauHoiByDeId = async (req, res) => {
    res.status(200).json({ message: `Hello from getCauHoiByDeId, ma_de: ${req.params.ma_de}` });
};

// Thêm một câu hỏi mới
// POST http://localhost:3000/api/cauhoi
export const postCauHoi = async (req, res) => {

    res.status(201).json({ message: 'Hello from postCauHoi' });
};

// Cập nhật thông tin một câu hỏi
// PUT http://localhost:3000/api/cauhoi/:id
export const putCauHoi = async (req, res) => {
    // Ví dụ sử dụng model CauHoi (nếu có)
    //   try {
    //     const [updated] = await CauHoi.update(req.body, {
    //       where: { id: req.params.id }
    //     });
    //     if (updated) {
    //       const updatedCauHoi = await CauHoi.findByPk(req.params.id);
    //       return res.status(200).json(updatedCauHoi);
    //     }
    //     throw new Error('Câu hỏi không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from putCauHoi' });
};

// Xóa một câu hỏi theo id
// DELETE http://localhost:3000/api/cauhoi/:id
export const deleteCauHoi = async (req, res) => {
    // Ví dụ sử dụng model CauHoi (nếu có)
    //   try {
    //     const deleted = await CauHoi.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'Câu hỏi đã được xóa thành công' });
    //     }
    //     throw new Error('Câu hỏi không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteCauHoi' });
};
