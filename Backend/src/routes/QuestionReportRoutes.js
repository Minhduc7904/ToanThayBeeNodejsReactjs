import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import * as QuestionReportController from '../controllers/QuestionReportController.js';

const router = express.Router();

// quang

router.get('/v1/question-report', 
    asyncHandler(QuestionReportController.getBaoCaoCH)
);
router.get('/v1/question-report/:id', 
    asyncHandler(QuestionReportController.getBaoCaoCHById)
);
router.post('/v1/question-report', 
    asyncHandler(QuestionReportController.postBaoCaoCH)
);
router.delete('/v1/question-report/:id', 
    asyncHandler(QuestionReportController.deleteBaoCaoCH)
);

export default router;