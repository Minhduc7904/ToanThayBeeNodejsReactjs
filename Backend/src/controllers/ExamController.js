import { Sequelize } from "../models";
import db from "../models";

// GET http://localhost:3000/api/exam
export const getExam = async (req, res) => {

    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { chapter: { [Op.like]: `%${search}%` } }
            ]
        };
    }

    // Truy vấn database lấy danh sách đề và tổng số đề thỏa điều kiện lọc
    const [examList, total] = await Promise.all([
        db.exam.findAll({
            where: whereClause,
            offset,
            limit
        }),
        db.exam.count({
            where: whereClause
        })
    ]);

    // Trả về kết quả JSON với phân trang
    res.status(200).json({
        message: 'Danh sách đề',
        data: examList,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    });
};


// GET http://localhost:3000/api/exam/1
export const getExamById = async (req, res) => {
    const { id } = req.params;
    const examDetail = await db.exam.findByPk(id);
    if (!examDetail) {
        return res.status(404).json({ message: 'Đề không tồn tại' });
    }
    return res.status(200).json({
        message: 'Chi tiết đề',
        data: examDetail
    });

};

// Hàm tạo mới một "De"
// POST http://localhost:3000/api/exam
export const postExam = async (req, res) => {
    const exam = await db.exam.create(req.body);
    if (!exam) {
        return res.status(500).json({ message: 'Tạo mới đề thất bại' });
    }
    return res.status(201).json({
        message: 'Tạo mới đề thành công',
        data: exam
    });
};

// Hàm cập nhật một "De"
// PUT http://localhost:3000/api/exam
export const putExam = async (req, res) => {
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
// DELETE http://localhost:3000/api/exam/1
export const deleteExam = async (req, res) => {
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
