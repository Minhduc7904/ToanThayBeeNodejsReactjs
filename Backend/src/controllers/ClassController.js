import { Sequelize } from "../models";
import db from "../models";
// LopController.js

// Lấy danh sách tất cả các lớp học
// GET http://localhost:3000/api/lop
export const getLop = async (req, res) => {
    // Ví dụ sử dụng model Lop (nếu có)
    //   try {
    //     const lop = await Lop.findAll();
    //     res.json(lop);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getLop' });
};

// Lấy chi tiết một lớp học theo id
// GET http://localhost:3000/api/lop/:id
export const getLopById = async (req, res) => {
    // Ví dụ sử dụng model Lop (nếu có)
    //   try {
    //     const lop = await Lop.findByPk(req.params.id);
    //     if (!lop) {
    //       return res.status(404).json({ message: 'Lớp học không tồn tại' });
    //     }
    //     res.json(lop);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getLopById' });
};

// Thêm một lớp học mới
// POST http://localhost:3000/api/lop
export const postLop = async (req, res) => {
    // Ví dụ sử dụng model Lop (nếu có)
    //   try {
    //     const lop = await Lop.create(req.body);
    //     res.status(201).json(lop);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(201).json({ message: 'Hello from postLop' });
};

// Cập nhật thông tin một lớp học
// PUT http://localhost:3000/api/lop/:id
export const putLop = async (req, res) => {
    // Ví dụ sử dụng model Lop (nếu có)
    //   try {
    //     const [updated] = await Lop.update(req.body, {
    //       where: { id: req.params.id }
    //     });
    //     if (updated) {
    //       const updatedLop = await Lop.findByPk(req.params.id);
    //       return res.status(200).json(updatedLop);
    //     }
    //     throw new Error('Lớp học không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from putLop' });
};

// Xóa một lớp học theo id
// DELETE http://localhost:3000/api/lop/:id
export const deleteLop = async (req, res) => {
    // Ví dụ sử dụng model Lop (nếu có)
    //   try {
    //     const deleted = await Lop.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'Lớp học đã được xóa thành công' });
    //     }
    //     throw new Error('Lớp học không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteLop' });
};
