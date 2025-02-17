import { Sequelize } from "../models";
import db from "../models";
import UserResponse from "../dtos/responses/user/UserResponse";
import bcrypt from "bcrypt";

// http://localhost:3000/api/v1/user
export const postUser = async (req, res) => {
    const { email, username, phone } = req.body;
    const exitingUsernameUser = await db.User.findOne({ where: { username } });
    if (exitingUsernameUser) {
        return res.status(409).json({ message: 'Username đã tồn tại' });
    }

    const exitingEmailUser = await db.User.findOne({ where: { email } });
    if (exitingEmailUser) {
        return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    const exitingPhoneUser = await db.User.findOne({ where: { phone } });
    if (exitingPhoneUser) {
        return res.status(409).json({ message: 'Số điện thoại đã tồn tại' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await db.User.create({
        ...req.body,
        password: hashedPassword
    });
    
    if (!newUser) {
        return res.status(400).json({ message: 'Tạo mới người dùng thất bại' });
    }
    return res.status(201).json({ 
        message: 'Thêm người dùng thành công', 
        data: new UserResponse(newUser)
    });
};

// http://localhost:3000/api/v1/user/:id
export const putUser = async (req, res) => {
    const { id } = req.params;
    const [updated] = await db.User.update(req.body, {
        where: { id }
    });

    if (!updated) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const updatedUser = await db.User.findByPk(id);
    return res.status(200).json({ message: 'Cập nhật người dùng thành công', data: updatedUser });
};

// http://localhost:3000/api/v1/user/:id
export const getUserById = async (req, res) => {
    const { id } = req.params;
    const userDetail = await db.User.findByPk(id);

    if (!userDetail) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    return res.status(200).json({ message: 'Chi tiết người dùng', data: userDetail });
}