import { Sequelize } from "../models"
import db from "../models"
import UserResponse from "../dtos/responses/user/UserResponse"
import bcrypt from "bcrypt"
import UserType from "../constants/UserType"
import UserStatus from "../constants/UserStatus"
import jwt from "jsonwebtoken"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, getStorage } from 'firebase/storage'
import { uploadImage, cleanupUploadedFiles } from "../utils/imageUpload.js"

require('dotenv').config()

export const registerUser = async (req, res) => {
    const { email, username, phone } = req.body
    if (!username && !email) {
        return res.status(400).json({ message: 'Tài khoản không được để trống' })
    }

    if (username) {
        const exitingUsernameUser = await db.User.findOne({ where: { username } })
        if (exitingUsernameUser) {
            return res.status(409).json({ message: 'Username đã tồn tại' })
        }
    }

    if (email) {
        const exitingEmailUser = await db.User.findOne({ where: { email } })
        if (exitingEmailUser) {
            return res.status(409).json({ message: 'Email đã tồn tại' })
        }
    }

    if (phone) {
        const exitingPhoneUser = await db.User.findOne({ where: { phone } })
        if (exitingPhoneUser) {
            return res.status(409).json({ message: 'Số điện thoại đã tồn tại' })
        }
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = await db.User.create({
        ...req.body,
        username,
        userType: UserType.STUDENT,
        status: UserStatus.ACTIVE,
        password: hashedPassword
    })

    if (!newUser) {
        return res.status(400).json({ message: 'Tạo mới người dùng thất bại' })
    }
    return res.status(201).json({
        message: 'Thêm người dùng thành công',
        user: new UserResponse(newUser)
    })
}

export const login = async (req, res) => {
    const { username, email, password } = req.body

    if ((!username && !email) || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu' })
    }
    const user = await db.User.findOne({
        where: username ? { username } : { email },
    })
    if (!user) {
        return res.status(404).json({ message: 'Tài khoản không tồn tại' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({ message: 'Mật khẩu không đúng' })
    }

    const token = jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    )

    await db.User.update({ currentToken: token }, { where: { id: user.id } })

    return res.status(200).json({
        message: 'Đăng nhập thành công',
        token,
        user: new UserResponse(user),
        // user
    })
}

export const updateUserInfo = async (req, res) => {
    const user = req.user
    const forbiddenFields = ['username', 'password', 'userType', 'status', 'avatarUrl']

    const updatedData = Object.keys(req.body)
        .filter(key => !forbiddenFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = req.body[key]
            return obj
        }, {})

    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: 'Không có trường hợp lệ để cập nhật.' })
    }

    const [updated] = await db.User.update(updatedData, { where: { id: user.id } })

    if (!updated) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' })
    }

    const updatedUser = await db.User.findByPk(user.id)
    return res.status(200).json({ message: 'Cập nhật người dùng thành công', data: new UserResponse(updatedUser) })
}

export const putUser = async (req, res) => {
    const { id } = req.params

    const forbiddenFields = ['username', 'password', 'userType', 'status', 'avatarUrl']

    const updatedData = Object.keys(req.body)
        .filter(key => !forbiddenFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = req.body[key]
            return obj
        }, {})

    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: 'Không có trường hợp lệ để cập nhật.' })
    }

    const [updated] = await db.User.update(updatedData, {
        where: { id }
    })


    if (!updated) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' })
    }

    const updatedUser = await db.User.findByPk(id)
    return res.status(200).json({ message: 'Cập nhật người dùng thành công', data: new UserResponse(updatedUser) })
}

export const logout = async (req, res) => {
    const user = req.user

    if (!user) {
        return res.status(401).json({ message: 'Không xác định được người dùng.' })
    }

    await db.User.update(
        { currentToken: null },
        { where: { id: user.id } }
    )

    return res.status(200).json({ message: 'Đăng xuất thành công.' })
}


export const changeUserType = async (req, res) => {
    const { id } = req.params
    const { userType } = req.body
    const [updated] = await db.User.update({ userType, currentToken: null }, { where: { id } })
    if (!updated) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' })
    }

    const updatedUser = await db.User.findByPk(id)
    return res.status(200).json({
        message: 'Cập nhật role người dùng thành công',
        data: new UserResponse(updatedUser)
    })
}

export const changeUserStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    const [updated] = await db.User.update({ status, currentToken: null }, { where: { id } })
    if (!updated) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' })
    }
    const updatedUser = await db.User.findByPk(id)
    return res.status(200).json({
        message: 'Cập nhật trạng thái người dùng thành công',
        data: new UserResponse(updatedUser)
    })
}

export const changePassword = async (req, res) => {
    const user = req.user
    const { oldPassword, newPassword, confirmPassword } = req.body

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường.' })
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp.' })
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu cũ không đúng.' })
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
        return res.status(400).json({ message: 'Mật khẩu mới không được trùng với mật khẩu cũ.' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db.User.update(
        {
            password: hashedPassword,
            currentToken: null
        },
        { where: { id: user.id } }
    )

    return res.status(200).json({ message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' })
}

export const getUserById = async (req, res) => {
    const { id } = req.params
    const userDetail = await db.User.findByPk(id)

    if (!userDetail) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' })
    }
    return res.status(200).json({
        message: 'Chi tiết người dùng',
        user: new UserResponse(userDetail)
        // userDetail 
    })
}

export const getAllUsers = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    let whereClause = {}
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { middleName: { [Op.like]: `%${search}%` } },
                { firstName: { [Op.like]: `%${search}%` } },
                { userType: { [Op.like]: `%${search}%` } },
                { birthDate: { [Op.like]: `%${search}%` } },
                { highSchool: { [Op.like]: `%${search}%` } },
                { class: { [Op.like]: `%${search}%` } },
                { status: { [Op.like]: `%${search}%` } },
                { graduationYear: { [Op.like]: `%${search}%` } },
                { university: { [Op.like]: `%${search}%` } }
            ]
        }
    }

    const [userList, total] = await Promise.all([
        db.User.findAll({
            where: whereClause,
            offset,
            limit
        }),
        db.User.count({
            where: whereClause
        })
    ])

    console.log(userList)

    const formattedUsers = userList.map(user => new UserResponse(user))

    return res.status(200).json({
        message: 'Danh sách người dùng',
        // data: formattedUsers,
        data: userList,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    })
}

export const getUsersByClass = async (req, res) => {
    const classId = req.params.classId
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit

    if (!classId) {
        return res.status(400).json({ message: '❌ Thiếu classId!' })
    }

    const whereClause = search.trim() ? {
        [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
        ],
    } : {}

    const users = await db.StudentClassStatus.findAll({
        where: { classId },
        include: [
            {
                model: db.User,
                as: 'student',
                where: whereClause,
            },
        ],
        limit,
        offset,
    })
    const formattedUsers = users.map(userRecord => {
        const user = userRecord.student 
        const status = userRecord.status 
        return new UserResponse(user, status) 
    })
    const total = formattedUsers.length

    return res.status(200).json({
        message: '✅ Lấy danh sách người dùng trong lớp thành công!',
        data: formattedUsers,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    })
}

export const updateAvatar = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    const { id } = req.user

    try {
        const user = await db.User.findByPk(id, { transaction })

        if (!user) {
            await transaction.rollback()
            return res.status(404).json({ message: '❌ Người dùng không tồn tại' })
        }

        const oldAvatarUrl = user.avatarUrl
        const newAvatarFile = req.file

        if (!newAvatarFile) {
            await transaction.rollback()
            return res.status(400).json({ message: '❌ Vui lòng chọn ảnh để tải lên.' })
        }
        const newAvartarUrl = await uploadImage(newAvatarFile)

        if (!newAvartarUrl) {
            await transaction.rollback()
            return res.status(500).json({ message: '❌ Lỗi khi tải ảnh mới lên.' })
        }

        const [updated] = await db.User.update(
            { avatarUrl: newAvartarUrl },
            { where: { id }, transaction }
        )

        if (!updated) {
            await cleanupUploadedFiles([newAvartarUrl])
            await transaction.rollback()
            return res.status(500).json({ message: '❌ Lỗi khi cập nhật avatar.' })
        }

        if (oldAvatarUrl) {
            try {
                await cleanupUploadedFiles([oldAvatarUrl])
                console.log(`✅ Đã xóa ảnh cũ: ${oldAvatarUrl}`)
            } catch (err) {
                console.error(`❌ Lỗi khi xóa ảnh cũ: ${oldAvatarUrl}`, err)
                await cleanupUploadedFiles([newAvartarUrl])
                await transaction.rollback()
                return res.status(500).json({ message: 'Lỗi khi xóa ảnh cũ.', error: err.message })
            }
        }

        await transaction.commit()

        return res.status(200).json({
            message: '✅ Cập nhật avartar thành công.',
            oldAvatarUrl,
            newAvartarUrl,
        })

    } catch (error) {
        console.error('❌ Lỗi khi cập nhật avartar:', error)
        await transaction.rollback()
        return res.status(500).json({ message: 'Lỗi server.', error: error.message })
    }
}