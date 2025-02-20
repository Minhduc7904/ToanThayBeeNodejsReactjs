import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import PostUserRequest from '../dtos/requests/user/PostUserRequest.js';
import LoginUserRequest from '../dtos/requests/user/LoginUserRequest.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import * as UserController from '../controllers/UserController.js';

const router = express.Router();

router.post('/v1/user/register',
    validate(PostUserRequest),  
    asyncHandler(UserController.registerUser)
);

router.post('/v1/user/login', 
    validate(LoginUserRequest),
    asyncHandler(UserController.login)
);
    
router.get('/v1/user', 
    asyncHandler(UserController.getAllUsers)
);

router.get('/v1/user/:id', 
    asyncHandler(UserController.getUserById)
);

export default router;
