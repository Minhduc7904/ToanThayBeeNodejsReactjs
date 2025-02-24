import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import * as AttemptController from '../controllers/AttemptController.js'

const router = express.Router()

router.get('/v1/attempt', 
    asyncHandler(AttemptController.getAttempts)
)
router.get('/v1/attempt/:id', 
    asyncHandler(AttemptController.get)
)
router.get('/v1/attempt/exam/:examId', 
    asyncHandler(AttemptController.getLuotLamBaiByDeId)
)
router.post('/v1/attempt', 
    asyncHandler(AttemptController.postLuotLamBai)
)
router.put('/v1/attempt/:id', 
    asyncHandler(AttemptController.putLuotLamBai)
)
router.delete('/v1/attempt/:id', 
    asyncHandler(AttemptController.deleteLuotLamBai)
)

export default router