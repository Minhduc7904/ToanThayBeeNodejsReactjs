import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import PostCodeRequest from '../dtos/requests/code/PostCodeRequest.js';
import * as CodeController from '../controllers/CodeController.js';

const router = express.Router();

router.get('/v1/code',
    asyncHandler(CodeController.getAllCode)
);
router.get('/v1/code/:code',
    asyncHandler(CodeController.getCodeByCode)
);
router.post('/v1/code',
    validate(PostCodeRequest),
    asyncHandler(CodeController.postCode)
);
router.put('/v1/code/:code',
    requireRoles([UserType.ADMIN]),
    asyncHandler(CodeController.putCode)
);

export default router;