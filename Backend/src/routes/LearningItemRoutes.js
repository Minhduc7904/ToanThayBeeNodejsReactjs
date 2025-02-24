import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import * as LearningItemController from '../controllers/LearningItemController.js'

const router = express.Router()

router.get('/v1/user/learning-item/:id', 
    requireRoles([]),
    asyncHandler(LearningItemController.getLearningItemById)
)
router.get('/v1/user/learning-item/lesson/:lessonId', 
    requireRoles([]),
    asyncHandler(LearningItemController.getLearningItemByLesson)
)
router.post('/v1/admin/learning-item', 
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(LearningItemController.postLearningItem)
)
router.put('/v1/admin/learning-item/:id', 
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(LearningItemController.putLearningItem)
)
router.delete('/v1/admin/learning-item/:id', 
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(LearningItemController.deleteLearningItem)
)

export default router