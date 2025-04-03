import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import QuestionManagement from "./pages/admin/question/questionManagement";
import ClassManagement from "./pages/admin/class/ClassManagement";
import ExamManagement from "./pages/admin/exam/ExamManagement";
import StudentManagement from "./pages/admin/user/StudentManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationDisplay from "./components/error/NotificationDisplay"; // Đảm bảo file này export SuccessDisplay
import QuestionDetailAdmin from "./pages/admin/question/QuestionDetailAdmin";
import ExamDetailAdmin from "./pages/admin/exam/ExamDetailAdmin";
import QuestionOfExamAdmin from "./pages/admin/exam/QuestionOfExamAdmin";
import CodeManagement from "./pages/admin/CodeManagement";
import PreviewExamAdmin from "./pages/admin/exam/PreviewExamAdmin";
import StudentDetailAdmin from "./pages/admin/user/StudentDetailAdmin";
import ClassDetailAdmin from "./pages/admin/class/ClassDetailAdmin";
import Home from "./pages/user/Home"
import PracticePage from "./pages/user/PracticePage";
import ExamDetailPage from "./pages/user/ExamDetail";
import DoExamPage from "./pages/user/DoExamPage";
import PreviewExamPage from "./pages/user/PreviewExam";
import RankingPage from "./pages/user/RankingPage";
import HistoryDoExamPage from "./pages/user/HistoryDoExamPage";
import ScorePage from "./pages/user/ScorePage";
import ClassUserPage from "./pages/user/ClassUserPage";
import ClassDetailPage from "./pages/user/ClassDetailPage";
import LearningPage from "./pages/user/LearningPage";
import ClassUserManagement from "./pages/admin/class/ClassUserManagement";
import LessonManagement from "./pages/admin/class/LessonManagement";
import TrackingPage from "./pages/admin/exam/TrackingExamAdmin";

function App() {
    return (
        <BrowserRouter>
            {/* Hiển thị lỗi toàn cục */}
            <NotificationDisplay />

            <Routes>
                {/* Trang công khai */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Trang cần đăng nhập */}
                <Route element={<ProtectedRoute />}>

                    <Route path="/practice" element={<PracticePage />} />
                    <Route path="/practice/exam/:examId" element={<ExamDetailPage />} />
                    <Route path="/practice/exam/:examId/do" element={<DoExamPage />} />
                    <Route path="/practice/exam/:examId/preview" element={<PreviewExamPage />} />
                    <Route path="/practice/exam/:examId/ranking" element={<RankingPage />} />
                    <Route path="/practice/exam/:examId/history" element={<HistoryDoExamPage />} />
                    <Route path="/practice/exam/attempt/:attemptId/score" element={<ScorePage />} />
                    <Route path="/class" element={<ClassUserPage />} />
                    <Route path="/class/:classCode" element={<ClassDetailPage />} />
                    <Route path="/class/:classCode/learning" element={<LearningPage />} />
                </Route>

                {/* Trang Admin chỉ dành cho người có quyền */}
                <Route element={<ProtectedRoute allowedRoles={["AD", "AS", "GV"]} />}>
                    <Route path="/register" element={<RegisterPage />} />


                    <Route path="/admin/question-management" element={<QuestionManagement />} />
                    <Route path="/admin/question-management/:questionId" element={<QuestionDetailAdmin />} />

                    <Route path="/admin/class-management" element={<ClassManagement />} />
                    <Route path="/admin/class-management/:classId" element={<ClassDetailAdmin />} />
                    <Route path="/admin/class-management/:classId/users" element={<ClassUserManagement />} />
                    <Route path="/admin/class-management/:classId/lessons" element={<LessonManagement />} />

                    <Route path="/admin/exam-management" element={<ExamManagement />} />
                    <Route path="/admin/exam-management/:examId" element={<ExamDetailAdmin />} />
                    <Route path="/admin/exam-management/:examId/questions" element={<QuestionOfExamAdmin />} />
                    <Route path="/admin/exam-management/:examId/preview" element={<PreviewExamAdmin />} />
                    <Route path="/admin/exam-management/:examId/tracking" element={<TrackingPage />} />

                    {/* Chỉ dành cho Admin */}

                    <Route path="/admin/student-management" element={<StudentManagement />} />
                    <Route path="/admin/student-management/:studentId" element={<StudentDetailAdmin />} />

                    <Route path="/admin/code-management" element={<CodeManagement />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
