import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import UserType from '../constants/UserType.js'
import uploadGoogleImageMiddleware from '../middlewares/imageGoogleUpload.js'
import { handleMulterError } from '../middlewares/handelMulter.js'
import * as AchievementController from '../controllers/AchievementController.js'

const router = express.Router()

// Achievement Categories routes
router.get('/v1/achievement/categories',
    asyncHandler(AchievementController.getAllAchievementCategories)
)

router.get('/v1/achievement/categories/:id',
    asyncHandler(AchievementController.getAchievementCategoryById)
)

router.post('/v1/admin/achievement/categories',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(AchievementController.createAchievementCategory)
)

router.put('/v1/admin/achievement/categories/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(AchievementController.updateAchievementCategory)
)

router.delete('/v1/admin/achievement/categories/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(AchievementController.deleteAchievementCategory)
)

// Achievement Stats routes
router.get('/v1/achievement/stats',
    asyncHandler(AchievementController.getAllAchievementStats)
)

router.get('/v1/achievement/stats/:id',
    asyncHandler(AchievementController.getAchievementStatById)
)

router.post('/v1/admin/achievement/stats',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(AchievementController.createAchievementStat)
)

router.put('/v1/admin/achievement/stats/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(AchievementController.updateAchievementStat)
)

router.delete('/v1/admin/achievement/stats/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(AchievementController.deleteAchievementStat)
)

// Achievement Images routes
router.get('/v1/achievement/images',
    asyncHandler(AchievementController.getAllAchievementImages)
)

router.get('/v1/achievement/images/:id',
    asyncHandler(AchievementController.getAchievementImageById)
)

router.post('/v1/admin/achievement/images',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    uploadGoogleImageMiddleware.single('image'),
    handleMulterError,
    asyncHandler(AchievementController.createAchievementImage)
)

router.put('/v1/admin/achievement/images/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    uploadGoogleImageMiddleware.single('image'),
    handleMulterError,
    asyncHandler(AchievementController.updateAchievementImage)
)

router.delete('/v1/admin/achievement/images/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(AchievementController.deleteAchievementImage)
)

export default router
