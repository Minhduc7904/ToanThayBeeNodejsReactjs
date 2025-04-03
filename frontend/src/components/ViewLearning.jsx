import YouTubePlayer from "./YouTubePlayer";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicExamById } from "../features/exam/examSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PdfViewer from "./ViewPdf";

const ViewLearning = ({ activeItem }) => {
    const { exam } = useSelector((state) => state.exams);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        <div className="w-full h-full bg-[#F6FAFD] rounded-md shadow-sm flex justify-center items-start px-4 pb-6 sm:px-6 md:px-10">

            <div className="w-full max-w-5xl bg-white rounded-md shadow-md p-4 sm:p-6 md:p-8 flex flex-col gap-6">
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
                                        { label: "Thời gian làm bài", value: `${exam?.testDuration} phút` },
                                        { label: "Tỷ lệ đạt", value: `${exam?.passRate}%` },
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm text-zinc-900">
                                            <span className="font-medium">{item.label}</span>
                                            <span>{item.value}</span>
                                        </div>
                                    ))}
                                </div>


                                <div className="w-full flex justify-center items-center gap-4 mt-10">
                                    <button
                                        onClick={handleClicked}
                                        className="px-4 py-2 bg-slate-700 rounded-full text-white font-medium hover:bg-slate-800 text-sm sm:text-base"
                                    >
                                        {exam?.isDone ? 'Xem kết quả' : 'Bắt đầu làm bài'}
                                    </button>
                                </div>


                            </>
                        )}
                        {(activeItem?.item?.typeOfLearningItem === 'DOC' && activeItem?.item?.url) && (
                            <PdfViewer url={activeItem?.item?.url} height={"800px"} />
                        )}
                    </>
                )}
                {activeItem?.type === 'lesson' && (
                    <>
                        <p className="text-center text-zinc-900 text-2xl font-semibold font-['Be_Vietnam_Pro'] mb-4">
                            {activeItem?.item?.name}
                        </p>

                        <div className="w-full bg-[#f9fafb] border border-gray-200 p-4 rounded-md mb-6">
                            <p className="text-gray-700 text-sm font-['Be_Vietnam_Pro'] whitespace-pre-line leading-relaxed">
                                {activeItem?.item?.description || 'Không có mô tả.'}
                            </p>
                        </div>

                        <div className="w-full flex justify-between items-center bg-gray-50 p-4 border border-dashed border-gray-300 rounded-md">
                            <p className="text-zinc-700 font-medium font-['Be_Vietnam_Pro']">Số mục học tập</p>
                            <p className="text-zinc-900 font-semibold font-['Be_Vietnam_Pro']">
                                {activeItem?.item?.learningItemCount || 0}
                            </p>
                        </div>
                        <div className="w-full flex flex-col gap-2 mt-6">
                            <div className="flex justify-between text-sm font-medium font-['Be_Vietnam_Pro'] text-gray-700">
                                <span>Đã học</span>
                                <span>3 / 5 mục</span> {/* ví dụ tĩnh */}
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </>
                )}


            </div>
        </div>
    );
}

export default ViewLearning;