import UserLayout from "../../layouts/UserLayout";
import TeacherImage from "../../assets/images/teacherImage.jpg"
import CountDownCard from "../../components/card/countDownCard";
import Footer from "../../components/Footer"
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPublicExamById, saveExamForUser } from "../../features/exam/examSlice";
import { useEffect } from "react";
import { ClipboardCopy } from "lucide-react"; // dùng icon nếu thích
import { useState } from "react";
import PreviewExam from "../../components/detail/PreviewExam";
import { useNavigate } from "react-router-dom";


const ExamDetail = () => {
    const { examId } = useParams();
    const { exam } = useSelector((state) => state.exams);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const shareLink = `${window.location.origin}/exam/${examId}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
    };

    const handleSaveExam = () => {
        dispatch(saveExamForUser({ examId }));
    };

    const handleDoExam = () => {
        navigate(`/practice/exam/${examId}/do`);
    };

    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        dispatch(fetchPublicExamById(examId));
    }, [dispatch, examId]);

    return (
        <UserLayout>
            <div className="flex flex-col h-screen overflow-y-auto items-center bg-[#F7F7F7] px-4 py-6">
                <div className="w-[100vh]">
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
                        <span className="text-red-500">{exam?.name}</span>
                    </div>

                    {/* Card */}
                    <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 gap-4">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-semibold text-zinc-900 font-inter">
                                {exam?.name}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    className={`${exam?.isDone ? 'fill-[#29DA2F]' : 'fill-gray-500'}`}
                                >
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12C3 14.3869 3.94821 16.6761 5.63604 18.364C7.32387 20.0518 9.61305 21 12 21ZM11.768 15.64L16.768 9.64L15.232 8.36L10.932 13.519L8.707 11.293L7.293 12.707L10.293 15.707L11.067 16.481L11.768 15.64Z" />
                                </svg>
                                <p className="text-sm text-center">-</p>
                                <p className="text-sm text-center">{exam?.isDone ? "Đã làm" : "Chưa làm"}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <button
                                    onClick={handleDoExam}
                                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    title="Làm bài"
                                >
                                    Làm bài
                                </button>
                                <button
                                    className={`px-2 py-1 ${exam?.isDone ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 cursor-default"} text-white rounded  transition`}
                                    title="Xem bảng xếp hạng"
                                >
                                    Xem BXH
                                </button>
                                <button
                                    className={`px-2 py-1 ${exam?.isDone ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 cursor-default"} text-white rounded  transition`}
                                    title="Xem đề thi"
                                >
                                    Xem đề thi
                                </button>
                                <button
                                    className={`px-2 py-1 ${exam?.isDone ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 cursor-default"} text-white rounded  transition`}
                                    title="Lịch sử làm bài"
                                >
                                    Lịch sử
                                </button>
                            </div>
                        </div>

                        <div className="w-full flex justify-between items-center">
                            <p><span className="font-semibold">Thời lượng:</span> {exam?.testDuration} phút</p>
                            <p><span className="font-semibold">Lớp:</span> {exam?.class}</p>
                            <p><span className="font-semibold">Năm:</span> {exam?.year}</p>
                            <p><span className="font-semibold">Tỉ lệ đạt:</span> {exam?.passRate}%</p>
                        </div>
                        {exam?.description ? (
                            <p><span className="font-semibold">Mô tả:</span> {exam?.description}</p>
                        ) : (
                            <p><span className="font-semibold">Mô tả:</span> Chưa có</p>
                        )}

                        {exam?.solutionUrl ? (
                            <p>
                                <span className="font-semibold">Lời giải:</span>{" "}
                                <a
                                    href={exam?.solutionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    Xem lời giải
                                </a>
                            </p>
                        ) : (
                            <p><span className="font-semibold">Lời giải:</span> Chưa có</p>
                        )}

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={shareLink}
                                className="w-full px-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-700"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                title="Sao chép liên kết"
                            >
                                <ClipboardCopy size={18} />
                            </button>
                            <button
                                onClick={handleSaveExam}
                                className={`p-2 ${exam?.isSave ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-700'} text-white rounded  transition`}
                                title={exam?.isSave ? "Đã lưu đề thi" : "Lưu đề thi"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 16 22" fill="none"
                                >
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H14C14.5304 20 15.0391 19.7893 15.4142 19.4142C15.7893 19.0391 16 18.5304 16 18V4.414C15.9999 3.88361 15.7891 3.37499 15.414 3L13 0.586C12.625 0.210901 12.1164 0.000113275 11.586 0H2ZM2 2H11.586L14 4.414V18H2V2ZM12.238 8.793C12.3335 8.70075 12.4097 8.59041 12.4621 8.4684C12.5145 8.3464 12.5421 8.21518 12.5433 8.0824C12.5444 7.94962 12.5191 7.81794 12.4688 7.69505C12.4185 7.57215 12.3443 7.4605 12.2504 7.3666C12.1565 7.27271 12.0449 7.19846 11.922 7.14818C11.7991 7.0979 11.6674 7.0726 11.5346 7.07375C11.4018 7.0749 11.2706 7.10249 11.1486 7.1549C11.0266 7.20731 10.9162 7.28349 10.824 7.379L6.582 11.622L5.167 10.207C4.9784 10.0248 4.7258 9.92405 4.4636 9.92633C4.2014 9.9286 3.95059 10.0338 3.76518 10.2192C3.57977 10.4046 3.4746 10.6554 3.47233 10.9176C3.47005 11.1798 3.57084 11.4324 3.753 11.621L5.803 13.672C5.90515 13.7742 6.02644 13.8553 6.15993 13.9106C6.29342 13.9659 6.4365 13.9944 6.581 13.9944C6.7255 13.9944 6.86858 13.9659 7.00207 13.9106C7.13556 13.8553 7.25685 13.7742 7.359 13.672L12.238 8.793Z" fill="white" />
                                </svg>
                            </button>
                        </div>
                        {/* Ảnh đề thi */}
                        {exam?.imageUrl && (
                            <div className="w-full flex justify-center">
                                <img
                                    src={exam?.imageUrl}
                                    alt={exam?.name}
                                    className="rounded-md max-h-[45rem] w-auto object-cover border"
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default ExamDetail;
