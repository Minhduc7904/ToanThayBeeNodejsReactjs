// services/user.service.js
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import UserType from '../constants/UserType.js';
import UserStatus from '../constants/UserStatus.js';
import UserResponse from '../dtos/responses/user/UserResponse.js';

export const createUserBulk = async (users) => {
    const results = {
        success: [],
        failed: [],
    };

    for (const user of users) {
        const { username, email, phone, password } = user;

        try {
            // Check bắt buộc
            if (!username && !email) {
                throw new Error('Thiếu username hoặc email');
            }

            // Kiểm tra trùng lặp
            if (username) {
                const existUsername = await db.User.findOne({ where: { username } });
                if (existUsername) throw new Error('Username đã tồn tại');
            }

            if (email) {
                const existEmail = await db.User.findOne({ where: { email } });
                if (existEmail) throw new Error('Email đã tồn tại');
            }

            if (phone) {
                const existPhone = await db.User.findOne({ where: { phone } });
                if (existPhone) throw new Error('Số điện thoại đã tồn tại');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng
            const newUser = await db.User.create({
                ...user,
                username,
                password: hashedPassword,
                userType: UserType.STUDENT,
                status: UserStatus.ACTIVE,
            });

            results.success.push(new UserResponse(newUser));
        } catch (err) {
            results.failed.push({
                user: username || email || phone || 'unknown',
                error: err.message,
            });
        }
    }

    return results;
};
