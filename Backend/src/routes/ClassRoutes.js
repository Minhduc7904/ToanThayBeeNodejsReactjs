import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import UserType from '../constants/UserType.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import * as ClassController from '../controllers/ClassController.js';

const router = express.Router();

// bách

router.get('/v1/class', 
    asyncHandler(ClassController.getClass)
);
router.get('/v1/class/:id', 
    asyncHandler(ClassController.getClassById)
);
// lấy những class mà học sinh đã join hoặc là đang chờ
router.get('/v1/class/', 
    asyncHandler(ClassController.ge)
);

router.post('/v1/class', 
    asyncHandler(ClassController.postClass)
);

router.put('/v1/class/:id', 
    asyncHandler(ClassController.putClass)
);

router.delete('/v1/class/:id', 
    asyncHandler(ClassController.deleteClass)
);

export default router;