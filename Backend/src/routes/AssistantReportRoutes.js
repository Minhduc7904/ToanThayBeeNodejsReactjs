import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import PostAssistantReportRequest from '../dtos/requests/assistantReport/PostAssistantReportRequest.js';
import * as AssistantReportController from '../controllers/AssistantReportController.js';

const router = express.Router();

router.get('/v1/admin/assistant-report', 
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(AssistantReportController.getAssistantReport)
);
router.get('/v1/admin/assistant-report/:id', 
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(AssistantReportController.getAssistantReportById)
);
router.post('/v1/user/assistant-report', 
    validate(PostAssistantReportRequest),
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.STUDENT]),
    asyncHandler(AssistantReportController.postAssistantReport)
);
router.delete('/v1/assistant-report/:id', 
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    asyncHandler(AssistantReportController.deleteAssistantReport)
);

export default router;