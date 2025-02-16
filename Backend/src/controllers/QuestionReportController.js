import { Sequelize } from "../models";
import db from "../models";
// BaoCaoCHController.js

// Lấy danh sách tất cả các báo cáo câu hỏi
// GET http://localhost:3000/api/baocaocauhoi
export const getBaoCaoCH = async (req, res) => {
    // Ví dụ sử dụng model BaoCaoCH (nếu có)
    //   try {
    //     const baocaoCH = await BaoCaoCH.findAll();
    //     res.json(baocaoCH);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getBaoCaoCH' });
};

// Lấy chi tiết một báo cáo câu hỏi theo id
// GET http://localhost:3000/api/baocaocauhoi/:id
export const getBaoCaoCHById = async (req, res) => {
    // Ví dụ sử dụng model BaoCaoCH (nếu có)
    //   try {
    //     const baocaoCH = await BaoCaoCH.findByPk(req.params.id);
    //     if (!baocaoCH) {
    //       return res.status(404).json({ message: 'Báo cáo không tồn tại' });
    //     }
    //     res.json(baocaoCH);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getBaoCaoCHById' });
};

// Thêm một báo cáo câu hỏi mới
// POST http://localhost:3000/api/baocaocauhoi
export const postBaoCaoCH = async (req, res) => {
    // Ví dụ sử dụng model BaoCaoCH (nếu có)
    //   try {
    //     const baocaoCH = await BaoCaoCH.create(req.body);
    //     res.status(201).json(baocaoCH);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(201).json({ message: 'Hello from postBaoCaoCH' });
};

// Xóa một báo cáo câu hỏi theo id
// DELETE http://localhost:3000/api/baocaocauhoi/:id
export const deleteBaoCaoCH = async (req, res) => {
    // Ví dụ sử dụng model BaoCaoCH (nếu có)
    //   try {
    //     const deleted = await BaoCaoCH.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'Báo cáo đã được xóa thành công' });
    //     }
    //     throw new Error('Báo cáo không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteBaoCaoCH' });
};
