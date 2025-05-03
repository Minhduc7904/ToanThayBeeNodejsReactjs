import YouTubePlayer from "./YouTubePlayer";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicExamById } from "../features/exam/examSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PdfViewer from "./ViewPdf";

const ViewLearning = ({ activeItem }) => {
    const { exam } = useSelector((state) => state.exams);
    const { codes } = useSelector((state) => state.codes);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let countDone = 0
    if (
        activeItem?.type === 'lesson' &&
        Array.isArray(activeItem?.item?.learningItems) &&
        activeItem.item.learningItems.length > 0
    ) {
        activeItem?.item?.learningItems?.forEach((item) => {
            if (item?.studyStatuses?.length === 0 || !item?.studyStatuses) return
            countDone = item?.studyStatuses[0]?.isDone ? countDone + 1 : countDone
        })
    }


    useEffect(() => {
        if (activeItem?.type === 'learningItem' && activeItem?.item?.typeOfLearningItem === 'BTVN') {
            dispatch(fetchPublicExamById(activeItem?.item?.url));
        }
    }, [dispatch, activeItem]);

    const handleClicked = () => {
        if (exam?.isDone) {
            window.open(`/practice/exam/${exam?.id}/history`, '_blank')
        } else {
            navigate(`/practice/exam/${exam?.id}/do`);
        }
    }

    return (
        <div className="w-full h-full bg-[#F6FAFD] flex justify-center items-start ">

            <div className="w-full max-w-5xl bg-white rounded-md shadow-md p-4 sm:p-6 md:p-8 flex flex-col gap-4">
                {activeItem?.item === null && (
                    <div className="text-start text-zinc-600 text-base sm:text-lg leading-relaxed">
                        <p className="font-semibold text-xl text-sky-600 mb-4">📘 Hướng dẫn học online</p>
                        <p>👉 Chọn một bài học hoặc mục học tập từ menu bên trái để bắt đầu.</p>
                        <p>📌 Các mục có thể bao gồm video, tài liệu PDF hoặc bài tập về nhà.</p>

                        <div className="mt-6 text-sm text-gray-700 border-t pt-4">
                            <p className="font-medium text-zinc-800">✅ Ghi chú:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>
                                    Sau khi hoàn thành một mục học tập, bạn hãy bấm <strong>"Đánh dấu đã học"</strong> để hệ thống lưu lại tiến độ.
                                </li>
                                <li>
                                    <span className="inline-flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                                        : đã học
                                    </span>
                                </li>
                                <li>
                                    <span className="inline-flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                                        : chưa học
                                    </span>
                                </li>
                            </ul>
                            <p className="mt-4 italic text-gray-500">Chúc bạn học tập hiệu quả cùng Toán thầy Bee 🐝</p>
                        </div>
                    </div>
                )}

                {activeItem?.type === 'learningItem' && (
                    <>
                        <p className="text-center text-zinc-900 text-2xl font-semibold font-['Be_Vietnam_Pro'] mb-4">
                            {activeItem?.item?.name}

                        </p>
                        {(activeItem?.item?.typeOfLearningItem === 'VID' && activeItem?.item?.url) && (
                            <YouTubePlayer url={activeItem?.item?.url} />
                        )}
                        {(activeItem?.item?.typeOfLearningItem === 'BTVN' && activeItem?.item?.url) && (
                            <>
                                <div className="w-full flex flex-col gap-2 mt-6 px-0 sm:px-6">
                                    {[
                                        { label: "Ngày đăng", value: new Date(activeItem?.item?.createdAt).toLocaleDateString() },
                                        { label: "Hạn chót", value: activeItem?.item?.deadline ? new Date(activeItem?.item?.deadline).toLocaleDateString() : "Vô thời hạn" },
                                        { label: "Trạng thái", value: exam?.isDone ? "Đã hoàn thành" : "Chưa hoàn thành" },
                                        { label: "Thời gian làm bài", value: exam?.testDuration ? `${exam?.testDuration} phút` : "Không giới hạn" },
                                        { label: "Tỷ lệ đạt", value: exam?.passRate ? `${exam?.passRate}%` : "Không có" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between text-zinc-900">
                                            <span className="font-medium">{item.label}</span>
                                            <span>{item.value}</span>
                                        </div>
                                    ))}
                                </div>


                                <div className="w-full flex justify-center items-center gap-4 mt-10">
                                    <button
                                        onClick={handleClicked}
                                        className="px-4 py-2 bg-slate-700 rounded-md text-white font-medium hover:bg-slate-800 text-sm sm:text-base"
                                    >
                                        {exam?.isDone ? 'Xem kết quả' : 'Bắt đầu làm bài'}
                                    </button>
                                </div>
                            </>
                        )}
                        {activeItem?.item?.typeOfLearningItem === 'DOC' && activeItem?.item?.url && (
                            <PdfViewer
                                url={activeItem?.item?.url}
                                height={window.innerWidth < 768 ? "500px" : "800px"} // mobile: thấp hơn
                            />
                        )}
                    </>
                )}
                {activeItem?.type === 'lesson' && (
                    <>
                        <p className="text-center text-zinc-900 text-2xl font-semibold font-['Be_Vietnam_Pro'] mb-4">
                            {activeItem?.item?.name}
                        </p>

                        {/* Hiển thị ngày học & chương nếu có */}
                        <div className="w-full flex flex-col gap-2 text-sm font-['Be_Vietnam_Pro'] text-gray-700 mb-4">
                            <div className="flex justify-between">
                                <span>📅 Ngày học:</span>
                                <span className="text-zinc-800 font-medium">
                                    {activeItem?.item?.day ? new Date(activeItem?.item?.day).toLocaleDateString('vi-VN') : 'Không có'}
                                </span>
                            </div>
                            {activeItem?.item?.chapter && (
                                <div className="flex justify-between">
                                    <span>📘 Chương:</span>
                                    <span className="text-sky-600 font-semibold">
                                        {codes['chapter']?.find((item) => item.code === activeItem?.item?.chapter)?.description || 'Không có'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Mô tả */}
                        <div className="w-full bg-[#f9fafb] border border-gray-200 p-4 rounded-md">
                            <p className="text-gray-700 text-sm font-['Be_Vietnam_Pro'] whitespace-pre-line leading-relaxed">
                                {activeItem?.item?.description || 'Không có mô tả.'}
                            </p>
                        </div>

                        {/* Tổng số mục học */}
                        <div className="w-full flex justify-between items-center bg-gray-50 p-4 border border-dashed border-gray-300 rounded-md">
                            <p className="text-zinc-700 font-medium font-['Be_Vietnam_Pro']">Số mục học tập</p>
                            <p className="text-zinc-900 font-semibold font-['Be_Vietnam_Pro']">
                                {activeItem?.item?.learningItemCount || 0}
                            </p>
                        </div>

                        {/* Tiến độ học */}
                        <div className="w-full flex flex-col gap-2 mt-6">
                            <div className="flex justify-between text-sm font-medium font-['Be_Vietnam_Pro'] text-gray-700">
                                <span>Đã học</span>
                                <span>{countDone} / {activeItem?.item?.learningItemCount} mục</span>
                            </div>
                            {activeItem?.item?.learningItemCount > 0 && (
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(countDone / activeItem?.item?.learningItemCount * 100).toFixed(0)}%`,
                                        }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewLearning;