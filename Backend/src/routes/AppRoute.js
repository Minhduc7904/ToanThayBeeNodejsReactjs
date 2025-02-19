import express from 'express';
import UserRoutes from './UserRoutes.js';
import ImageRoutes from './ImageRoutes.js';
import ExamRoutes from './ExamRoutes.js';
import QuestionRoutes from './QuestionRoutes.js';
import ClassRoutes from './ClassRoutes.js';
import AssistantReportRoutes from './AssistantReportRoutes.js';
import QuestionReportRoutes from './QuestionReportRoutes.js';
import LessonRoutes from './LessonRoutes.js';
import AttemptRoutes from './AttemptRoutes.js';
import AnswerRoutes from './AnswerRoutes.js';
import CheatRoutes from './CheatRoutes.js';
import LearningItemRoutes from './LearningItemRoutes.js';
import CodeRouters from './CodeRoutes.js';
import StatementRoutes from './StatementRoutes.js';
import SlideRoutes from './SlideRoutes.js';

const router = express.Router();

export const AppRoute = (app) => {
    // User routes
    app.use('/api/', UserRoutes);

    // Image upload route
    app.use('/api/', ImageRoutes);

    // Exam routes
    app.use('/api/', ExamRoutes);

    // Question routes
    app.use('/api/', QuestionRoutes);

    // Class routes
    app.use('/api/', ClassRoutes);
    
    // AssistantReport routes
    app.use('/api/', AssistantReportRoutes);

    // QuestionReport routes
    app.use('/api/', QuestionReportRoutes);

    // Lesson routes
    app.use('/api/', LessonRoutes);

    // Attempt routes
    app.use('/api/', AttemptRoutes);

    // Answer routes
    app.use('/api/', AnswerRoutes);
    
    // Cheat routes
    app.use('/api/', CheatRoutes);
    
    // LearningItem routes
    app.use('/api/', LearningItemRoutes);

    // Code routes
    app.use('/api/', CodeRouters);

    // Statement routes
    app.use('/api/', StatementRoutes);
    
    // Slide routes
    app.use('/api/', SlideRoutes);
};
