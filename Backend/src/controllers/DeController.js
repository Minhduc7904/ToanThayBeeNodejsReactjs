import { Sequelize } from "../models";
import db from "../models";
// DeController.js
// Hàm lấy danh sách tất cả các "De"
// GET http://localhost:3000/api/de
export const getDe = async (req, res) => {
    // Ví dụ với model De (nếu có)
    //   try {
    //     const de = await De.findAll();
    //     res.json(de);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getDe' });
};

// Hàm lấy chi tiết một "De" theo id
// GET http://localhost:3000/api/de/1
export const getDeById = async (req, res) => {
    // Ví dụ với model De (nếu có)
    //   try {
    //     const de = await De.findByPk(req.params.id);
    //     if (!de) {
    //       return res.status(404).json({ message: 'De not found' });
    //     }
    //     res.json(de);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from getDeById' });
};

// Hàm tạo mới một "De"
// POST http://localhost:3000/api/de
export const postDe = async (req, res) => {
    try {
        console.log(req.params);
        res.status(200).json({ message: 'Hello from postDe' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm cập nhật một "De"
// PUT http://localhost:3000/api/de
export const putDe = async (req, res) => {
    // Ví dụ với model De (nếu có)
    //   try {
    //     const [updated] = await De.update(req.body, {
    //       where: { id: req.body.id }
    //     });
    //     if (updated) {
    //       const updatedDe = await De.findByPk(req.body.id);
    //       return res.status(200).json(updatedDe);
    //     }
    //     throw new Error('De not found');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from putDe' });
};

// Hàm xóa một "De" theo id
// DELETE http://localhost:3000/api/de/1
export const deleteDe = async (req, res) => {
    // Ví dụ với model De (nếu có)
    //   try {
    //     const deleted = await De.destroy({
    //       where: { id: req.params.id }
    //     });
    //     if (deleted) {
    //       return res.status(200).json({ message: 'De deleted successfully' });
    //     }
    //     throw new Error('De not found');
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    res.status(200).json({ message: 'Hello from deleteDe' });
};
