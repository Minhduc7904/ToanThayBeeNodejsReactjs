import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import UserType from '../constants/UserType.js';
import * as QuestionController from '../controllers/QuestionController.js';

const router = express.Router();

router.get('/v1/question', 
    asyncHandler(QuestionController.getQuestion)
);
router.get('/v1/question/:id', 
    asyncHandler(QuestionController.getQuestionById)
);
router.get('/v1/question/exam/:examId', 
    asyncHandler(QuestionController.getQuestionByExamId)
);
router.post('/v1/question', 
    asyncHandler(QuestionController.postQuestion)
);
router.put('/v1/question/:id', 
    asyncHandler(QuestionController.putQuestion)
);
router.delete('/v1/question/:id', 
    asyncHandler(QuestionController.deleteQuestion)
);

export default router;
