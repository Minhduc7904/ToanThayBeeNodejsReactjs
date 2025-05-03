import UserLayout from "../../../layouts/UserLayout";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAttemptsByExamId } from "../../../features/attempt/attemptSlice";
import { fetchRelatedExamsIfNeeded } from "../../../features/exam/examSlice";
import Pagination from "../../../components/Pagination";
import { setCurrentPage } from "../../../features/filter/filterSlice";
import iconAvatarDefault0 from "../../../assets/icons/student.png";
import iconAvatarDefault1 from "../../../assets/icons/teenager.png";
import iconAvatarDefault2 from "../../../assets/icons/teenager1.png";
import iconAvatarDefault3 from "../../../assets/icons/teenager2.png";
import iconAvatarDefault4 from "../../../assets/icons/teenager3.png";
import iconAvatarDefault5 from "../../../assets/icons/teenager4.png";
import iconAvatarDefault6 from "../../../assets/icons/teenager5.png";
import iconAvatarDefault7 from "../../../assets/icons/teenager6.png";
import LoadingSpinner from "../../../components/loading/LoadingSpinner";
import RelatedExamCard from "../../../components/card/RelatedExamCard";
import { ChevronRight } from "lucide-react";

const RankingPage = () => {
    const { examId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { exam, exams } = useSelector((state) => state.exams);
    const { attempts, userRank, bestAttempt, userAttemptCount } = useSelector((state) => state.attempts);
    const { user } = useSelector((state) => state.auth);
    const { currentPage, totalItems, limit } = useSelector((state) => state.filter);
    const { loading } = useSelector((state) => state.states);


    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    const avatarIcons = [
        iconAvatarDefault0,
        iconAvatarDefault1,
        iconAvatarDefault2,
        iconAvatarDefault3,
        iconAvatarDefault4,
        iconAvatarDefault5,
        iconAvatarDefault6,
        iconAvatarDefault7,
    ];

    const getRandomAvatar = () => {
        const index = Math.floor(Math.random() * avatarIcons.length);
        return avatarIcons[index];
    };

    useEffect(() => {
        dispatch(fetchAttemptsByExamId({ examId, currentPage }));
    }, [dispatch, examId, currentPage]);

    useEffect(() => {
        dispatch(fetchRelatedExamsIfNeeded(examId));
    }, [dispatch, examId])

    return (
        <UserLayout>
            <div className="flex flex-col min-h-[80vh] overflow-y-auto hide-scrollbar items-center bg-[#F6FAFD] px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-6">
                <div className="w-full max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-900 font-bevietnam lg:mb-4 mb-2">
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
                            Bảng xếp hạng
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center bg-white rounded shadow-lg p-3 sm:p-4 lg:p-6 h-screen">
                            <LoadingSpinner color="border-black" size="5rem" />
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Card */}
                            <div className="flex flex-col bg-white rounded shadow-lg p-3 sm:p-4 lg:p-6 gap-2 sm:gap-3 lg:gap-4 lg:w-3/4">
                                <div className="flex justify-center flex-col gap-2 sm:gap-3 lg:gap-4">
                                    <div className="text-2xl font-semibold text-zinc-900 font-inter">
                                        {exam?.name}
                                    </div>
                                    <div className="text-xl font-bold text-blue-700 font-inter text-center uppercase">
                                        Bảng xếp hạng
                                    </div>

                                    {attempts?.length > 0 ? (
                                        <div className="mt-6 overflow-x-auto hide-scrollbar">
                                            <div className="min-w-full inline-block align-middle">
                                                <div className="overflow-hidden border rounded-lg shadow-md">
                                                    <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm font-inter">
                                                        <thead className="bg-zinc-100 sticky top-0 z-10">
                                                            <tr className="text-zinc-700 uppercase tracking-wider">
                                                                <th scope="col" className="px-2 sm:px-4 py-2 text-center w-[8%] sm:w-[5%]">#</th>
                                                                <th scope="col" className="px-2 sm:px-4 py-2 text-left w-[42%] sm:w-[35%]">Học sinh</th>
                                                                <th scope="col" className="hidden sm:table-cell px-2 sm:px-4 py-2 text-left w-[30%]">Trường</th>
                                                                <th scope="col" className="px-2 sm:px-4 py-2 text-center w-[25%] sm:w-[15%]">Điểm</th>
                                                                <th scope="col" className="px-2 sm:px-4 py-2 text-center w-[25%] sm:w-[15%]">Thời gian</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {attempts.map((attempt, index) => {
                                                                const isCurrentUser = attempt.student?.id === user?.id;
                                                                const idx = index + 1 + (currentPage - 1) * limit
                                                                let medal = null;
                                                                if (idx === 1) {
                                                                    medal = (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 24" fill="none" className="flex-shrink-0">
                                                                            <path d="M5.5 20V18H19.5V20H5.5ZM5.5 16.5L4.225 8.475C4.19167 8.475 4.154 8.47934 4.112 8.488C4.07 8.49667 4.03267 8.50067 4 8.5C3.58334 8.5 3.22934 8.354 2.938 8.062C2.64667 7.77 2.50067 7.416 2.5 7C2.49934 6.584 2.64534 6.23 2.938 5.938C3.23067 5.646 3.58467 5.5 4 5.5C4.41534 5.5 4.76967 5.646 5.063 5.938C5.35634 6.23 5.502 6.584 5.5 7C5.5 7.11667 5.48734 7.225 5.462 7.325C5.43667 7.425 5.40767 7.51667 5.375 7.6L8.5 9L11.625 4.725C11.4417 4.59167 11.2917 4.41667 11.175 4.2C11.0583 3.98334 11 3.75 11 3.5C11 3.08334 11.146 2.729 11.438 2.437C11.73 2.145 12.084 1.99934 12.5 2C12.916 2.00067 13.2703 2.14667 13.563 2.438C13.8557 2.72934 14.0013 3.08334 14 3.5C14 3.75 13.9417 3.98334 13.825 4.2C13.7083 4.41667 13.5583 4.59167 13.375 4.725L16.5 9L19.625 7.6C19.5917 7.51667 19.5623 7.425 19.537 7.325C19.5117 7.225 19.4993 7.11667 19.5 7C19.5 6.58334 19.646 6.229 19.938 5.937C20.23 5.645 20.584 5.49934 21 5.5C21.416 5.50067 21.7703 5.64667 22.063 5.938C22.3557 6.22934 22.5013 6.58334 22.5 7C22.4987 7.41667 22.353 7.771 22.063 8.063C21.773 8.355 21.4187 8.50067 21 8.5C20.9667 8.5 20.9293 8.496 20.888 8.488C20.8467 8.48 20.809 8.47567 20.775 8.475L19.5 16.5H5.5Z" fill="#FFD700" />
                                                                        </svg>
                                                                    );
                                                                } else if (idx === 2) {
                                                                    medal = (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 24" fill="none" className="flex-shrink-0">
                                                                            <path d="M12.5 7.00002C14.6217 7.00002 16.6566 7.84288 18.1569 9.34317C19.6571 10.8435 20.5 12.8783 20.5 15C20.5 17.1218 19.6571 19.1566 18.1569 20.6569C16.6566 22.1572 14.6217 23 12.5 23C10.3783 23 8.34344 22.1572 6.84315 20.6569C5.34285 19.1566 4.5 17.1218 4.5 15C4.5 12.8783 5.34285 10.8435 6.84315 9.34317C8.34344 7.84288 10.3783 7.00002 12.5 7.00002ZM12.5 10.5L11.178 13.18L8.22 13.61L10.36 15.695L9.855 18.641L12.5 17.25L15.145 18.64L14.64 15.695L16.78 13.609L13.822 13.179L12.5 10.5ZM13.5 1.99902L18.5 2.00002V5.00002L17.137 6.13802C16.0062 5.54414 14.7712 5.17468 13.5 5.05002V1.99902ZM11.5 1.99902V5.04902C10.2292 5.1738 8.99449 5.54326 7.864 6.13702L6.5 5.00002V2.00002L11.5 1.99902Z" fill="#FFD700" />
                                                                        </svg>
                                                                    );
                                                                } else if (idx === 3) {
                                                                    medal = (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 24" fill="none" className="flex-shrink-0">
                                                                            <path d="M12.5 7.00002C14.6217 7.00002 16.6566 7.84288 18.1569 9.34317C19.6571 10.8435 20.5 12.8783 20.5 15C20.5 17.1218 19.6571 19.1566 18.1569 20.6569C16.6566 22.1572 14.6217 23 12.5 23C10.3783 23 8.34344 22.1572 6.84315 20.6569C5.34285 19.1566 4.5 17.1218 4.5 15C4.5 12.8783 5.34285 10.8435 6.84315 9.34317C8.34344 7.84288 10.3783 7.00002 12.5 7.00002ZM12.5 10.5L11.178 13.18L8.22 13.61L10.36 15.695L9.855 18.641L12.5 17.25L15.145 18.64L14.64 15.695L16.78 13.609L13.822 13.179L12.5 10.5ZM13.5 1.99902L18.5 2.00002V5.00002L17.137 6.13802C16.0062 5.54414 14.7712 5.17468 13.5 5.05002V1.99902ZM11.5 1.99902V5.04902C10.2292 5.1738 8.99449 5.54326 7.864 6.13702L6.5 5.00002V2.00002L11.5 1.99902Z" fill="#C0C0C0" />
                                                                        </svg>
                                                                    );
                                                                } else if (idx === 4) {
                                                                    medal = (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 24" fill="none" className="flex-shrink-0">
                                                                            <path d="M12.5 7.00002C14.6217 7.00002 16.6566 7.84288 18.1569 9.34317C19.6571 10.8435 20.5 12.8783 20.5 15C20.5 17.1218 19.6571 19.1566 18.1569 20.6569C16.6566 22.1572 14.6217 23 12.5 23C10.3783 23 8.34344 22.1572 6.84315 20.6569C5.34285 19.1566 4.5 17.1218 4.5 15C4.5 12.8783 5.34285 10.8435 6.84315 9.34317C8.34344 7.84288 10.3783 7.00002 12.5 7.00002ZM12.5 10.5L11.178 13.18L8.22 13.61L10.36 15.695L9.855 18.641L12.5 17.25L15.145 18.64L14.64 15.695L16.78 13.609L13.822 13.179L12.5 10.5ZM13.5 1.99902L18.5 2.00002V5.00002L17.137 6.13802C16.0062 5.54414 14.7712 5.17468 13.5 5.05002V1.99902ZM11.5 1.99902V5.04902C10.2292 5.1738 8.99449 5.54326 7.864 6.13702L6.5 5.00002V2.00002L11.5 1.99902Z" fill="#CD7F32" />
                                                                        </svg>
                                                                    )
                                                                }
                                                                return (
                                                                    <tr
                                                                        key={attempt.id}
                                                                        className={`transition-all duration-150 ${isCurrentUser
                                                                            ? "bg-yellow-50 font-semibold text-red-700"
                                                                            : "hover:bg-gray-50"
                                                                            }`}
                                                                    >
                                                                        <td className="px-2 sm:px-4 py-2 text-center whitespace-nowrap">
                                                                            <span className="text-xs sm:text-sm font-medium">{idx}</span>
                                                                        </td>
                                                                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                                <img
                                                                                    src={attempt.student?.avatarUrl || getRandomAvatar()}
                                                                                    alt="avatar"
                                                                                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover flex-shrink-0"
                                                                                />
                                                                                <span className="text-xs sm:text-sm font-medium max-w-[100px] sm:max-w-[150px] md:max-w-none">
                                                                                    {attempt.student?.lastName} {attempt.student?.firstName}
                                                                                </span>
                                                                                {medal}
                                                                            </div>
                                                                            {/* Mobile-only school display */}
                                                                            <div className="sm:hidden text-xs text-gray-500 mt-1 truncate max-w-[150px]">
                                                                                {attempt.student?.highSchool || "N/A"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="hidden sm:table-cell px-2 sm:px-4 py-2 whitespace-nowrap">
                                                                            <span className="text-xs sm:text-sm">{attempt.student?.highSchool || "N/A"}</span>
                                                                        </td>
                                                                        <td className="px-2 sm:px-4 py-2 text-center whitespace-nowrap">
                                                                            <span className="text-xs sm:text-sm text-green-700 font-semibold">
                                                                                {attempt.score !== null ? attempt.score : "Chưa có"}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-2 sm:px-4 py-2 text-center whitespace-nowrap">
                                                                            <span className="text-xs sm:text-sm">{attempt.duration}</span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center mt-6 text-zinc-500">Chưa có ai tham gia bài thi này.</div>
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
                                {/* Thông tin lượt làm bài tốt nhất và rank của người dùng */}
                                {user && bestAttempt && userRank && (
                                    <div className="bg-white rounded shadow-lg p-3 sm:p-4 lg:p-6 h-fit">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin của bạn</h2>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Điểm cao nhất:</span>
                                                <span className="font-semibold text-green-600">{bestAttempt.score}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Thời gian:</span>
                                                <span className="font-semibold">{bestAttempt.duration}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Xếp hạng:</span>
                                                <span className="font-semibold text-blue-600">#{userRank}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Số lần làm:</span>
                                                <span className="font-semibold">{userAttemptCount || 1}</span>
                                            </div>
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                <div className="flex gap-2">
                                                    {userAttemptCount < exam.attemptLimit ? (
                                                        <button
                                                            onClick={() => navigate(`/practice/exam/${examId}`)}
                                                            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                                                        >
                                                            Làm lại
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="flex-1 py-2 bg-gray-500 text-white rounded cursor-default transition text-sm font-medium"
                                                        >
                                                            Hết lượt
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => navigate(`/practice/exam/${examId}/preview`)}
                                                        className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm font-medium"
                                                    >
                                                        Xem đề
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                    )}
                </div>
            </div>
        </UserLayout>
    )
}

export default RankingPage;
