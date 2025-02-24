import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.js'
import validate from '../middlewares/validate.js'
import UserType from '../constants/UserType.js'
import { requireRoles } from '../middlewares/jwtMiddleware.js'
import * as StatementController from '../controllers/StatementController.js'

const router = express.Router()

router.get('/v1/statement/question/:questionId', 
    asyncHandler(StatementController.getStatementByQuestionId)
)
router.get('/v1/statement/:id', 
    asyncHandler(StatementController.getStatementById)
)
router.post('/v1/statement', 
    asyncHandler(StatementController.postStatement)
)
router.put('/v1/statement/:id', 
    asyncHandler(StatementController.putStatement)
)
router.delete('/v1/statement/:id', 
    asyncHandler(StatementController.deleteStatement)
)

export default router