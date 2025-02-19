import { Sequelize } from "../models";
import db from "../models";
import UserResponse from "../dtos/responses/user/UserResponse";
import bcrypt from "bcrypt";
import UserType from "../constants/UserType";
import UserStatus from "../constants/UserStatus";
import jwt from "jsonwebtoken";
require('dotenv').config();

// http://localhost:3000/api/v1/user
export const registerUser = async (req, res) => {
    const { email, username, phone } = req.body;
    if (!username && !email) {
        return res.status(400).json({ message: 'Tài khoản không được để trống' });
    }

    if (username) {
        const exitingUsernameUser = await db.User.findOne({ where: { username } });
        if (exitingUsernameUser) {
            return res.status(409).json({ message: 'Username đã tồn tại' });
        }
    }

    if (email) {
        const exitingEmailUser = await db.User.findOne({ where: { email } });
        if (exitingEmailUser) {
            return res.status(409).json({ message: 'Email đã tồn tại' });
        }
    }

    if (phone) {
        const exitingPhoneUser = await db.User.findOne({ where: { phone } });
        if (exitingPhoneUser) {
            return res.status(409).json({ message: 'Số điện thoại đã tồn tại' });
        }
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await db.User.create({
        ...req.body,
        username,
        userType: UserType.STUDENT,
        status: UserStatus.ACTIVE,
        password: hashedPassword
    });

    if (!newUser) {
        return res.status(400).json({ message: 'Tạo mới người dùng thất bại' });
    }
    return res.status(201).json({
        message: 'Thêm người dùng thành công',
        user: new UserResponse(newUser)
    });
};

// http://localhost:3000/api/v1/user/login
export const login = async (req, res) => {
    const { username, email, password } = req.body;
    // ⚠️ Kiểm tra đầu vào
    if ((!username && !email) || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu' });
    }
        const user = await db.User.findOne({
            where: username ? { username } : { email },
        });
        if (!user) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }
        // 🔑 So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }
        // ✅ Tạo token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
        );

        return res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: new UserResponse(user),
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