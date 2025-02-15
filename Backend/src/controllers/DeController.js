import { Sequelize } from "../models";
import db from "../models";

// GET http://localhost:3000/api/de
export const getDe = async (req, res) => {

    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Điều kiện tìm kiếm (nếu có)
    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { ten: { [Op.like]: `%${search}%` } },
                { mo_ta: { [Op.like]: `%${search}%` } },
                { chuong: { [Op.like]: `%${search}%` } }
            ]
        };
    }

    // Truy vấn database lấy danh sách đề và tổng số đề thỏa điều kiện lọc
    const [deList, total] = await Promise.all([
        db.De.findAll({
            where: whereClause,
            offset,
            limit
        }),
        db.De.count({
            where: whereClause
        })
    ]);

    // Trả về kết quả JSON với phân trang
    res.status(200).json({
        message: 'Danh sách đề',
        data: deList,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    });
};


// GET http://localhost:3000/api/de/1
export const getDeById = async (req, res) => {

    const { id } = req.params;
    const deDetail = await db.De.findByPk(id);
    if (!deDetail) {
        return res.status(404).json({ message: 'Đề không tồn tại' });
    }
    return res.status(200).json({
        message: 'Chi tiết đề',
        data: deDetail
    });

};

// Hàm tạo mới một "De"
// POST http://localhost:3000/api/de
export const postDe = async (req, res) => {
    const de = await db.De.create(req.body);
    return res.status(201).json({
        message: 'Tạo mới đề thành công',
        data: de
    });
};

// Hàm cập nhật một "De"
// PUT http://localhost:3000/api/de
export const putDe = async (req, res) => {
    // Ví dụ với model De (nếu có)
    //   try {
    //     const [updated] = await De.update(req.body, {
    //       where: { id: req.body.id }
    //     });
    //     if (updated) {
    //       const updatedDe = await De.findByPk(req.body.id);
    //       return res.status(200).json(updatedDe);
    //     }
    //     throw new Error('De not found');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from putDe' });
};

// Hàm xóa một "De" theo id
// DELETE http://localhost:3000/api/de/1
export const deleteDe = async (req, res) => {
    // Ví dụ với model De (nếu có)
    //   try {
    //     const deleted = await De.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'De deleted successfully' });
    //     }
    //     throw new Error('De not found');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteDe' });
};
