import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import * as ExamController from '../controllers/ExamController.js';

const router = express.Router();

router.get('/v1/exam', 
    asyncHandler(ExamController.getExam)
);
router.get('/v1/exam/:id', 
    asyncHandler(ExamController.getExamById)
);
router.post('/v1/exam', 
    asyncHandler(ExamController.postExam)
);
router.put('/v1/exam/:id', 
    asyncHandler(ExamController.putExam)
);
router.delete('/v1/exam/:id', 
    asyncHandler(ExamController.deleteExam)
);

export default router;