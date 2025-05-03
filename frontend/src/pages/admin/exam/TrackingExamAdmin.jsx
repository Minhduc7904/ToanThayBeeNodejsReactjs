import AdminLayout from "../../../layouts/AdminLayout";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../services/socket";
import { useEffect, useState } from "react";
import { fetchCodesByType } from "../../../features/code/codeSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttemptByExamIdAdmin, setAttempts } from "../../../features/attempt/attemptSlice";
import FilterBarAttemp from "../../../components/bar/FilterBarAttemp";
import ScoreDistributionChart from "../../../components/bar/ScoreDistributionChart";
import "../../../styles/rankAnimation.css";
import { ChevronUp, ChevronDown } from "lucide-react";

const TrackingPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const { codes } = useSelector((state) => state.codes);
    const { attempts } = useSelector((state) => state.attempts);
    const dispatch = useDispatch();
    const [logs, setLogs] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [prevRanks, setPrevRanks] = useState({});
    const [rankChanges, setRankChanges] = useState({});
    const [updatedAttemptId, setUpdatedAttemptId] = useState(null);
    const { search, limit, currentPage, totalItems } = useSelector((state) => state.filter);
    const [attempts1, setAttempts1] = useState([]);

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
        dispatch(fetchCodesByType("cheat type"));
    }, [dispatch]);

    // Hàm tính toán thứ hạng dựa trên điểm và thời gian
    const calculateRanks = (attempts) => {
        if (!Array.isArray(attempts) || attempts.length === 0) return {};

        // Tạo map thứ hạng
        const ranks = {};
        attempts.forEach((attempt, index) => {
            ranks[attempt.id] = index + 1;
        });

        return ranks;
    };

    useEffect(() => {
        dispatch(fetchAttemptByExamIdAdmin({ examId, search, currentPage, limit }));
    }, [dispatch, examId, search, currentPage, limit]);

    useEffect(() => {
        if (attempts) {
            setAttempts1(attempts);
        }
    }, [attempts]);

    useEffect(() => {
        if (!examId) return;
        socket.connect();
        console.log("examId", examId);
        socket.emit("admin_join_exam_tracking", { examId });
    }, [examId]);

    // Khởi tạo prevRanks khi attempts thay đổi
    useEffect(() => {
        if (attempts && attempts.length > 0) {
            // Sắp xếp attempts theo điểm và thời gian
            const sorted = [...attempts].sort((a, b) => {
                if (a.score !== b.score) return b.score - a.score;
                return a.duration?.localeCompare(b.duration || '');
            });

            // Tính toán thứ hạng ban đầu
            const initialRanks = calculateRanks(sorted);
            setPrevRanks(initialRanks);
            console.log('Khởi tạo bảng xếp hạng:', initialRanks);
        }
    }, [attempts]);

    useEffect(() => {
        socket.on("admin_user_log", (logData) => {
            setLogs((prev) => [logData, ...prev]);
        });

        socket.on("admin_student_answer", (answerData) => {
            setAnswers((prev) => [answerData, ...prev]);
        });

        socket.on("admin_score_calculated", (scoreData) => {
            // Lấy danh sách attempts hiện tại từ state
            const currentAttempts = [...attempts1];

            // Kiểm tra xem attempt đã tồn tại trong danh sách chưa
            const existingAttemptIndex = currentAttempts.findIndex(a => a.id === scoreData.attempt.id);

            let updatedAttempts;
            if (existingAttemptIndex !== -1) {
                // Cập nhật attempt đã tồn tại
                updatedAttempts = currentAttempts.map((attempt) =>
                    attempt.id === scoreData.attempt.id
                        ? { ...attempt, ...scoreData.attempt, student: scoreData.student }
                        : attempt
                );
            } else {
                // Thêm attempt mới vào danh sách
                updatedAttempts = [...currentAttempts, { ...scoreData.attempt, student: scoreData.student }];
            }

            // Sắp xếp lại danh sách theo điểm và thời gian
            const sorted = [...updatedAttempts].sort((a, b) => {
                if (a.score !== b.score) return b.score - a.score;
                return a.duration?.localeCompare(b.duration || '');
            });

            // Cập nhật state và Redux store
            setAttempts1(sorted);
            dispatch(setAttempts(sorted));

            // Tìm vị trí và thứ hạng mới của attempt được cập nhật
            const updatedAttemptIndex = sorted.findIndex(a => a.id === scoreData.attempt.id);
            const updatedAttemptRank = updatedAttemptIndex + 1; // Thứ hạng mới (vị trí trong mảng + 1)

            // Tìm thứ hạng cũ của attempt này
            const oldRank = prevRanks[scoreData.attempt.id] || 0;

            console.log('Thứ hạng:', {
                id: scoreData.attempt.id,
                oldRank: oldRank,
                newRank: updatedAttemptRank,
                score: scoreData.attempt.score
            });

            // Xử lý hiệu ứng thay đổi thứ hạng
            const changes = {};

            // Kiểm tra xem attempt này đã có trong prevRanks chưa
            if (oldRank === 0) {
                // Trường hợp attempt mới: không hiển thị hiệu ứng thay đổi thứ hạng
                console.log('Attempt mới, không có thay đổi thứ hạng');
            }
            else if (updatedAttemptRank !== oldRank) {
                // Trường hợp thứ hạng thay đổi
                // Trong bảng xếp hạng, thứ hạng thấp hơn (số nhỏ hơn) là tốt hơn
                // Nếu thứ hạng mới nhỏ hơn thứ hạng cũ => đã tăng hạng (lên)
                const isUp = updatedAttemptRank < oldRank;
                console.log('Thay đổi hạng:', {
                    isUp: isUp,
                    direction: isUp ? 'up' : 'down',
                    difference: Math.abs(updatedAttemptRank - oldRank)
                });

                changes[scoreData.attempt.id] = {
                    direction: isUp ? 'up' : 'down',
                    difference: Math.abs(updatedAttemptRank - oldRank),
                };
            }

            // Tính toán bảng thứ hạng mới và cập nhật ngay lập tức
            const newRanks = calculateRanks(sorted);

            // Cập nhật prevRanks ngay lập tức để các lần cập nhật tiếp theo có oldRank chính xác
            setPrevRanks(newRanks);

            // Hiển thị hiệu ứng thay đổi
            setRankChanges(changes);
            setUpdatedAttemptId(scoreData.attempt.id);

            // Chỉ reset hiệu ứng hiển thị sau 3 giây
            setTimeout(() => {
                setUpdatedAttemptId(null);
                setRankChanges({});
            }, 3000);
        });


        return () => {
            socket.off("admin_user_log");
            socket.off("admin_student_answer");
            socket.off("admin_score_calculated");
        };

    }, [attempts1]);

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
                                        <td className="px-4 py-2 border-b">{codes["cheat type"]?.find((code) => code.code === log.code).description}</td>
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
                                <th className="px-4 py-2 border-b">📊 Thứ hạng</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {Array.isArray(attempts1) && attempts1.length > 0 ? (
                                attempts1.map((attempt) => (
                                    <tr
                                        key={attempt.id}
                                        className={`hover:bg-gray-50 ${updatedAttemptId === attempt?.id ? 'row-updated' : ''}`}
                                    >
                                        <td className="px-4 py-2 border-b font-medium">
                                            {attempt?.student?.lastName} {attempt?.student?.firstName}
                                        </td>
                                        <td className="px-4 py-2 border-b">{attempt?.student?.highSchool || "—"}</td>
                                        <td className="px-4 py-2 border-b">{attempt?.student?.class || "—"}</td>
                                        <td className="px-4 py-2 border-b">
                                            {new Date(attempt?.startTime).toLocaleString("vi-VN")}
                                        </td>
                                        <td className={`px-4 py-2 border-b ${attempt?.endTime ? "text-green-600" : "text-red-600"}`}>
                                            {attempt?.endTime ? new Date(attempt?.endTime).toLocaleString("vi-VN") : 'Chưa nộp'}
                                        </td>
                                        <td className={`px-4 py-2 border-b ${attempt?.endTime ? "text-green-600" : "text-red-600"}`}>
                                            {attempt?.duration ? attempt?.duration : "Chưa nộp"}</td>
                                        <td className="px-4 py-2 border-b">
                                            <span className="font-semibold text-blue-600">{attempt?.score}/10</span>
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            {/* Hiệu ứng leo rank */}
                                            {rankChanges[attempt?.id] ? (
                                                <div className="flex items-center justify-center">
                                                    <span className={`rank-change ${rankChanges[attempt?.id].direction === 'up' ? 'rank-up' : 'rank-down'} flex items-center`}>
                                                        {rankChanges[attempt?.id].direction === 'up' ? (
                                                            <>
                                                                <ChevronUp className="w-5 h-5 rank-icon" />
                                                                <span className="ml-1 font-medium">+{rankChanges[attempt?.id].difference}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-5 h-5 rank-icon" />
                                                                <span className="ml-1 font-medium">-{rankChanges[attempt?.id].difference}</span>
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="text-center text-gray-500">—</div>
                                            )}
                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-6 text-gray-500">
                                        Không có bài làm nào được tìm thấy.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* <ScoreDistributionChart attempts={attempts} /> */}
            </div>
        </AdminLayout>
    )
}

export default TrackingPage;
