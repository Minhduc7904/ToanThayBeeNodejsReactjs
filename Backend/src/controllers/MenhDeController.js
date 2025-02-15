import { Sequelize } from "../models";
import db from "../models";

// http://localhost:3000/api/menhde/cauhoi/:id
export const getMenhDeByCauHoiId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const menhdes = await db.Menh_De.findAll({
            include: {
                model: db.Cau_hoi,
                as: 'cauHoi', // sử dụng alias đã khai báo trong model Menh_De
                where: { id },
                attributes: [] // Không lấy dữ liệu của Cau_hoi, chỉ dùng để lọc
            }
        });

        if (!menhdes || menhdes.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy mệnh đề nào cho câu hỏi này' });
        }

        return res.status(200).json({ message: 'Danh sách mệnh đề', data: menhdes });
    } catch (error) {
        next(error);
    }
};


// http://localhost:3000/api/menhde/:id
export const getMenhDeById = async (req, res) => {
    const { id } = req.params;
    const menhdeDetail = await db.Menh_De.findByPk(id);

    if (!menhdeDetail) {
        return res.status(404).json({ message: 'Mệnh đề không tồn tại' });
    }
    return res.status(200).json({ message: 'Chi tiết mệnh đề', data: menhdeDetail });
};

// http://localhost:3000/api/menhde
export const postMenhDe = async (req, res) => {
    const newMenhDe = await db.Menh_De.create(req.body);
    return res.status(201).json({ message: 'Thêm mệnh đề thành công', data: newMenhDe });
};

// http://localhost:3000/api/menhde/:id
export const putMenhDe = async (req, res) => {
    const { id } = req.params;
    const [updated] = await db.Menh_De.update(req.body, {
        where: { id }
    });

    if (!updated) {
        return res.status(404).json({ message: 'Mệnh đề không tồn tại' });
    }

    const updatedMenhDe = await db.Menh_De.findByPk(id);
    return res.status(200).json({ message: 'Cập nhật mệnh đề thành công', data: updatedMenhDe });
}

// http://localhost:3000/api/menhde/:id
export const deleteMenhDe = async (req, res) => {
    const { id } = req.params;
    const deleted = await db.Menh_De.destroy({
        where: { id }
    });

    if (!deleted) {
        return res.status(404).json({ message: 'Mệnh đề không tồn tại' });
    }

    return res.status(200).json({ message: 'Xóa mệnh đề thành công' });
};
