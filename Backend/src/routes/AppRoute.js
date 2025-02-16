import express from 'express';
import * as Controllers from '../controllers/Controller.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import PostCodeRequest from "../dtos/requests/PostCodeRequest";

const router = express.Router();

export const AppRoute = (app) => {
    // Exam routes
    router.get('/v1/exam', asyncHandler(Controllers.ExamController.getExam));
    router.get('/v1/exam/:id', asyncHandler(Controllers.ExamController.getExamById));
    router.post('/v1/exam', asyncHandler(Controllers.ExamController.postExam));
    router.put('/v1/exam/:id', asyncHandler(Controllers.ExamController.putExam));
    router.delete('/v1/exam/:id', asyncHandler(Controllers.ExamController.deleteExam));

    // Question routes
    router.get('/v1/question', asyncHandler(Controllers.QuestionController.getQuestion));
    router.get('/v1/question/:id', asyncHandler(Controllers.QuestionController.getQuestionById));
    router.get('/v1/question/exam/:examId', asyncHandler(Controllers.QuestionController.getQuestionByExamId));
    router.post('/v1/question', asyncHandler(Controllers.QuestionController.postQuestion));
    router.put('/v1/question/:id', asyncHandler(Controllers.QuestionController.putQuestion));
    router.delete('/v1/question/:id', asyncHandler(Controllers.QuestionController.deleteQuestion));

    // Class routes
    router.get('/v1/class', asyncHandler(Controllers.ClassController.getClass));
    router.get('/v1/class/:id', asyncHandler(Controllers.ClassController.getClassById));
    router.post('/v1/class', asyncHandler(Controllers.ClassController.postClass));
    router.put('/v1/class/:id', asyncHandler(Controllers.ClassController.putClass));
    router.delete('/v1/class/:id', asyncHandler(Controllers.ClassController.deleteClass));

    // AssistantReport routes
    router.get('/v1/assistant-report', asyncHandler(Controllers.AssistantReportController.getBaoCaoND));
    router.get('/v1/assistant-report/:id', asyncHandler(Controllers.AssistantReportController.getBaoCaoNDById));
    router.post('/v1/assistant-report', asyncHandler(Controllers.AssistantReportController.postBaoCaoND));
    router.delete('/v1/assistant-report/:id', asyncHandler(Controllers.AssistantReportController.deleteBaoCaoND));

    // QuestionReport routes
    router.get('/v1/question-report', asyncHandler(Controllers.QuestionReportController.getBaoCaoCH));
    router.get('/v1/question-report/:id', asyncHandler(Controllers.QuestionReportController.getBaoCaoCHById));
    router.post('/v1/question-report', asyncHandler(Controllers.QuestionReportController.postBaoCaoCH));
    router.delete('/v1/question-report/:id', asyncHandler(Controllers.QuestionReportController.deleteBaoCaoCH));

    // Lesson routes
    router.get('/v1/lesson', asyncHandler(Controllers.LessonController.getBuoiHoc));
    router.get('/v1/lesson/:id', asyncHandler(Controllers.LessonController.getBuoiHocById));
    router.get('/v1/lesson/class/:classId', asyncHandler(Controllers.LessonController.getBuoiHocByClassId));
    router.post('/v1/lesson', asyncHandler(Controllers.LessonController.postBuoiHoc));
    router.put('/v1/lesson/:id', asyncHandler(Controllers.LessonController.putBuoiHoc));
    router.delete('/v1/lesson/:id', asyncHandler(Controllers.LessonController.deleteBuoiHoc));

    // Attempt routes
    router.get('/v1/attempt', asyncHandler(Controllers.AttemptController.getLuotLamBai));
    router.get('/v1/attempt/:id', asyncHandler(Controllers.AttemptController.getLuotLamBaiById));
    router.get('/v1/attempt/exam/:examId', asyncHandler(Controllers.AttemptController.getLuotLamBaiByDeId));
    router.post('/v1/attempt', asyncHandler(Controllers.AttemptController.postLuotLamBai));
    router.put('/v1/attempt/:id', asyncHandler(Controllers.AttemptController.putLuotLamBai));
    router.delete('/v1/attempt/:id', asyncHandler(Controllers.AttemptController.deleteLuotLamBai));

    // Answer routes
    router.get('/v1/answer/:id', asyncHandler(Controllers.AnswerController.getCauTraLoiById));
    router.get('/v1/answer/attempt/:attemptId', asyncHandler(Controllers.AnswerController.getCauTraLoiByLuotLamBai));
    router.post('/v1/answer', asyncHandler(Controllers.AnswerController.postCauTraLoi));
    router.put('/v1/answer/:id', asyncHandler(Controllers.AnswerController.putCauTraLoi));
    router.delete('/v1/answer/:id', asyncHandler(Controllers.AnswerController.deleteCauTraLoi));

    // Cheat routes
    router.get('/v1/cheat', asyncHandler(Controllers.CheatController.getLoi));
    router.get('/v1/cheat/attempt/:attemptId', asyncHandler(Controllers.CheatController.getLoiByLuotLamBai));
    router.post('/v1/cheat', asyncHandler(Controllers.CheatController.postLoi));
    router.delete('/v1/cheat/:id', asyncHandler(Controllers.CheatController.deleteLoi));

    // LearningItem routes
    router.get('/v1/learning-item', asyncHandler(Controllers.LearningItemController.getMucHocTap));
    router.get('/v1/learning-item/:id', asyncHandler(Controllers.LearningItemController.getMucHocTapById));
    router.get('/v1/learning-item/lesson/:lessonId', asyncHandler(Controllers.LearningItemController.getMucHocTapByBuoiHoc));
    router.post('/v1/learning-item', asyncHandler(Controllers.LearningItemController.postMucHocTap));
    router.put('/v1/learning-item/:id', asyncHandler(Controllers.LearningItemController.putMucHocTap));
    router.delete('/v1/learning-item/:id', asyncHandler(Controllers.LearningItemController.deleteMucHocTap));

    // Code routes
    router.get('/v1/code', asyncHandler(Controllers.CodeController.getAllCode));
    router.get('/v1/code/:code', asyncHandler(Controllers.CodeController.getCodeByCode));
    router.post('/v1/code', 
        validate(PostCodeRequest), 
        asyncHandler(Controllers.CodeController.postCode));
    router.put('/v1/code/:code', asyncHandler(Controllers.CodeController.putCode));

    // Statement routes
    router.get('/v1/statement/question/:questionId', asyncHandler(Controllers.StatementController.getStatementByQuestionId));
    router.get('/v1/statement/:id', asyncHandler(Controllers.StatementController.getStatementById));
    router.post('/v1/statement', asyncHandler(Controllers.StatementController.postStatement));
    router.put('/v1/statement/:id', asyncHandler(Controllers.StatementController.putStatement));
    router.delete('/v1/statement/:id', asyncHandler(Controllers.StatementController.deleteStatement));

    app.use('/api/', router);
};
