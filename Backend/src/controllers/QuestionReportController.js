import { Sequelize } from "../models";
import db from "../models";
// BaoCaoCHController.js

// Lấy danh sách tất cả các báo cáo câu hỏi
// GET http://localhost:3000/api/baocaocauhoi
export const getQuestionReport = async (req, res) => {
    try {
        const questionReport = await db.QuestionReport.findAll();
        res.json(questionReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết một báo cáo câu hỏi theo id
// GET http://localhost:3000/api/baocaocauhoi/:id
export const getQuestionReportById = async (req, res) => {
    try {
        const questionReport = await db.QuestionReport.findByPk(req.params.id);
        if (!questionReport) {
          return res.status(404).json({ message: 'Báo cáo không tồn tại' });
        }
        res.json(questionReport);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

// Thêm một báo cáo câu hỏi mới
// POST http://localhost:3000/api/baocaocauhoi
// {
//     "userId": 2,
//     "questionId": 3,
//     "content": "cc"
// }
export const postQuestionReport = async (req, res) => {
    try {
        const questionReport = await db.QuestionReport.create(req.body);
        res.status(201).json(questionReport);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

// Xóa một báo cáo câu hỏi theo id
// DELETE http://localhost:3000/api/baocaocauhoi/:id
export const deleteQuestionReport = async (req, res) => {
    try {
        const deleted = await db.QuestionReport.destroy({
          where: { id: req.params.id }
        });
        if (deleted) {
          return res.status(200).json({ message: 'Báo cáo đã được xóa thành công' });
        }
        throw new Error('Báo cáo không tồn tại');
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};