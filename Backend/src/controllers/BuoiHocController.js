import { Sequelize } from "../models";
import db from "../models";
// BuoiHocController.js

// Lấy danh sách tất cả các buổi học
// GET http://localhost:3000/api/buoi-hoc
export const getBuoiHoc = async (req, res) => {
    // Ví dụ sử dụng model BuoiHoc (nếu có)
    //   try {
    //     const buoiHoc = await BuoiHoc.findAll();
    //     res.json(buoiHoc);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getBuoiHoc' });
};

// Lấy chi tiết một buổi học theo id
// GET http://localhost:3000/api/buoi-hoc/:id
export const getBuoiHocById = async (req, res) => {
    // Ví dụ sử dụng model BuoiHoc (nếu có)
    //   try {
    //     const buoiHoc = await BuoiHoc.findByPk(req.params.id);
    //     if (!buoiHoc) {
    //       return res.status(404).json({ message: 'Buổi học không tồn tại' });
    //     }
    //     res.json(buoiHoc);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getBuoiHocById' });
};

// Lấy danh sách buổi học theo id của lớp
// GET http://localhost:3000/api/buoi-hoc/lop/:ma_lop
export const getBuoiHocByLopId = async (req, res) => {
    // Ví dụ sử dụng model BuoiHoc và mối quan hệ với Lop (nếu có)
    //   try {
    //     const buoiHocList = await BuoiHoc.findAll({
    //       where: { ma_lop: req.params.ma_lop }
    //     });
    //     res.json(buoiHocList);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: `Hello from getBuoiHocByLopId, ma_lop: ${req.params.ma_lop}` });
};

// Thêm một buổi học mới
// POST http://localhost:3000/api/buoi-hoc
export const postBuoiHoc = async (req, res) => {
    // Ví dụ sử dụng model BuoiHoc (nếu có)
    //   try {
    //     const buoiHoc = await BuoiHoc.create(req.body);
    //     res.status(201).json(buoiHoc);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(201).json({ message: 'Hello from postBuoiHoc' });
};

// Cập nhật thông tin một buổi học
// PUT http://localhost:3000/api/buoi-hoc/:id
export const putBuoiHoc = async (req, res) => {
    // Ví dụ sử dụng model BuoiHoc (nếu có)
    //   try {
    //     const [updated] = await BuoiHoc.update(req.body, {
    //       where: { id: req.params.id }
    //     });
    //     if (updated) {
    //       const updatedBuoiHoc = await BuoiHoc.findByPk(req.params.id);
    //       return res.status(200).json(updatedBuoiHoc);
    //     }
    //     throw new Error('Buổi học không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from putBuoiHoc' });
};

// Xóa một buổi học theo id
// DELETE http://localhost:3000/api/buoi-hoc/:id
export const deleteBuoiHoc = async (req, res) => {
    // Ví dụ sử dụng model BuoiHoc (nếu có)
    //   try {
    //     const deleted = await BuoiHoc.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'Buổi học đã được xóa thành công' });
    //     }
    //     throw new Error('Buổi học không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteBuoiHoc' });
};
