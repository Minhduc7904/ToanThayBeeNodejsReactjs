// tokenHelper.js
import jwt from 'jsonwebtoken'
import db from '../models'
import { UserStatus } from '../constants/UserStatus'
import dotenv from 'dotenv'
dotenv.config()

/**
 * 🔒 Lấy token từ cookie và xác thực
 */
const authenticateToken = async (req, res, next) => {
    // Lấy token từ cookie có tên "token"
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'Token không được cung cấp' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // Xác thực token
        const user = await db.User.findByPk(decoded.id) // Tìm người dùng từ ID trong token

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' })
        }

        if (user.currentToken !== token) {
            return res.status(401).json({
                message: 'Phiên đăng nhập không hợp lệ hoặc đã bị đăng xuất.'
            })
        }

        req.user = user // Gắn user vào request để các middleware sau có thể dùng
        next()
    } catch (error) {
        console.error('Lỗi xác thực token:', error)
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })
    }
}

export default authenticateToken
