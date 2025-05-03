

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const RelatedExamCard = ({ exam, onClick, compact = false, codes }) => {
    const { name, typeOfExam, class: examClass, chapter, testDuration, createdAt, isDone } = exam;

    // Phiên bản đầy đủ với style giống ExamCard
    return (
        <div
            onClick={onClick}
            className="bg-white rounded transition overflow-hidden border border-gray-200 cursor-pointer flex flex-col h-full"
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

                        {/* Separator */}

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

                {/* Footer with status */}
               
            </div>
        </div>
    );
}

export default RelatedExamCard;