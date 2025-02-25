import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import PostClassRequest from '../dtos/requests/class/PostClassRequest.js'
import PutClassRequest from '../dtos/requests/class/PutClassRequest.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import * as ClassController from '../controllers/ClassController.js'

const router = express.Router()

router.get('/v1/user/class', 
    requireRoles([]),
    asyncHandler(ClassController.getPublicClass)
)

router.get('/v1/admin/class',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(ClassController.getAllClass)
)

router.get('/v1/user/class/joined',
    requireRoles([]), 
    asyncHandler(ClassController.getClassByUser)
)

router.put('/v1/admin/user/:studentId/class/:classId/accept',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]), 
    asyncHandler(ClassController.acceptStudentJoinClass)
)

router.get('/v1/user/class/:id',
    requireRoles([]), 
    asyncHandler(ClassController.getDetailClassByUser)
)

router.get('/v1/admin/class/:id', 
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(ClassController.getDetailClassByAdmin)
)

router.post('/v1/user/class/:classId/join',
    requireRoles([UserType.STUDENT]), 
    asyncHandler(ClassController.joinClass)
)

router.post('/v1/admin/class', 
    validate(PostClassRequest),
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(ClassController.postClass)
)

router.put('/v1/admin/class/:id', 
    validate(PutClassRequest),
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(ClassController.putClass)
)

router.delete('/v1/admin/class/:id', 
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(ClassController.deleteClass)
)

router.delete('/v1/admin/user/:studentId/class/:classId/kick',
    requireRoles([UserType.ADMIN, UserType.TEACHER]), 
    asyncHandler(ClassController.kickStudentFromClass)
)

export default router