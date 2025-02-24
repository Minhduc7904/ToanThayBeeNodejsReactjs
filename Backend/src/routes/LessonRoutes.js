import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import PostLessonRequest from '../dtos/requests/lesson/PostLessonRequest.js'
import PutLessonRequest from '../dtos/requests/lesson/PutLessonRequest.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import * as LessonController from '../controllers/LessonController.js'

const router = express.Router()

router.get('/v1/user/lesson/:id',
    requireRoles([]),
    asyncHandler(LessonController.getLessonById)
)
router.get('/v1/user/lesson/class/:classId', 
    requireRoles([]),
    asyncHandler(LessonController.getLessonByClassId)
)
router.post('/v1/admin/lesson', 
    validate(PostLessonRequest),
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(LessonController.insertLesson)
)
router.put('/v1/admin/lesson/:id', 
    validate(PutLessonRequest),
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(LessonController.changeLesson)
)
router.delete('/v1/admin/lesson/:id', 
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(LessonController.deleteLesson)
)

export default router