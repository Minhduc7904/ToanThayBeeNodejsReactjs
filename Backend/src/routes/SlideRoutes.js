import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import * as SlideController from '../controllers/SlideController.js';

const router = express.Router();

router.get('/v1/slide', 
    asyncHandler(SlideController.getSlides)
);
router.get('/v1/slide/:id', 
    asyncHandler(SlideController.getSlideById)
);
router.post('/v1/slide', 
    asyncHandler(SlideController.postSlide)
);
router.put('/v1/slide/:id', 
    asyncHandler(SlideController.putSlide)
);
router.delete('/v1/slide/:id', 
    asyncHandler(SlideController.deleteSlide)
);

export default router;