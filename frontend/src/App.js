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

function App() {
    return (
        <BrowserRouter>
            {/* Hiển thị lỗi toàn cục */}
            <NotificationDisplay />

            <Routes>
                {/* Trang công khai */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Trang cần đăng nhập */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/practice" element={<PracticePage />} />
                    <Route path="/practice/exam/:examId" element={<ExamDetailPage />} />
                    <Route path="/practice/exam/:examId/do" element={<DoExamPage />} />
                </Route>

                {/* Trang Admin chỉ dành cho người có quyền */}
                <Route element={<ProtectedRoute allowedRoles={["AD", "AS", "GV"]} />}>
                    <Route path="/admin/question-management" element={<QuestionManagement />} />
                    <Route path="/admin/question-management/:questionId" element={<QuestionDetailAdmin />} />

                    <Route path="/admin/class-management" element={<ClassManagement />} />
                    <Route path="/admin/class-management/:classId" element={<ClassDetailAdmin />} />

                    <Route path="/admin/exam-management" element={<ExamManagement />} />
                    <Route path="/admin/exam-management/:examId" element={<ExamDetailAdmin />} />
                    <Route path="/admin/exam-management/:examId/questions" element={<QuestionOfExamAdmin />} />
                    <Route path="/admin/exam-management/:examId/preview" element={<PreviewExamAdmin />} />

                    <Route path="/admin/student-management" element={<StudentManagement />} />
                    <Route path="/admin/student-management/:studentId" element={<StudentDetailAdmin />} />

                    <Route path="/admin/code-management" element={<CodeManagement />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
