import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import * as QuestionReportController from '../controllers/QuestionReportController.js';

const router = express.Router();

// quang

router.get('/v1/question-report', 
    asyncHandler(QuestionReportController.getQuestionReport)
);
router.get('/v1/question-report/:id', 
    asyncHandler(QuestionReportController.getQuestionReportById)
);
router.post('/v1/question-report', 
    asyncHandler(QuestionReportController.postQuestionReport)
);
router.delete('/v1/question-report/:id', 
    asyncHandler(QuestionReportController.deleteQuestionReport)
);

export default router;