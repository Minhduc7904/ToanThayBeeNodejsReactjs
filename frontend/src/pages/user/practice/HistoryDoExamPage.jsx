import UserLayout from "../../../layouts/UserLayout";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAttemptByStudentId, setAttempts } from "../../../features/attempt/attemptSlice";
import { fetchRelatedExamsIfNeeded } from "../../../features/exam/examSlice";
import Pagination from "../../../components/Pagination";
import { setCurrentPage } from "../../../features/filter/filterSlice";
import ScoreBarChart from "../../../components/bar/ScoreBarChart";
import LoadingSpinner from "../../../components/loading/LoadingSpinner";
import RelatedExamCard from "../../../components/card/RelatedExamCard";
import { ChevronRight } from "lucide-react";

const HistoryDoExamPage = () => {
    const { examId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { exam, exams } = useSelector((state) => state.exams);
    const { attempts } = useSelector((state) => state.attempts);
    const { currentPage, limit } = useSelector((state) => state.filter); // hoặc dùng useState nếu không có redux
    const { loading } = useSelector((state) => state.states);

    const totalItems = attempts.length;
    const totalPages = Math.ceil(totalItems / limit);

    const [paginatedAttempts, setPaginatedAttempts] = useState([]);

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };


    useEffect(() => {
        const attemptsFake = attempts?.slice(
            (currentPage - 1) * limit,
            currentPage * limit
        );
        setPaginatedAttempts(attemptsFake);
    }, [attempts, currentPage, limit]);

    useEffect(() => {
        dispatch(fetchAttemptByStudentId({ examId }));
    }, [dispatch, examId]);

    useEffect(() => {
        dispatch(fetchRelatedExamsIfNeeded(examId));
    }, [dispatch, examId]);

    return (
        <UserLayout>
            <div className="flex flex-col items-center bg-[#F6FAFD] px-4 py-6">
                <div className="w-full max-w-7xl mx-auto overflow-y-auto hide-scrollbar">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-900 font-bevietnam mb-4">
                        <span
                            onClick={() => navigate("/")}
                            className="cursor-pointer"
                        >
                            Trang chủ
                        </span>

                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 15 16" fill="none">
                            <path d="M2.36002 0.940682C2.17719 0.84421 1.97253 0.796607 1.76588 0.802488C1.55924 0.808369 1.35762 0.867534 1.18057 0.974249C1.00352 1.08096 0.857033 1.23161 0.75532 1.41158C0.653607 1.59156 0.600113 1.79476 0.600024 2.00148V13.9975C0.60011 14.2054 0.654199 14.4097 0.756991 14.5903C0.859783 14.771 1.00775 14.9219 1.1864 15.0282C1.36505 15.1345 1.56824 15.1926 1.77608 15.1967C1.98392 15.2009 2.18928 15.151 2.37202 15.0519L13.572 8.97188C14.4152 8.51428 14.408 7.30388 13.5616 6.85588L2.36002 0.940682Z" fill="black" />
                        </svg>
                        <span
                            onClick={() => navigate("/practice")}
                            className="cursor-pointer"
                        >
                            Luyện đề
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 15 16" fill="none">
                            <path d="M2.36002 0.940682C2.17719 0.84421 1.97253 0.796607 1.76588 0.802488C1.55924 0.808369 1.35762 0.867534 1.18057 0.974249C1.00352 1.08096 0.857033 1.23161 0.75532 1.41158C0.653607 1.59156 0.600113 1.79476 0.600024 2.00148V13.9975C0.60011 14.2054 0.654199 14.4097 0.756991 14.5903C0.859783 14.771 1.00775 14.9219 1.1864 15.0282C1.36505 15.1345 1.56824 15.1926 1.77608 15.1967C1.98392 15.2009 2.18928 15.151 2.37202 15.0519L13.572 8.97188C14.4152 8.51428 14.408 7.30388 13.5616 6.85588L2.36002 0.940682Z" fill="black" />
                        </svg>
                        <span
                            onClick={() => navigate("/practice/exam/" + examId)}
                            className="cursor-pointer"
                        >
                            {exam?.name}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 15 16" fill="none">
                            <path d="M2.36002 0.940682C2.17719 0.84421 1.97253 0.796607 1.76588 0.802488C1.55924 0.808369 1.35762 0.867534 1.18057 0.974249C1.00352 1.08096 0.857033 1.23161 0.75532 1.41158C0.653607 1.59156 0.600113 1.79476 0.600024 2.00148V13.9975C0.60011 14.2054 0.654199 14.4097 0.756991 14.5903C0.859783 14.771 1.00775 14.9219 1.1864 15.0282C1.36505 15.1345 1.56824 15.1926 1.77608 15.1967C1.98392 15.2009 2.18928 15.151 2.37202 15.0519L13.572 8.97188C14.4152 8.51428 14.408 7.30388 13.5616 6.85588L2.36002 0.940682Z" fill="black" />
                        </svg>
                        <span
                            className="cursor-pointer text-red-500"
                        >
                            Lịch sử làm bài
                        </span>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-col h-[80vh] lg:flex-row gap-6">
                        {/* Card */}
                        <div className="flex flex-col bg-white rounded-lg shadow-lg p-3 sm:p-4 lg:p-6 gap-2 sm:gap-3 lg:gap-4 lg:w-3/4">
                            <div className="flex justify-center flex-col gap-4">
                            <div className="text-2xl font-semibold text-zinc-900 font-inter">
                                {exam?.name}
                            </div>
                            <div className="text-xl font-bold text-blue-700 font-inter text-center uppercase">
                                lịch sử làm bài
                            </div>
                            {loading && (
                                <div className="flex items-center justify-center h-screen">
                                    <LoadingSpinner color="border-black" size="5rem" />
                                </div>
                            )}


                            {paginatedAttempts?.length > 0 ? (
                                <>
                                    <div className="mt-4 overflow-y-auto hide-scrollbar">
                                        <table className="min-w-full border-collapse text-sm font-inter shadow-md rounded-lg overflow-hidden">
                                            <thead className="bg-zinc-100 sticky top-0 z-10">
                                                <tr className="text-zinc-700 uppercase text-xs tracking-wider">
                                                    <th className="px-4 py-2 border">#</th>
                                                    <th className="px-4 py-2 border">Điểm</th>
                                                    <th className="px-4 py-2 border">Thời gian làm</th>
                                                    <th className="px-4 py-2 border">Thời gian nộp</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedAttempts.map((attempt, index) => {
                                                    const idx = index + 1 + (currentPage - 1) * limit;
                                                    return (
                                                        <tr
                                                            onClick={() => navigate(`/practice/exam/attempt/${attempt.id}/score`)}
                                                            key={attempt.id} className="hover:bg-gray-50 cursor-pointer transition-all duration-150 text-center">
                                                            <td className="px-4 py-2 border">{idx}</td>
                                                            <td className="px-4 py-2 border text-green-700 font-semibold">
                                                                {attempt.score !== null ? attempt.score : "Chưa có"}
                                                            </td>
                                                            <td className="px-4 py-2 border">
                                                                {attempt.duration || "N/A"}
                                                            </td>
                                                            <td className="px-4 py-2 border">
                                                                {attempt.endTime
                                                                    ? new Date(attempt.endTime).toLocaleString("vi-VN")
                                                                    : "Chưa nộp"}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center mt-6 text-zinc-500">Bạn chưa có lịch sử làm bài nào.</div>
                            )}
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                limit={limit}
                                onPageChange={handlePageChange}
                            />
                            </div>
                        </div>

                        <div className="lg:w-1/4 flex flex-col gap-4">
                            {/* Biểu đồ điểm */}
                            {/* Đề thi liên quan */}
                            {!loading && exams && exams.length > 0 && (
                            <div className="bg-white rounded shadow-lg p-3 sm:p-4 lg:p-6 h-fit sticky top-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Đề thi liên quan</h2>
                                    <button
                                        onClick={() => navigate('/practice')}
                                        className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Xem tất cả
                                        <ChevronRight className="w-3 h-3 ml-1" />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {exams.map((relatedExam) => (
                                        <RelatedExamCard
                                            key={relatedExam.id}
                                            exam={relatedExam}
                                            onClick={() => navigate(`/practice/exam/${relatedExam.id}`)}
                                            compact={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default HistoryDoExamPage;
