import ExamDefaultImage from "../../assets/images/defaultExamImage.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveExamForUser } from "../../features/exam/examSlice";

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const ExamCard = ({ exam, codes }) => {
    const { name, typeOfExam, class: examClass, chapter, testDuration, createdAt, imageUrl, id, isSave, isDone } = exam;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClicked = () => navigate(`/practice/exam/${id}`);
    const handleSaveExam = (e) => {
        e.stopPropagation();
        dispatch(saveExamForUser({ examId: id }));
    };

    return (
        <div
            className="bg-white rounded shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200 cursor-pointer flex flex-col h-full"
            onClick={handleClicked}
        >
            <div className="p-3 sm:p-4 flex-1 flex flex-col">
                {/* Header with icon */}
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <p
                                title={name}
                                className="text-sm font-semibold font-bevietnam text-black flex-1"
                            >
                                {name?.length > 30 ? name?.slice(0, 30) + "..." : name}
                            </p>
                            <p className="text-xs font-medium text-gray-800">
                                {codes && codes['exam type']?.find(c => c.code === typeOfExam)?.description || typeOfExam || ''}
                            </p>
                        </div>
                        <div className="items-center sm:flex hidden gap-2">
                            <button
                                onClick={handleSaveExam}
                                className="text-sm text-blue-600 hover:text-blue-700 hover:bg-slate-100 p-1 rounded flex items-center gap-1"
                                title={isSave ? "Đã lưu đề thi" : "Lưu đề thi"}
                            >
                                {isSave ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 fill-blue-600">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                )}
                            </button>
                            <div className={`p-2 rounded-full ${isDone ? 'bg-green-50' : 'bg-cyan-50'}`}>
                                {isDone ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-700">
                                        <path d="M12 8v4l3 3"></path>
                                        <circle cx="12" cy="12" r="10"></circle>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="items-center sm:hidden flex gap-2">
                        <button
                            onClick={handleSaveExam}
                            className="text-sm text-blue-600 hover:text-blue-700 hover:bg-slate-100 p-1 rounded flex items-center gap-1"
                            title={isSave ? "Đã lưu đề thi" : "Lưu đề thi"}
                        >
                            {isSave ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 fill-blue-600">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            )}
                        </button>
                        <div className={`p-2 rounded-full ${isDone ? 'bg-green-50' : 'bg-cyan-50'}`}>
                            {isDone ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-700">
                                    <path d="M12 8v4l3 3"></path>
                                    <circle cx="12" cy="12" r="10"></circle>
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gray-100"></div>

                    {/* Exam details */}

                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 gap-x-2 gap-y-1">
                        {/* Item 1 */}
                        <div className="flex items-center shrink-0">
                            <svg className="md:mr-2 mr-[0.1rem] text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                            </svg>
                            <span>Lớp: <span className="font-medium text-gray-800">{examClass}</span></span>
                        </div>

                        {/* Separator */}
                        <span className="text-gray-300">|</span>

                        {/* Item 2 */}
                        <div className="flex items-center shrink-0">
                            <svg className="md:mr-2 mr-[0.1rem] text-gray-400 min-w-[16px]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            <span>Chương: <span className="font-medium text-gray-800">{chapter ? codes['chapter']?.find(c => c.code === chapter)?.description || chapter : 'Không có'}</span></span>
                        </div>

                        {/* Separator */}
                        <span className="text-gray-300">|</span>

                        {/* Item 3 */}
                        
                        <div className="flex items-center shrink-0">
                            <svg className="md:mr-2 mr-[0.1rem] text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Thời gian: <span className="font-medium text-gray-800">{testDuration ? testDuration + ' phút' : 'Không có'}</span></span>
                        </div>

                        {/* Separator */}
                        <span className="text-gray-300">|</span>

                        {/* Item 4 */}
                        <div className="flex items-center shrink-0">
                            <svg className="md:mr-2 mr-[0.1rem] text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>Ngày đăng: <span className="font-medium text-gray-800">{formatDate(createdAt)}</span></span>
                        </div>
                    </div>
                </div>


                {/* Action button */}
                <div className="mt-3">
                    <button
                        className={`w-full ${isDone ? 'bg-green-600 hover:bg-green-700' : 'bg-cyan-600 hover:bg-cyan-700'} text-white py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-colors testDuration-200 flex items-center justify-center`}
                        onClick={handleClicked}
                    >
                        <span>{isDone ? 'Xem lại bài làm' : 'Bắt đầu làm bài'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamCard;
