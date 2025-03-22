import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import * as AnswerController from '../controllers/AnswerController.js'

const router = express.Router()



router.get('/v1/answer/:id', 
    asyncHandler(AnswerController.getCauTraLoiById)
)
router.get('/v1/user/answer/attempt/:attemptId', 
    requireRoles([]),
    asyncHandler(AnswerController.getAnswerByAttempt)
)
router.post('/v1/answer', 
    asyncHandler(AnswerController.postCauTraLoi)
)
router.put('/v1/answer/:id', 
    asyncHandler(AnswerController.putCauTraLoi)
)
router.delete('/v1/answer/:id', 
    asyncHandler(AnswerController.deleteCauTraLoi)
)

export default router