import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import * as QuestionReportController from '../controllers/QuestionReportController.js'

const router = express.Router()

router.get('/v1/admin/question-report', 
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(QuestionReportController.getQuestionReport)
)
router.get('/v1/admin/question-report/:id', 
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(QuestionReportController.getQuestionReportById)
)
router.post('/v1/user/question-report', 
    requireRoles([]),
    asyncHandler(QuestionReportController.postQuestionReport)
)
router.delete('/v1/admin/question-report/:id', 
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(QuestionReportController.deleteQuestionReport)
)

export default router