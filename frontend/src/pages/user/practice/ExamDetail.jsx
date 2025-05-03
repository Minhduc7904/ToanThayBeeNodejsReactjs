import UserLayout from "../../../layouts/UserLayout";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPublicExamById, saveExamForUser, fetchRelatedExamsIfNeeded } from "../../../features/exam/examSlice";
import { fetchCodesByType } from "../../../features/code/codeSlice";
import { useEffect } from "react";
import { ClipboardCopy, Clock, BookOpen, Calendar, Award, ChevronRight, FileText, BarChart2, History, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/loading/LoadingSpinner";
import ExamDefaultImage from "../../../assets/images/defaultExamImage.png";
import RelatedExamCard from "../../../components/card/RelatedExamCard";

const ExamDetail = () => {
    const { examId } = useParams();
    const { exam, exams } = useSelector((state) => state.exams);
    const { codes } = useSelector((state) => state.codes);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const shareLink = `${window.location.origin}/practice/exam/${examId}`;

    const { loading } = useSelector((state) => state.states);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
    };

    const handleSaveExam = () => {
        dispatch(saveExamForUser({ examId }));
    };

    const handleDoExam = () => {
        navigate(`/practice/exam/${examId}/do`);
    };

    const handleClickRanking = () => {
        // Cho phép xem BXH nếu:
        // 1. Đã làm bài và được phép xem đáp án, HOẶC
        // 2. Không cho phép làm bài nữa (hết thời gian)
        if ((exam?.isDone && exam?.seeCorrectAnswer) || (!exam?.acceptDoExam && exam?.seeCorrectAnswer)) {
            navigate(`/practice/exam/${examId}/ranking`);
        }
    }

    const handleClickPreviewExam = () => {
        // Cho phép xem đề thi nếu:
        // 1. Đã làm bài và được phép xem đáp án, HOẶC
        // 2. Không cho phép làm bài nữa (hết thời gian)
        if ((exam?.isDone && exam?.seeCorrectAnswer) || (!exam?.acceptDoExam && exam?.seeCorrectAnswer)) {
            navigate(`/practice/exam/${examId}/preview`);
        }
    };
    const handleClickHistory = () => {

        if (!exam?.isDone || !exam?.seeCorrectAnswer) return
        navigate(`/practice/exam/${examId}/history`)
    };

    useEffect(() => {
        dispatch(fetchPublicExamById(examId));
        dispatch(fetchRelatedExamsIfNeeded(examId));
        dispatch(fetchCodesByType(["chapter", "exam type"]));
    }, [dispatch, examId]);

    return (
        <UserLayout>
            <div className="flex flex-col min-h-[100vh] overflow-y-auto hide-scrollbar items-center bg-[#F6FAFD] px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-6">
                <div className="w-full max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-900 font-bevietnam lg:mb-4 mb-2"  >
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
                        <span className="text-red-500">{exam?.name}</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center bg-white rounded shadow-lg p-3 sm:p-4 lg:p-6 h-screen">
                            <LoadingSpinner color="border-black" size="5rem" />
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-6 pb-16 sm:pb-0">
                            {/* Chi tiết đề thi */}
                            <div className="flex flex-col bg-white rounded shadow-lg lg:w-3/4">
                                {/* Header section with title and status */}
                                <div className="p-3 sm:p-4 lg:p-6 border-b">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 font-inter mb-2">
                                                {exam?.name}
                                            </h1>
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${exam?.isDone ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                        className={`${exam?.isDone ? 'fill-green-600' : 'fill-gray-500'}`}
                                                    >
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12C3 14.3869 3.94821 16.6761 5.63604 18.364C7.32387 20.0518 9.61305 21 12 21ZM11.768 15.64L16.768 9.64L15.232 8.36L10.932 13.519L8.707 11.293L7.293 12.707L10.293 15.707L11.067 16.481L11.768 15.64Z" />
                                                    </svg>
                                                    {exam?.isDone ? "Đã làm" : "Chưa làm"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Primary action button */}
                                        <button
                                            onClick={handleDoExam}
                                            className={`shrink-0 px-2 py-1.5 ${exam?.acceptDoExam ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-400 cursor-default'} text-white text-sm rounded-md  transition flex items-center gap-2 w-full sm:w-auto justify-center`}
                                            title="Làm bài"
                                            disabled={!exam?.acceptDoExam}
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            <span className="font-medium">{exam?.acceptDoExam ? 'Làm bài' : 'Hết thời gian'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Two column layout for content */}
                                <div className="flex flex-col md:flex-row">
                                    {/* Left column - Exam image */}
                                    <div className="md:w-1/2 p-3 sm:p-4 lg:p-6 flex items-center justify-center border-b md:border-b-0 md:border-r">
                                        <div className="w-full flex justify-center overflow-hidden">
                                            {exam?.imageUrl ? (
                                                <img
                                                    src={exam?.imageUrl}
                                                    alt={exam?.name}
                                                    className="rounded-md h-[30rem] w-full object-contain border"
                                                />
                                            ) : (
                                                <div

                                                    className="rounded-md h-[30rem] w-full border bg-gray-100 flex justify-center items-center"
                                                >
                                                    Không có ảnh
                                                </div>
                                            )}


                                        </div>
                                    </div>

                                    {/* Right column - Exam details */}
                                    <div className="md:w-1/2 p-3 sm:p-4 lg:p-6 flex flex-col gap-4">
                                        {/* Metadata grid */}
                                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Thời lượng</p>
                                                    <p className="font-medium">{exam?.testDuration ? exam?.testDuration + "phút" : "Vô thời hạn"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Folder className="w-4 h-4 text-green-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Lớp</p>
                                                    <p className="font-medium">{exam?.class}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-indigo-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Loại đề</p>
                                                    <p className="font-medium">{exam?.typeOfExam ? (codes && codes['exam type']?.find(c => c.code === exam.typeOfExam)?.description || exam.typeOfExam) : "Chưa có"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-orange-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Chương</p>
                                                    <p className="font-medium">{exam?.chapter ? (codes && codes['chapter']?.find(c => c.code === exam.chapter)?.description || exam.chapter) : "Chưa có"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-purple-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Năm</p>
                                                    <p className="font-medium">{exam?.year || "Chưa có"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-yellow-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Tỉ lệ đạt</p>
                                                    <p className="font-medium">{exam?.passRate || 0}%</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <h3 className="font-semibold mb-1">Mô tả</h3>
                                            <p className="text-gray-700">{exam?.description || "Chưa có mô tả cho đề thi này."}</p>
                                        </div>

                                        {/* Solution link */}
                                        {(exam?.solutionUrl && exam?.isDone && exam?.seeCorrectAnswer) && (
                                            <div>
                                                <h3 className="font-semibold mb-1">Lời giải</h3>
                                                <a
                                                    href={exam?.solutionUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Xem lời giải đề thi
                                                </a>
                                            </div>
                                        )}

                                        {/* Action buttons */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <button
                                                onClick={handleClickRanking}
                                                className={`px-2 py-1.5 text-sm ${((exam?.isDone && exam?.seeCorrectAnswer) || (!exam?.acceptDoExam && exam?.seeCorrectAnswer)) ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-400 cursor-default"} text-white rounded transition flex items-center gap-1`}
                                                title="Xem bảng xếp hạng"
                                                disabled={!((exam?.isDone && exam?.seeCorrectAnswer) || (!exam?.acceptDoExam && exam?.seeCorrectAnswer))}
                                            >
                                                <BarChart2 className="w-4 h-4" />
                                                <span>Xem BXH</span>
                                            </button>
                                            <button
                                                onClick={handleClickPreviewExam}
                                                className={`px-2 py-1.5 text-sm ${((exam?.isDone && exam?.seeCorrectAnswer) || (!exam?.acceptDoExam && exam?.seeCorrectAnswer)) ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-400 cursor-default"} text-white rounded transition flex items-center gap-1`}
                                                title="Xem đề thi"
                                                disabled={!((exam?.isDone && exam?.seeCorrectAnswer) || (!exam?.acceptDoExam && exam?.seeCorrectAnswer))}
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span>Xem đề thi</span>
                                            </button>
                                            <button
                                                onClick={handleClickHistory}
                                                className={`px-2 py-1.5 text-sm ${(exam?.isDone && exam?.seeCorrectAnswer) ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-400 cursor-default"} text-white rounded transition flex items-center gap-1`}
                                                title="Lịch sử làm bài"
                                                disabled={!(exam?.isDone && exam?.seeCorrectAnswer)}
                                            >
                                                <History className="w-4 h-4" />
                                                <span>Lịch sử</span>
                                            </button>
                                            <button
                                                onClick={handleSaveExam}
                                                className={`px-2 py-1.5 text-sm ${exam?.isSave ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-400 hover:bg-gray-500'} text-white rounded transition flex items-center gap-1`}
                                                title={exam?.isSave ? "Đã lưu đề thi" : "Lưu đề thi"}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 22" fill="none" className="w-4 h-4">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H14C14.5304 20 15.0391 19.7893 15.4142 19.4142C15.7893 19.0391 16 18.5304 16 18V4.414C15.9999 3.88361 15.7891 3.37499 15.414 3L13 0.586C12.625 0.210901 12.1164 0.000113275 11.586 0H2ZM2 2H11.586L14 4.414V18H2V2ZM12.238 8.793C12.3335 8.70075 12.4097 8.59041 12.4621 8.4684C12.5145 8.3464 12.5421 8.21518 12.5433 8.0824C12.5444 7.94962 12.5191 7.81794 12.4688 7.69505C12.4185 7.57215 12.3443 7.4605 12.2504 7.3666C12.1565 7.27271 12.0449 7.19846 11.922 7.14818C11.7991 7.0979 11.6674 7.0726 11.5346 7.07375C11.4018 7.0749 11.2706 7.10249 11.1486 7.1549C11.0266 7.20731 10.9162 7.28349 10.824 7.379L6.582 11.622L5.167 10.207C4.9784 10.0248 4.7258 9.92405 4.4636 9.92633C4.2014 9.9286 3.95059 10.0338 3.76518 10.2192C3.57977 10.4046 3.4746 10.6554 3.47233 10.9176C3.47005 11.1798 3.57084 11.4324 3.753 11.621L5.803 13.672C5.90515 13.7742 6.02644 13.8553 6.15993 13.9106C6.29342 13.9659 6.4365 13.9944 6.581 13.9944C6.7255 13.9944 6.86858 13.9659 7.00207 13.9106C7.13556 13.8553 7.25685 13.7742 7.359 13.672L12.238 8.793Z" fill="white" />
                                                </svg>
                                                <span>{exam?.isSave ? "Đã lưu" : "Lưu"}</span>
                                            </button>
                                        </div>

                                        {/* Share link */}
                                        <div className="mt-2">
                                            <h3 className="font-semibold mb-1">Chia sẻ</h3>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={shareLink}
                                                    className="w-full px-2 py-1.5 border rounded-md text-sm bg-gray-50 text-gray-700"
                                                />
                                                <button
                                                    onClick={handleCopyLink}
                                                    className="px-2 py-1.5 text-sm bg-slate-700 text-white rounded hover:bg-slate-600 transition flex items-center gap-1 whitespace-nowrap"
                                                    title="Sao chép liên kết"
                                                >
                                                    <ClipboardCopy className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Sao chép</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Đề thi liên quan - Hiển thị bên phải */}
                            {!loading && exams && exams.length > 0 && (
                                <div className="bg-white rounded shadow-lg p-3 sm:p-4 lg:p-6 lg:w-1/4 h-fit sticky top-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-gray-800 font-bevietnam">Đề thi liên quan</h2>
                                        <button
                                            onClick={() => navigate('/practice')}
                                            className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Xem tất cả
                                            <ChevronRight className="w-3 h-3 ml-1" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-200px)]">
                                        {exams.map((relatedExam) => (
                                            <RelatedExamCard
                                                key={relatedExam.id}
                                                exam={relatedExam}
                                                onClick={() => navigate(`/practice/exam/${relatedExam.id}`)}
                                                compact={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    )
}

// Component hiển thị đề thi liên quan


export default ExamDetail;
