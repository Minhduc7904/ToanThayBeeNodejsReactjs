import AdminLayout from "../../../layouts/AdminLayout";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../services/socket";
import { use, useEffect, useState } from "react";
import { fetchCodesByType } from "../../../features/code/codeSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttemptByExamIdAdmin } from "../../../features/attempt/attemptSlice";
import FilterBarAttemp from "../../../components/bar/FilterBarAttemp";
import ScoreDistributionChart from "../../../components/bar/ScoreDistributionChart";

const TrackingPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const { codes } = useSelector((state) => state.codes);
    const { attempts } = useSelector((state) => state.attempts);
    const dispatch = useDispatch();
    const [logs, setLogs] = useState([]);
    const [answers, setAnswers] = useState([]);
    const { search, limit, currentPage, totalItems } = useSelector((state) => state.filter);

    const handleClickedDetail = () => {
        navigate(`/admin/exam-management/${examId}`);
    }
    const handleClickedPreviewExam = () => {
        navigate(`/admin/exam-management/${examId}/preview`);
    }

    const handleClickedQuestions = () => {
        navigate(`/admin/exam-management/${examId}/questions`);
    }

    useEffect(() => {
        dispatch(fetchCodesByType("logType"));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchAttemptByExamIdAdmin({ examId, search, currentPage, limit }));
    }, [dispatch, examId, search, currentPage, limit]);

    useEffect(() => {
        if (!examId) return;
        socket.connect();
        console.log("examId", examId);
        socket.emit("admin_join_exam_tracking", { examId });
    }, [examId]);

    useEffect(() => {
        socket.on("admin_user_log", (logData) => {
            setLogs((prev) => [logData, ...prev]);
        });

        socket.on("admin_student_answer", (answerData) => {
            console.log("answerData", answerData);
            setAnswers((prev) => [answerData, ...prev]);
        });

        return () => {
            socket.off("admin_user_log");
            socket.off("admin_student_answer");
        };

    }, []);

    return (
        <AdminLayout>
            <div className="flex flex-col gap-4 h-full w-full">
                <div className="flex gap-2 items-center border-b border-[#E7E7ED]">
                    <button onClick={() => navigate('/admin/exam-management')} className="flex items-center justify-center w-10 h-10 hover:bg-[#F6FAFD] rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M12.6667 8.66675L5.50292 15.8289C5.38989 15.94 5.33337 16.0856 5.33337 16.2312M12.6667 23.3334L5.50292 16.6335C5.38989 16.5224 5.33337 16.3768 5.33337 16.2312M5.33337 16.2312H26.6667" stroke="#131214" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose">Chi tiết đề thi - {examId}</div>
                </div>
                <div className="flex gap-2 items-center border-b border-[#E7E7ED]">
                    <div
                        onClick={handleClickedDetail}
                        className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose cursor-pointer`}>
                        Chi tiết
                    </div>
                    <div
                        className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                        -
                    </div>
                    <div
                        onClick={handleClickedQuestions}
                        className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose cursor-pointer`}>
                        Danh sách câu hỏi
                    </div>
                    <div
                        className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                        -
                    </div>
                    <div
                        onClick={handleClickedPreviewExam}
                        className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose cursor-pointer`}>
                        Xem đề thi
                    </div>
                    <div
                        className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                        -
                    </div>
                    <div
                        className={`relative justify-center text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-gray-500 underline`}>
                        Theo dõi
                    </div>
                </div>
            </div>
            {/* Logs Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 w-full">
                {/* Bảng log theo dõi */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                    <div className="bg-yellow-100 px-4 py-3 border-b border-gray-300 font-semibold text-yellow-800 text-lg">
                        📋 Theo dõi hành vi người dùng
                    </div>
                    <div className="overflow-x-auto max-h-[400px]">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-4 py-2 border-b">🧑 Học sinh</th>
                                    <th className="px-4 py-2 border-b">⏰ Thời gian</th>
                                    <th className="px-4 py-2 border-b">🔍 Hành động</th>
                                    <th className="px-4 py-2 border-b">📄 Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {logs.map((log, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-2 border-b">{log.name || "Chưa rõ"}</td>
                                        <td className="px-4 py-2 border-b">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                        <td className="px-4 py-2 border-b text-red-600">{log.action}</td>
                                        <td className="px-4 py-2 border-b">{codes["logType"]?.find((code) => code.code === log.code).description}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* Bảng câu trả lời */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                    <div className="bg-blue-100 px-4 py-3 border-b border-gray-300 font-semibold text-blue-800 text-lg">
                        📝 Câu trả lời của học sinh
                    </div>
                    <div className="overflow-x-auto max-h-[400px]">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-4 py-2 border-b">🧑 Học sinh</th>
                                    <th className="px-4 py-2 border-b">📌 Câu hỏi</th>
                                    <th className="px-4 py-2 border-b">💬 Đáp án</th>
                                    <th className="px-4 py-2 border-b">✅ Kết quả</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {answers.map((ans, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-2 border-b">{ans.name || "Chưa rõ"}</td>
                                        <td className="px-4 py-2 border-b">{`Câu ${ans.questionId}`}</td>
                                        <td className="px-4 py-2 border-b">{ans.answerContent}</td>
                                        <td className={`px-4 py-2 border-b ${ans.isCorrect ? "text-green-600" : "text-red-600"}`}>
                                            {ans.isCorrect ? "Đúng" : "Sai"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                </div>


            </div>
            <FilterBarAttemp examId={examId} />
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">

                <div className="overflow-x-auto max-h-[500px]">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border-b">🧑 Học sinh</th>
                                <th className="px-4 py-2 border-b">🏫 Trường</th>
                                <th className="px-4 py-2 border-b">📚 Lớp</th>
                                <th className="px-4 py-2 border-b">🕒 Bắt đầu</th>
                                <th className="px-4 py-2 border-b">🏁 Kết thúc</th>
                                <th className="px-4 py-2 border-b">⏱️ Thời gian</th>
                                <th className="px-4 py-2 border-b">🎯 Điểm</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {attempts?.map((attempt, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b font-medium">
                                        {attempt?.student?.lastName} {attempt?.student?.firstName}
                                    </td>
                                    <td className="px-4 py-2 border-b">{attempt?.student?.highSchool || "—"}</td>
                                    <td className="px-4 py-2 border-b">{attempt?.student?.class || "—"}</td>
                                    <td className="px-4 py-2 border-b">
                                        {new Date(attempt?.startTime).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {new Date(attempt?.endTime).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-4 py-2 border-b">{attempt?.duration}</td>
                                    <td className="px-4 py-2 border-b font-semibold text-blue-600">
                                        {attempt?.score}/10
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* <ScoreDistributionChart attempts={attempts} /> */}
            </div>
        </AdminLayout>
    )
}

export default TrackingPage;
