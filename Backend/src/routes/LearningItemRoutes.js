import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import * as LearningItemController from '../controllers/LearningItemController.js';

const router = express.Router();

router.get('/v1/learning-item', 
    asyncHandler(LearningItemController.getMucHocTap)
);
router.get('/v1/learning-item/:id', 
    asyncHandler(LearningItemController.getMucHocTapById)
);
router.get('/v1/learning-item/lesson/:lessonId', 
    asyncHandler(LearningItemController.getMucHocTapByBuoiHoc)
);
router.post('/v1/learning-item', 
    asyncHandler(LearningItemController.postMucHocTap)
);
router.put('/v1/learning-item/:id', 
    asyncHandler(LearningItemController.putMucHocTap)
);
router.delete('/v1/learning-item/:id', 
    asyncHandler(LearningItemController.deleteMucHocTap)
);

export default router;