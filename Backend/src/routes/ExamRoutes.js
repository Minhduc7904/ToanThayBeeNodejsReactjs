import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import uploadGoogleImageMiddleware from '../middlewares/imageGoogleUpload.js'
import * as ExamController from '../controllers/ExamController.js'
import uploadPDF from '../middlewares/pdfGoogleUpload.js'

const router = express.Router()

router.get('/v1/user/exam/newest',
    // requireRoles([]),
    asyncHandler(ExamController.getNewestExam)
)
router.get('/v1/user/exam/saved',
    requireRoles([]),
    asyncHandler(ExamController.getSavedExams)
)
router.get('/v1/admin/exam',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(ExamController.getExam)
)

router.get('/v1/user/exam/:examId/related',
    requireRoles([]),
    asyncHandler(ExamController.getRelatedExams)
)

router.get('/v1/user/exam',
    requireRoles([]),
    asyncHandler(ExamController.getExamPublic)
)

router.get('/v1/admin/exam/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT, UserType.STUDENT]),
    asyncHandler(ExamController.getExamById)
)

router.get('/v1/admin/exam/:examId/questions',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(ExamController.getQuestionByExamId)
)

router.get('/v1/user/exam/:examId/questions',
    requireRoles([]),
    asyncHandler(ExamController.getPublicQuestionByExamId)
)

router.get('/v1/user/exam/:id',
    requireRoles([]),
    asyncHandler(ExamController.getExamPublicById)
)

router.get('/v1/user/exam/:examId/related',
    requireRoles([]),
    asyncHandler(ExamController.getRelatedExams)
)

router.post('/v1/admin/exam',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    uploadGoogleImageMiddleware.fields([
        { name: 'examImage', maxCount: 1 },
        { name: 'questionImages', maxCount: 20 },
        { name: 'statementImages', maxCount: 20 }
    ]),
    asyncHandler(ExamController.postExam)
)

router.post('/v1/admin/exam/:id/upload-pdf',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    uploadPDF.single('pdf'),
    asyncHandler(ExamController.uploadSolutionPdf)
)

router.post('/v1/user/save-exam',
    requireRoles([]),
    asyncHandler(ExamController.saveExamForUser)
)

router.post('/v1/user/submit-exam',
    requireRoles([]),
    asyncHandler(ExamController.submitExamAPI)
)


router.put('/v1/admin/exam/:id',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(ExamController.putExam)
)
router.put('/v1/admin/exam/:id/image',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    uploadGoogleImageMiddleware.single('examImage'),
    asyncHandler(ExamController.putImageExam)
)
router.delete('/v1/admin/exam/:id',
    asyncHandler(ExamController.deleteExam)
)



export default router