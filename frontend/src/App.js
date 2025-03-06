import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import QuestionManagement from "./pages/admin/questionManagement";
import ClassManagement from "./pages/admin/ClassManagement";
import ExamManagement from "./pages/admin/ExamManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Trang công khai */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Trang cần đăng nhập */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* Trang Admin chỉ dành cho người có quyền */}
                <Route element={<ProtectedRoute allowedRoles={["AD"]} />}>
                    <Route path="/admin/question-management" element={<QuestionManagement />} />
                    <Route path="/admin/class-management" element={<ClassManagement />} />
                    <Route path="/admin/exam-management" element={<ExamManagement />} />
                    <Route path="/admin/student-management" element={<StudentManagement />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
