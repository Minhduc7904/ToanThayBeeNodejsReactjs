import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import * as AssistantReportController from '../controllers/AssistantReportController.js';

const router = express.Router();

router.get('/v1/assistant-report', 
    asyncHandler(AssistantReportController.getBaoCaoND)
);
router.get('/v1/assistant-report/:id', 
    asyncHandler(AssistantReportController.getBaoCaoNDById)
);
router.post('/v1/assistant-report', 
    asyncHandler(AssistantReportController.postBaoCaoND)
);
router.delete('/v1/assistant-report/:id', 
    asyncHandler(AssistantReportController.deleteBaoCaoND)
);

export default router;