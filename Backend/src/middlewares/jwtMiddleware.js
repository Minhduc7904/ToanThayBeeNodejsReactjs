/**
    Viết các hàm trong JWT middleware (requireRole requireRoles) với các chức năng sau:
    - Lấy jwt Token từ header của request và kiểm tra xem token có hợp lệ và còn hạn không
    - lấy ra user'id từ token và query xuống database xem user này có bị block hay không
    - lấy ra role của user và kiểm tra xem role đó có phù hợp với đầu vào của các hàm requireRole requireRoles không

    app.get('api/private', requireRole('AD'), (req, res) => {
        res.send('Chỉ dành cho admin');
    }
*/

import authenticateToken from '../helpers/tokenHelper';
/**
 * 🎯 Middleware: Yêu cầu một trong các vai trò
 * @param {string[]} roles - Mảng vai trò cho phép (ví dụ: ['AD', 'MOD'])
 */
export const requireRoles = (roles = []) => [
    authenticateToken, // ✅ Middleware xác thực token trước
    (req, res, next) => {
        if (!roles.includes(req.user.userType) && roles.length !== 0) {
            return res.status(403).json({ message: '❌ Bạn không có quyền truy cập.' });
        }

        next();
    },
];




