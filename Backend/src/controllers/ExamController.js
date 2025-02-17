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
                { chapter: { [Op.like]: `%${search}%` } },
                { year: { [Op.like]: `%${search}%` } },
                { class: { [Op.like]: `%${search}%` } },
                { typeOfExam: { [Op.like]: `%${search}%` } }
            ]
        };
    }

    // Truy vấn database lấy danh sách đề và tổng số đề thỏa điều kiện lọc
    const [examList, total] = await Promise.all([
        db.Exam.findAll({
            where: whereClause,
            offset,
            limit
        }),
        db.Exam.count({
            where: whereClause
        })
    ]);

    // Trả về kết quả JSON với phân trang
    return res.status(200).json({
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
    const examDetail = await db.Exam.findByPk(id);
    if (!examDetail) {
        return res.status(404).json({ message: 'Đề không tồn tại' });
    }
    return res.status(200).json({
        message: 'Chi tiết đề',
        data: examDetail
    });

};

// POST http://localhost:3000/api/exam
export const postExam = async (req, res) => {
    const exam = await db.Exam.create(req.body);
    if (!exam) {
        return res.status(500).json({ message: 'Tạo mới đề thất bại' });
    }
    return res.status(201).json({
        message: 'Tạo mới đề thành công',
        data: exam
    });
};

// PUT http://localhost:3000/api/exam
export const putExam = async (req, res) => {
    const { id } = req.params;
    const [updated] = await db.Exam.update(req.body, {
        where: { id }
    });

    if (!updated) {
        return res.status(404).json({ message: "Đề thi không tồn tại" });
    }

    const updatedExam = await db.Exam.findByPk(id);
    return res.status(200).json({ message: "Cập nhật đề thi thành công", data: updatedExam });
};

// DELETE http://localhost:3000/api/exam/1
export const deleteExam = async (req, res) => {
    const { id } = req.params;
    const deleted = await db.Exam.destroy({
        where: { id }
    });

    if (!deleted) {
        return res.status(404).json({ message: "Đề thi không tồn tại" });
    }

    return res.status(200).json({ message: "Xóa đề thi thành công" });
};
