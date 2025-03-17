import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import QuestionManagement from "./pages/admin/question/questionManagement";
import ClassManagement from "./pages/admin/ClassManagement";
import ExamManagement from "./pages/admin/exam/ExamManagement";
import StudentManagement from "./pages/admin/user/StudentManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorsDisplay from "./components/error/ErrorsDisplay"; // Đảm bảo file này export ErrorsDisplay
import SuccessDisplay from "./components/error/SuccessDisplay"; // Đảm bảo file này export SuccessDisplay
import QuestionDetailAdmin from "./pages/admin/question/QuestionDetailAdmin";
import ExamDetailAdmin from "./pages/admin/exam/ExamDetailAdmin";
import QuestionOfExamAdmin from "./pages/admin/exam/QuestionOfExamAdmin";
import CodeManagement from "./pages/admin/CodeManagement";
import PreviewExamAdmin from "./pages/admin/exam/PreviewExamAdmin";
import StudentDetailAdmin from "./pages/admin/user/StudentDetailAdmin";

function App() {
    return (
        <BrowserRouter>
            {/* Hiển thị lỗi toàn cục */}
            <ErrorsDisplay />
            <SuccessDisplay />

            <Routes>
                {/* Trang công khai */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Trang cần đăng nhập */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* Trang Admin chỉ dành cho người có quyền */}
                <Route element={<ProtectedRoute allowedRoles={["AD", "AS", "GV"]} />}>
                    <Route path="/admin/question-management" element={<QuestionManagement />} />
                    <Route path="/admin/question-management/:questionId" element={<QuestionDetailAdmin />} />
                    <Route path="/admin/class-management" element={<ClassManagement />} />
                    <Route path="/admin/exam-management" element={<ExamManagement />} />
                    <Route path="/admin/exam-management/:examId" element={<ExamDetailAdmin />} />
                    <Route path="/admin/exam-management/:examId/questions" element={<QuestionOfExamAdmin />} />
                    <Route path="/admin/student-management" element={<StudentManagement />} />
                    <Route path="/admin/code-management" element={<CodeManagement />} />
                    <Route path="/admin/exam-management/:examId/preview" element={<PreviewExamAdmin />} />
                    <Route path="/admin/student-management/:studentId" element={<StudentDetailAdmin />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
