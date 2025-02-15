import { Sequelize } from "../models";
import db from "../models";
// LuotLamBaiController.js

// Lấy danh sách tất cả các lượt làm bài
// GET http://localhost:3000/api/luot-lam-bai
export const getLuotLamBai = async (req, res) => {
    // Ví dụ sử dụng model LuotLamBai (nếu có)
    //   try {
    //     const luotLamBai = await LuotLamBai.findAll();
    //     res.json(luotLamBai);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getLuotLamBai' });
};

// Lấy chi tiết một lượt làm bài theo id
// GET http://localhost:3000/api/luot-lam-bai/:id
export const getLuotLamBaiById = async (req, res) => {
    // Ví dụ sử dụng model LuotLamBai (nếu có)
    //   try {
    //     const luotLamBai = await LuotLamBai.findByPk(req.params.id);
    //     if (!luotLamBai) {
    //       return res.status(404).json({ message: 'Lượt làm bài không tồn tại' });
    //     }
    //     res.json(luotLamBai);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getLuotLamBaiById' });
};

// Lấy danh sách lượt làm bài theo id đề thi
// GET http://localhost:3000/api/luot-lam-bai/de/:ma_de
export const getLuotLamBaiByDeId = async (req, res) => {
    // Ví dụ sử dụng model LuotLamBai và mối quan hệ với De (nếu có)
    //   try {
    //     const luotLamBaiList = await LuotLamBai.findAll({
    //       where: { ma_de: req.params.ma_de }
    //     });
    //     res.json(luotLamBaiList);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: `Hello from getLuotLamBaiByDeId, ma_de: ${req.params.ma_de}` });
};

// Thêm một lượt làm bài mới
// POST http://localhost:3000/api/luot-lam-bai
export const postLuotLamBai = async (req, res) => {
    // Ví dụ sử dụng model LuotLamBai (nếu có)
    //   try {
    //     const luotLamBai = await LuotLamBai.create(req.body);
    //     res.status(201).json(luotLamBai);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(201).json({ message: 'Hello from postLuotLamBai' });
};

// Cập nhật thông tin một lượt làm bài
// PUT http://localhost:3000/api/luot-lam-bai/:id
export const putLuotLamBai = async (req, res) => {
    // Ví dụ sử dụng model LuotLamBai (nếu có)
    //   try {
    //     const [updated] = await LuotLamBai.update(req.body, {
    //       where: { id: req.params.id }
    //     });
    //     if (updated) {
    //       const updatedLuotLamBai = await LuotLamBai.findByPk(req.params.id);
    //       return res.status(200).json(updatedLuotLamBai);
    //     }
    //     throw new Error('Lượt làm bài không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from putLuotLamBai' });
};

// Xóa một lượt làm bài theo id
// DELETE http://localhost:3000/api/luot-lam-bai/:id
export const deleteLuotLamBai = async (req, res) => {
    // Ví dụ sử dụng model LuotLamBai (nếu có)
    //   try {
    //     const deleted = await LuotLamBai.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'Lượt làm bài đã được xóa thành công' });
    //     }
    //     throw new Error('Lượt làm bài không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteLuotLamBai' });
};
