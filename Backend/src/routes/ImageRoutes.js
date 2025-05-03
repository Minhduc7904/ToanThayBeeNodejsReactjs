import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import upload from '../middlewares/imageUpload.js'
import uploadGoogleImageMiddleware from '../middlewares/imageGoogleUpload.js'
import { handleMulterError } from '../middlewares/handelMulter.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import UserType from '../constants/UserType.js'

import * as ImageController from '../controllers/ImageController.js'

const router = express.Router()

router.post('/v1/images/google/upload-single',
    uploadGoogleImageMiddleware.single('image'),
    handleMulterError,
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(ImageController.uploadImageToFirebase)
)

router.delete('/v1/images/delete',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    ImageController.deleteImage
)

router.get('/v1/images/:folder', 
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(ImageController.getAllImages)
)

router.post('/v1/images/folders', 
    asyncHandler(ImageController.getAllImagesFolders)
)

export default router