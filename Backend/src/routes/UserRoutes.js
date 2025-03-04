import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import PostUserRequest from '../dtos/requests/user/PostUserRequest.js'
import PutUserRequest from '../dtos/requests/user/PutUserRequest.js'
import LoginUserRequest from '../dtos/requests/user/LoginUserRequest.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import uploadGoogleImageMiddleware from '../middlewares/imageGoogleUpload.js'
import { handleMulterError } from '../middlewares/handelMulter.js'
import * as UserController from '../controllers/UserController.js'

const router = express.Router()

// Route đăng kí người dùng
router.post('/v1/user/register',
    validate(PostUserRequest),  
    asyncHandler(UserController.registerUser)
)

// Route đăng nhập người dùng
router.post('/v1/user/login', 
    validate(LoginUserRequest),
    asyncHandler(UserController.login)
)

router.post('/v1/user/logout', 
    requireRoles([]), 
    UserController.logout
)

// Route lấy tất cả người dùng
router.get('/v1/admin/user', 
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(UserController.getAllUsers)
)

// Route lấy tất cả người dùng theo class
router.get('/v1/admin/user/class/:classId', 
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(UserController.getUsersByClass)
)

// Route lấy thông tin người dùng theo ID
router.get('/v1/admin/user/:id', 
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(UserController.getUserById)
)

// Route cập nhật thông tin người dùng theo ID 
router.put('/v1/admin/user/:id', 
    validate(PutUserRequest),
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(UserController.putUser)
)

// Route cập nhật thông tin người dùng của chính mình
router.put('/v1/user',
    validate(PutUserRequest),
    requireRoles([]),
    asyncHandler(UserController.updateUserInfo)
)

// Route cập nhật mật khẩu người dùng
router.put('/v1/user/password', 
    requireRoles([]), 
    asyncHandler(UserController.changePassword)
)

// Route cập nhật trạng thái người dùng
router.put('/v1/admin/user/:id/status',
    validate(PutUserRequest),
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(UserController.changeUserStatus)
)

// Route cập nhật loại người dùng
router.put('/v1/admin/user/:id/user-type', 
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(UserController.changeUserType)
)

// Route cập nhật avatar người dùng
router.put('/v1/user/avatar', 
    requireRoles([]), 
    uploadGoogleImageMiddleware.single('avatar'),
    handleMulterError,
    asyncHandler(UserController.updateAvatar)
)

export default router