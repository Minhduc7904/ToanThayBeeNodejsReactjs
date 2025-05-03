import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import uploadGoogleImageMiddleware from '../middlewares/imageGoogleUpload.js'
import uploadPDF from '../middlewares/pdfGoogleUpload.js'
import * as ArticleController from '../controllers/ArticleController.js'

const router = express.Router()

router.get('/v1/user/article',
    requireRoles([]),
    asyncHandler(ArticleController.getArticle)
)

router.get('/v1/user/article/newest',
    asyncHandler(ArticleController.getNewestArticle)
)

router.get('/v1/user/article/:id',
    requireRoles([]),
    asyncHandler(ArticleController.getArticleById)
)

router.put('/v1/admin/article/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(ArticleController.putArticle)
)

router.post('/v1/admin/article',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(ArticleController.postArticle)
)

router.delete('/v1/admin/article/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(ArticleController.deleteArticle)
)

export default router
