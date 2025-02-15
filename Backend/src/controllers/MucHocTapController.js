import { Sequelize } from "../models";
import db from "../models";
// MucHocTapController.js

// Lấy danh sách tất cả mục học tập
// GET http://localhost:3000/api/muc-hoc-tap
export const getMucHocTap = async (req, res) => {
    // Ví dụ sử dụng model MucHocTap (nếu có)
    //   try {
    //     const mucHocTapList = await MucHocTap.findAll();
    //     res.json(mucHocTapList);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getMucHocTap' });
};

// Lấy chi tiết một mục học tập theo id
// GET http://localhost:3000/api/muc-hoc-tap/:id
export const getMucHocTapById = async (req, res) => {
    // Ví dụ sử dụng model MucHocTap (nếu có)
    //   try {
    //     const mucHocTap = await MucHocTap.findByPk(req.params.id);
    //     if (!mucHocTap) {
    //       return res.status(404).json({ message: 'Mục học tập không tồn tại' });
    //     }
    //     res.json(mucHocTap);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getMucHocTapById' });
};

// Lấy danh sách mục học tập theo ID buổi học
// GET http://localhost:3000/api/muc-hoc-tap/buoi-hoc/:ma_buoi_hoc
export const getMucHocTapByBuoiHoc = async (req, res) => {
    // Ví dụ sử dụng model MucHocTap và liên kết với BuoiHoc (nếu có)
    //   try {
    //     const mucHocTapList = await MucHocTap.findAll({
    //       where: { ma_buoi_hoc: req.params.ma_buoi_hoc }
    //     });
    //     res.json(mucHocTapList);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: `Hello from getMucHocTapByBuoiHoc, ma_buoi_hoc: ${req.params.ma_buoi_hoc}` });
};

// Thêm một mục học tập mới
// POST http://localhost:3000/api/muc-hoc-tap
export const postMucHocTap = async (req, res) => {
    // Ví dụ sử dụng model MucHocTap (nếu có)
    //   try {
    //     const mucHocTap = await MucHocTap.create(req.body);
    //     res.status(201).json(mucHocTap);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(201).json({ message: 'Hello from postMucHocTap' });
};

// Cập nhật thông tin một mục học tập
// PUT http://localhost:3000/api/muc-hoc-tap/:id
export const putMucHocTap = async (req, res) => {
    // Ví dụ sử dụng model MucHocTap (nếu có)
    //   try {
    //     const [updated] = await MucHocTap.update(req.body, {
    //       where: { id: req.params.id }
    //     });
    //     if (updated) {
    //       const updatedMucHocTap = await MucHocTap.findByPk(req.params.id);
    //       return res.status(200).json(updatedMucHocTap);
    //     }
    //     throw new Error('Mục học tập không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from putMucHocTap' });
};

// Xóa một mục học tập theo id
// DELETE http://localhost:3000/api/muc-hoc-tap/:id
export const deleteMucHocTap = async (req, res) => {
    // Ví dụ sử dụng model MucHocTap (nếu có)
    //   try {
    //     const deleted = await MucHocTap.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'Mục học tập đã được xóa thành công' });
    //     }
    //     throw new Error('Mục học tập không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteMucHocTap' });
};
