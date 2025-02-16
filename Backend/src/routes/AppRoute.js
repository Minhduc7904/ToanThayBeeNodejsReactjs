import express from 'express';
import * as UserController from '../controllers/UserController.js';
import * as ExamController from '../controllers/ExamController.js';
import * as QuestionController from '../controllers/QuestionController.js';
import * as ClassController from '../controllers/ClassController.js';
import * as AssistantReportController from '../controllers/AssistantReportController.js';
import * as QuestionReportController from '../controllers/QuestionReportController.js';
import * as LessonController from '../controllers/LessonController.js';
import * as AttemptController from '../controllers/AttemptController.js';
import * as AnswerController from '../controllers/AnswerController.js';
import * as CheatController from '../controllers/CheatController.js';
import * as LearningItemController from '../controllers/LearningItemController.js';
import * as CodeController from '../controllers/CodeController.js';
import * as StatementController from '../controllers/StatementController.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import PostCodeRequest from "../dtos/requests/PostCodeRequest";


const router = express.Router();

export const AppRoute = (app) => {
    // Exam routes
    router.get('/v1/exam', asyncHandler(ExamController.getExam));
    router.get('/v1/exam/:id', asyncHandler(ExamController.getExamById));
    router.post('/v1/exam', asyncHandler(ExamController.postExam));
    router.put('/v1/exam/:id', asyncHandler(ExamController.putExam));
    router.delete('/v1/exam/:id', asyncHandler(ExamController.deleteExam));

    // Question routes
    router.get('/v1/question', asyncHandler(QuestionController.getQuestion));
    router.get('/v1/question/:id', asyncHandler(QuestionController.getQuestionById));
    router.get('/v1/question/exam/:examId', asyncHandler(QuestionController.getQuestionByExamId));
    router.post('/v1/question', asyncHandler(QuestionController.postQuestion));
    router.put('/v1/question/:id', asyncHandler(QuestionController.putQuestion));
    router.delete('/v1/question/:id', asyncHandler(QuestionController.deleteQuestion));

    // Class routes
    router.get('/v1/class', asyncHandler(ClassController.getClass));
    router.get('/v1/class/:id', asyncHandler(ClassController.getClassById));
    router.post('/v1/class', asyncHandler(ClassController.postClass));
    router.put('/v1/class/:id', asyncHandler(ClassController.putClass));
    router.delete('/v1/class/:id', asyncHandler(ClassController.deleteClass));

    // AssistantReport routes
    router.get('/v1/assistant-report', asyncHandler(AssistantReportController.getBaoCaoND));
    router.get('/v1/assistant-report/:id', asyncHandler(AssistantReportController.getBaoCaoNDById));
    router.post('/v1/assistant-report', asyncHandler(AssistantReportController.postBaoCaoND));
    router.delete('/v1/assistant-report/:id', asyncHandler(AssistantReportController.deleteBaoCaoND));

    // QuestionReport routes
    router.get('/v1/question-report', asyncHandler(QuestionReportController.getBaoCaoCH));
    router.get('/v1/question-report/:id', asyncHandler(QuestionReportController.getBaoCaoCHById));
    router.post('/v1/question-report', asyncHandler(QuestionReportController.postBaoCaoCH));
    router.delete('/v1/question-report/:id', asyncHandler(QuestionReportController.deleteBaoCaoCH));

    // Lesson routes
    router.get('/v1/lesson', asyncHandler(LessonController.getBuoiHoc));
    router.get('/v1/lesson/:id', asyncHandler(LessonController.getBuoiHocById));
    router.get('/v1/lesson/class/:classId', asyncHandler(LessonController.getBuoiHocByClassId));
    router.post('/v1/lesson', asyncHandler(LessonController.postBuoiHoc));
    router.put('/v1/lesson/:id', asyncHandler(LessonController.putBuoiHoc));
    router.delete('/v1/lesson/:id', asyncHandler(LessonController.deleteBuoiHoc));

    // Attempt routes
    router.get('/v1/attempt', asyncHandler(AttemptController.getLuotLamBai));
    router.get('/v1/attempt/:id', asyncHandler(AttemptController.getLuotLamBaiById));
    router.get('/v1/attempt/exam/:examId', asyncHandler(AttemptController.getLuotLamBaiByDeId));
    router.post('/v1/attempt', asyncHandler(AttemptController.postLuotLamBai));
    router.put('/v1/attempt/:id', asyncHandler(AttemptController.putLuotLamBai));
    router.delete('/v1/attempt/:id', asyncHandler(AttemptController.deleteLuotLamBai));

    // Answer routes
    router.get('/v1/answer/:id', asyncHandler(AnswerController.getCauTraLoiById));
    router.get('/v1/answer/attempt/:attemptId', asyncHandler(AnswerController.getCauTraLoiByLuotLamBai));
    router.post('/v1/answer', asyncHandler(AnswerController.postCauTraLoi));
    router.put('/v1/answer/:id', asyncHandler(AnswerController.putCauTraLoi));
    router.delete('/v1/answer/:id', asyncHandler(AnswerController.deleteCauTraLoi));

    // Cheat routes
    router.get('/v1/cheat', asyncHandler(CheatController.getLoi));
    router.get('/v1/cheat/attempt/:attemptId', asyncHandler(CheatController.getLoiByLuotLamBai));
    router.post('/v1/cheat', asyncHandler(CheatController.postLoi));
    router.delete('/v1/cheat/:id', asyncHandler(CheatController.deleteLoi));

    // LearningItem routes
    router.get('/v1/learning-item', asyncHandler(LearningItemController.getMucHocTap));
    router.get('/v1/learning-item/:id', asyncHandler(LearningItemController.getMucHocTapById));
    router.get('/v1/learning-item/lesson/:lessonId', asyncHandler(LearningItemController.getMucHocTapByBuoiHoc));
    router.post('/v1/learning-item', asyncHandler(LearningItemController.postMucHocTap));
    router.put('/v1/learning-item/:id', asyncHandler(LearningItemController.putMucHocTap));
    router.delete('/v1/learning-item/:id', asyncHandler(LearningItemController.deleteMucHocTap));

    // Code routes
    router.get('/v1/code', asyncHandler(CodeController.getAllCode));
    router.get('/v1/code/:code', asyncHandler(CodeController.getCodeByCode));
    router.post('/v1/code', 
        validate(PostCodeRequest), 
        asyncHandler(CodeController.postCode));
    router.put('/v1/code/:code', asyncHandler(CodeController.putCode));

    // Statement routes
    router.get('/v1/statement/question/:questionId', asyncHandler(StatementController.getStatementByQuestionId));
    router.get('/v1/statement/:id', asyncHandler(StatementController.getStatementById));
    router.post('/v1/statement', asyncHandler(StatementController.postStatement));
    router.put('/v1/statement/:id', asyncHandler(StatementController.putStatement));
    router.delete('/v1/statement/:id', asyncHandler(StatementController.deleteStatement));

    app.use('/api/', router);
};
