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

router.post('/v1/images/upload-single', 
    upload.single('image'),
    handleMulterError,
    asyncHandler(ImageController.uploadImage)
)

router.post('/v1/images/upload-multiple', 
    upload.array('images', 5),
    handleMulterError,
    asyncHandler(ImageController.uploadImages)
)

router.post('/v1/images/google/upload-single',
    uploadGoogleImageMiddleware.single('image'),
    handleMulterError,
    asyncHandler(ImageController.uploadImageToFirebase)
)

router.post('/v1/images/google/upload-multiple',
    uploadGoogleImageMiddleware.array('images', 5),
    handleMulterError,
    asyncHandler(ImageController.uploadMultipleImagesToFirebase)
)

router.delete('/v1/images/delete',
    ImageController.deleteImage
)

router.get('/v1/images/:filename', 
    asyncHandler(ImageController.viewImage)
)

export default router