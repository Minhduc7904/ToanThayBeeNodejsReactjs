import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import QuestionManagement from './pages/admin/questionManagement';
import ClassManagement from './pages/admin/ClassManagement';
import ExamManagement from './pages/admin/ExamManagement';
import StudentManagement from './pages/admin/StudentManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/question-management" element={<QuestionManagement />} />
        <Route path="/admin/class-management" element={<ClassManagement />} />
        <Route path="/admin/exam-management" element={<ExamManagement />} />
        <Route path="/admin/student-management" element={<StudentManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
