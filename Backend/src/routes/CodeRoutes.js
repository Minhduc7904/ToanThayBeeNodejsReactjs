import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import PostCodeRequest from '../dtos/requests/code/PostCodeRequest.js';
import * as CodeController from '../controllers/CodeController.js';
import PutCodeRequest from '../dtos/requests/code/PutCodeRequest.js';

const router = express.Router();

router.get('/v1/admin/code',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(CodeController.getAllCode)
);
router.get('/v1/admin/code/:code',
    requireRoles([UserType.ADMIN, UserType.TEACHER, UserType.ASSISTANT]),
    asyncHandler(CodeController.getCodeByCode)
);
router.post('/v1/admin/code',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    validate(PostCodeRequest),
    asyncHandler(CodeController.postCode)
);
router.put('/v1/admin/code/:code',
    requireRoles([UserType.ADMIN, UserType.TEACHER]),
    validate(PutCodeRequest),
    asyncHandler(CodeController.putCode)
);

export default router;