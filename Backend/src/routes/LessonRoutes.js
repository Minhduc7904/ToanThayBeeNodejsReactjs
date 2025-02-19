import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import * as LessonController from '../controllers/LessonController.js';

const router = express.Router();

router.get('/v1/lesson', 
    asyncHandler(LessonController.getBuoiHoc)
);
router.get('/v1/lesson/:id', 
    asyncHandler(LessonController.getBuoiHocById)
);
router.get('/v1/lesson/class/:classId', 
    asyncHandler(LessonController.getBuoiHocByClassId)
);
router.post('/v1/lesson', 
    asyncHandler(LessonController.postBuoiHoc)
);
router.put('/v1/lesson/:id', 
    asyncHandler(LessonController.putBuoiHoc)
);
router.delete('/v1/lesson/:id', 
    asyncHandler(LessonController.deleteBuoiHoc)
);

export default router;