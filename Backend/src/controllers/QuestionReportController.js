import { Sequelize } from "../models";
import db from "../models";
// BaoCaoCHController.js

// Lấy danh sách tất cả các báo cáo câu hỏi
// GET http://localhost:3000/api/baocaocauhoi
export const getQuestionReport = async (req, res) => {
    const questionReport = await db.QuestionReport.findAll();
    return res.json(questionReport);
};

// Lấy chi tiết một báo cáo câu hỏi theo id
// GET http://localhost:3000/api/baocaocauhoi/:id
export const getQuestionReportById = async (req, res) => {
    const questionReport = await db.QuestionReport.findByPk(req.params.id);
    if (!questionReport) {
      return res.status(404).json({ message: 'Báo cáo không tồn tại' });
    }
    return res.json(questionReport);
};

// Thêm một báo cáo câu hỏi mới
// POST http://localhost:3000/api/baocaocauhoi
// {
//     "userId": 2,
//     "questionId": 3,
//     "content": "cc"
// }
export const postQuestionReport = async (req, res) => {
    const questionReport = await db.QuestionReport.create(req.body);
    return res.status(201).json(questionReport);
};

// Xóa một báo cáo câu hỏi theo id
// DELETE http://localhost:3000/api/baocaocauhoi/:id
export const deleteQuestionReport = async (req, res) => {
    const deleted = await db.QuestionReport.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(200).json({ message: 'Báo cáo đã được xóa thành công' });
    }
    throw new Error('Báo cáo không tồn tại');
};
