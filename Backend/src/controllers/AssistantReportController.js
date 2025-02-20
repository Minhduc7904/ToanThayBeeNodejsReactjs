import { Sequelize } from "../models";
import db from "../models";
import { Op, literal } from 'sequelize';
// AssistantReportController.js
const { AssistantReport } = db;
// Lấy danh sách tất cả các báo cáo người dùng
// GET http://localhost:3000/api/AssistantReport?search=...
export const getAssistantReport = async (req, res) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // 📄 Thiết lập điều kiện tìm kiếm
    const whereClause = search.trim()
        ? {
            [Op.or]: [
                { content: { [Op.like]: `%${search}%` } },
                literal(`CONCAT(user.middleName, ' ', user.firstName) LIKE '%${search}%'`),
                literal(`CONCAT(assistant.middleName, ' ', assistant.firstName) LIKE '%${search}%'`),
            ],
        }
        : {};

    // 📥 Truy vấn báo cáo kèm tên người dùng và trợ lý
    const { rows: reports, count: total } = await db.AssistantReport.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'middleName', 'firstName'], // ✅ Lấy tên người dùng
            },
            {
                model: db.User,
                as: 'assistant',
                attributes: ['id', 'middleName', 'firstName'], // ✅ Lấy tên trợ lý
            },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
        message: '✅ Lấy danh sách báo cáo thành công!',
        data: reports,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    });

};


// Lấy chi tiết một báo cáo người dùng theo id
// GET http://localhost:3000/api/AssistantReport/:id
export const getAssistantReportById = async (req, res) => {
    const report = await AssistantReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: "Không tìm thấy báo cáo" });
    return res.status(200).json(report);
};

// Thêm một báo cáo mới
// POST http://localhost:3000/api/AssistantReport
export const postAssistantReport = async (req, res) => {
    const newReport = await AssistantReport.create(req.body);
    return res.status(201).json({
        message: 'Tạo báo cáo thành công',
        newReport
    });
};

// Xóa một báo cáo người dùng theo id
// DELETE http://localhost:3000/api/AssistantReport/:id
export const deleteAssistantReport = async (req, res) => {
    const report = await AssistantReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: "Không tìm thấy báo cáo" });

    const del = await report.destroy();
    if (!del) return res.status(500).json({ message: "Xóa báo cáo thất bại" });
    return res.status(200).json({ message: "Xóa báo cáo thành công" });
};