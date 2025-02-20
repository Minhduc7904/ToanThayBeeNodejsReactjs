import { Sequelize } from "../models";
import db from "../models";
// LoiController.js

// Lấy danh sách tất cả lỗi
// GET http://localhost:3000/api/loi
export const getLoi = async (req, res) => {
    // Ví dụ sử dụng model Loi (nếu có)
    //   try {
    //     const loiList = await Loi.findAll();
    //     res.json(loiList);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getLoi' });
};

// Lấy danh sách lỗi theo ID lượt làm bài
// GET http://localhost:3000/api/loi/luot-lam-bai/:ma_lam_bai
export const getLoiByLuotLamBai = async (req, res) => {
    // Ví dụ sử dụng model Loi và liên kết với LuotLamBai (nếu có)
    //   try {
    //     const loiList = await Loi.findAll({
    //       where: { ma_lam_bai: req.params.ma_lam_bai }
    //     });
    //     res.json(loiList);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: `Hello from getLoiByLuotLamBai, ma_lam_bai: ${req.params.ma_lam_bai}` });
};

// Thêm một lỗi mới
// POST http://localhost:3000/api/loi
export const postLoi = async (req, res) => {
    try {
        const CheatList = await db.Cheat.create(req.body);
        res.status(201).json(CheatList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa một lỗi theo id
// DELETE http://localhost:3000/api/loi/:id
export const deleteLoi = async (req, res) => {
    // Ví dụ sử dụng model Loi (nếu có)
    //   try {
    //     const deleted = await Loi.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'Lỗi đã được xóa thành công' });
    //     }
    //     throw new Error('Lỗi không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteLoi' });
};
