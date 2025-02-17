import { Sequelize } from "../models";
import db from "../models";

// http://localhost:3000/api/v1/statement/cauhoi/:id
export const getStatementByQuestionId = async (req, res, next) => {
    try {
        const { questionId } = req.params;
        const statements = await db.Statement.findAll({
            include: {
                model: db.Question,
                as: 'question',
                where: { questionId },
                attributes: []
            }
        });

        if (!statements || statements.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy mệnh đề nào cho câu hỏi này' });
        }

        return res.status(200).json({ message: 'Danh sách mệnh đề', data: statements });
    } catch (error) {
        next(error);
    }
};


// http://localhost:3000/api/v1/statement/:id
export const getStatementById = async (req, res) => {
    const { id } = req.params;
    const statementDetail = await db.Statement.findByPk(id);

    if (!statementDetail) {
        return res.status(404).json({ message: 'Mệnh đề không tồn tại' });
    }
    return res.status(200).json({ message: 'Chi tiết mệnh đề', data: statementDetail });
};

// http://localhost:3000/api/v1/statement
export const postStatement = async (req, res) => {
    const newstatement = await db.Statement.create(req.body);
    return res.status(201).json({ message: 'Thêm mệnh đề thành công', data: newstatement });
};

// http://localhost:3000/api/v1/statement/:id
export const putStatement = async (req, res) => {
    const { id } = req.params;
    const [updated] = await db.Statement.update(req.body, {
        where: { id }
    });

    if (!updated) {
        return res.status(404).json({ message: 'Mệnh đề không tồn tại' });
    }

    const updatedStatement = await db.Statement.findByPk(id);
    return res.status(200).json({ message: 'Cập nhật mệnh đề thành công', data: updatedStatement });
}

// http://localhost:3000/api/v1/statement/:id
export const deleteStatement = async (req, res) => {
    const { id } = req.params;
    const deleted = await db.Statement.destroy({
        where: { id }
    });

    if (!deleted) {
        return res.status(404).json({ message: 'Mệnh đề không tồn tại' });
    }

    return res.status(200).json({ message: 'Xóa mệnh đề thành công' });
};
