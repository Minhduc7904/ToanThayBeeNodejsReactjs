import { Sequelize } from "../models";
import db from "../models";
// BaoCaoNDController.js

// Lấy danh sách tất cả các báo cáo người dùng
// GET http://localhost:3000/api/baocaond
export const getBaoCaoND = async (req, res) => {
    // Ví dụ sử dụng model BaoCaoND (nếu có)
    //   try {
    //     const baocaoND = await BaoCaoND.findAll();
    //     res.json(baocaoND);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getBaoCaoND' });
};

// Lấy chi tiết một báo cáo người dùng theo id
// GET http://localhost:3000/api/baocaond/:id
export const getBaoCaoNDById = async (req, res) => {
    // Ví dụ sử dụng model BaoCaoND (nếu có)
    //   try {
    //     const baocaoND = await BaoCaoND.findByPk(req.params.id);
    //     if (!baocaoND) {
    //       return res.status(404).json({ message: 'Báo cáo không tồn tại' });
    //     }
    //     res.json(baocaoND);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getBaoCaoNDById' });
};

// Thêm một báo cáo mới
// POST http://localhost:3000/api/baocaond
export const postBaoCaoND = async (req, res) => {
    // Ví dụ sử dụng model BaoCaoND (nếu có)
    //   try {
    //     const baocaoND = await BaoCaoND.create(req.body);
    //     res.status(201).json(baocaoND);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(201).json({ message: 'Hello from postBaoCaoND' });
};

// Xóa một báo cáo người dùng theo id
// DELETE http://localhost:3000/api/baocaond/:id
export const deleteBaoCaoND = async (req, res) => {
    // Ví dụ sử dụng model BaoCaoND (nếu có)
    //   try {
    //     const deleted = await BaoCaoND.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'Báo cáo đã được xóa thành công' });
    //     }
    //     throw new Error('Báo cáo không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteBaoCaoND' });
};
