import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import UserType from '../constants/UserType.js'
import uploadGoogleImageMiddleware from '../middlewares/imageGoogleUpload.js'
import PostQuestionRequest from '../dtos/requests/question/PostQuestionRequest.js'
import PutQuestionRequest from '../dtos/requests/question/PutQuestionRequest.js'
import * as QuestionController from '../controllers/QuestionController.js'

const router = express.Router()

router.get('/v1/admin/question',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(QuestionController.getQuestion)
)
router.get('/v1/admin/question/exam/:examId',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(QuestionController.getQuestionByExamId)
)
router.get('/v1/admin/question/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(QuestionController.getQuestionById)
)

router.post('/v1/admin/question',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    // validate(PostQuestionRequest),
    uploadGoogleImageMiddleware.fields([
        { name: 'questionImage', maxCount: 1 },
        { name: 'statementImages', maxCount: 4 },
        { name: 'solutionImage', maxCount: 1 }
    ]),
    asyncHandler(QuestionController.postQuestion)
)

router.put('/v1/admin/question/:id',
    // validate(PutQuestionRequest),
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(QuestionController.putQuestion)
)

router.put('/v1/admin/question/:id/image',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    uploadGoogleImageMiddleware.single('questionImage'),
    asyncHandler(QuestionController.putQuestionImage)
)

router.put('/v1/admin/question/:id/solutionImage',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    uploadGoogleImageMiddleware.single('solutionImage'),
    asyncHandler(QuestionController.putQuestionSolutionImage)
)

router.delete('/v1/admin/question/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(QuestionController.deleteQuestion)
)
router.delete('/v1/admin/question/:id/image',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(QuestionController.deleteQuestionImage)
)




export default router
