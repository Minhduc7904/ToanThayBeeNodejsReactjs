import authenticateToken from '../helpers/tokenHelper'
/**
 * @param {string[]} roles
 */
export const requireRoles = (roles = []) => [
    authenticateToken,
    (req, res, next) => {
        if (!roles.includes(req.user.userType) && roles.length !== 0) {
            return res.status(403).json({ message: '❌ Bạn không có quyền truy cập.' })
        }

        next()
    },
]




