import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import * as CheatController from '../controllers/CheatController.js'

const router = express.Router()

// Hảo

router.get('/v1/cheat/attempt/:attemptId', 
    asyncHandler(CheatController.getLoiByLuotLamBai)
)
router.get('/v1/cheat/exam/:examId', 
    asyncHandler(CheatController.getLoiByExamId)
)
router.post('/v1/cheat', 
    asyncHandler(CheatController.postLoi)
)
router.delete('/v1/cheat/:id', 
    asyncHandler(CheatController.deleteLoi)
)

export default router