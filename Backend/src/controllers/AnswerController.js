import { Sequelize } from "../models";
import db from "../models";
// CauTraLoiController.js



// Lấy chi tiết một câu trả lời theo id
// GET http://localhost:3000/api/cautraloi/:id
export const getCauTraLoiById = async (req, res) => {
    // Ví dụ sử dụng model CauTraLoi (nếu có)
    //   try {
    //     const cauTraLoi = await CauTraLoi.findByPk(req.params.id);
    //     if (!cauTraLoi) {
    //       return res.status(404).json({ message: 'Câu trả lời không tồn tại' });
    //     }
    //     res.json(cauTraLoi);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getCauTraLoiById' });
};

// Lấy danh sách câu trả lời theo ID lượt làm bài
// GET http://localhost:3000/api/cautraloi/luot-lam-bai/:ma_lam_bai
export const getCauTraLoiByLuotLamBai = async (req, res) => {
    // Ví dụ sử dụng model CauTraLoi và mối quan hệ với LuotLamBai (nếu có)
    //   try {
    //     const cauTraLoiList = await CauTraLoi.findAll({
    //       where: { ma_lam_bai: req.params.ma_lam_bai }
    //     });
    //     res.json(cauTraLoiList);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: `Hello from getCauTraLoiByLuotLamBai, ma_lam_bai: ${req.params.ma_lam_bai}` });
};

// Thêm một câu trả lời mới
// POST http://localhost:3000/api/cautraloi
export const postCauTraLoi = async (req, res) => {
    // Ví dụ sử dụng model CauTraLoi (nếu có)
    //   try {
    //     const cauTraLoi = await CauTraLoi.create(req.body);
    //     res.status(201).json(cauTraLoi);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(201).json({ message: 'Hello from postCauTraLoi' });
};

// Cập nhật thông tin một câu trả lời
// PUT http://localhost:3000/api/cautraloi/:id
export const putCauTraLoi = async (req, res) => {
    // Ví dụ sử dụng model CauTraLoi (nếu có)
    //   try {
    //     const [updated] = await CauTraLoi.update(req.body, {
    //       where: { id: req.params.id }
    //     });
    //     if (updated) {
    //       const updatedCauTraLoi = await CauTraLoi.findByPk(req.params.id);
    //       return res.status(200).json(updatedCauTraLoi);
    //     }
    //     throw new Error('Câu trả lời không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from putCauTraLoi' });
};

// Xóa một câu trả lời theo id
// DELETE http://localhost:3000/api/cautraloi/:id
export const deleteCauTraLoi = async (req, res) => {
    // Ví dụ sử dụng model CauTraLoi (nếu có)
    //   try {
    //     const deleted = await CauTraLoi.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'Câu trả lời đã được xóa thành công' });
    //     }
    //     throw new Error('Câu trả lời không tồn tại');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteCauTraLoi' });
};
