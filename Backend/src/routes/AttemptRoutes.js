import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import * as AttemptController from '../controllers/AttemptController.js'

const router = express.Router()

router.get('/v1/user/attempt',
    requireRoles([]),
    asyncHandler(AttemptController.getAttemptsByUser)
)
router.get('/v1/attempt/:id', 
    requireRoles([]),
    asyncHandler(AttemptController.get)
)

router.get('/v1/user/attempt/exam/:examId/history',
    requireRoles([]),
    asyncHandler(AttemptController.getAttemptByStudentId)
)
router.get('/v1/admin/attempt/exam/:examId', 
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(AttemptController.getAttemptsForAdminByExamId)
)
router.get('/v1/user/attempt/exam/:examId', 
    requireRoles([]),
    asyncHandler(AttemptController.getAttemptByExamId)
)

export default router