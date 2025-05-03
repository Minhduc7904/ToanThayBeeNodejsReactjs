import YouTubePlayer from "./YouTubePlayer";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicExamById, setExam } from "../features/exam/examSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./loading/LoadingSpinner";
import UploadPdfForm from "./UploadPdf";
import PdfViewer from "./ViewPdf";
import { putLearningItem, putLesson, uploadLearningItemPdf } from "../features/class/classSlice";
import SuggestInputBarAdmin from "./input/suggestInputBarAdmin";

const ViewDetail = ({ activeItem, deleteLesson, deleteLearningItem }) => {
    const { exam } = useSelector((state) => state.exams);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [itemData, setItemData] = useState(activeItem?.item || {});
    const [loadingExam, setLoadingExam] = useState(false);
    const { codes } = useSelector((state) => state.codes);

    const findExam = async () => {
        if (itemData.url) {
            setLoadingExam(true);
            await dispatch(fetchPublicExamById(itemData.url));
            setLoadingExam(false);
        }
    };

    const handleUpload = ({ id, pdfFile }) => {
        dispatch(uploadLearningItemPdf({ learningItemId: id, pdfFile }));
    }

    const handleDeleteItem = () => {
        if (activeItem?.type === "learningItem") {
            deleteLearningItem(itemData.id);
        } else if (activeItem?.type === "lesson") {
            deleteLesson(itemData.id)
        }
    };


    const handleSaveItem = () => {
        if (activeItem?.type === "learningItem") {
            let data
            if (itemData.typeOfLearningItem === "BTVN") {
                data = {
                    deadline: itemData.deadline,
                    name: itemData.name,
                    url: itemData.url,
                }
            } else if (itemData.typeOfLearningItem === "VID") {
                data = {
                    name: itemData.name,
                    url: itemData.url,
                }
            } else if (itemData.typeOfLearningItem === "DOC") {
                data = {
                    name: itemData.name,
                    url: itemData.url,
                }
            }
            dispatch(putLearningItem({ learningItemId: itemData.id, data: itemData }));
        } else if (activeItem?.type === "lesson") {
            const data = {
                day: itemData.day,
                description: itemData.description ? itemData.description : null,
                name: itemData.name,
                chapter: itemData.chapter ? itemData.chapter : null,
            }
            dispatch(putLesson({ lessonId: itemData.id, data }));
        }
    };

    useEffect(() => {
        if (
            activeItem?.type === "learningItem" &&
            activeItem?.item?.typeOfLearningItem === "BTVN" &&
            activeItem?.item?.url
        ) {
            dispatch(fetchPublicExamById(activeItem.item.url));
        }
        if (activeItem?.item) {
            const item = activeItem.item;
            setItemData({
                ...item,
                chapter: item.chapter ?? null
            });
        }
    }, [dispatch, activeItem]);

    const handleChange = (key, value) => {
        if (key === "url") {
            dispatch(setExam(null));
        }
        setItemData(prev => ({ ...prev, [key]: value }));
    };

    if (!activeItem) {
        return null;
    }

    return (
        <div className="w-full mt-[2rem] mb-[2rem] rounded-md shadow-sm inline-flex justify-center items-center gap-8">
            <div className="w-3/4 h-full bg-white rounded-md shadow-md p-4 justify-center items-center gap-10">
                {activeItem?.type === "learningItem" && (
                    <>
                        <input
                            className="text-zinc-900 text-2xl border border-gray-200 font-semibold font-['Be_Vietnam_Pro'] mb-4 w-full"
                            value={itemData.name || ''}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />


                        {itemData?.typeOfLearningItem === "VID" && (
                            <div className="w-full flex flex-col gap-4 ">
                                <div className="flex flex-row gap-2 items-center w-full justify-between">
                                    <div className="text-zinc-900 font-['Be_Vietnam_Pro']">Ngày đăng</div>
                                    <input
                                        type="date"
                                        readOnly
                                        className="text-right bg-gray-100 border border-gray-300 rounded px-2 py-1 w-1/2"
                                        value={itemData.createdAt?.slice(0, 10) || ''}
                                        onChange={(e) => handleChange("createdAt", e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-row gap-2 items-center w-full justify-between">

                                    <p className="text-zinc-900 font-['Be_Vietnam_Pro']">Link VIDEO</p>
                                    <input
                                        value={itemData.url || ""}
                                        onChange={(e) => handleChange("url", e.target.value)}
                                        className="text-right border border-gray-300 rounded px-2 py-1 w-3/4"
                                    />
                                </div>

                                <YouTubePlayer url={itemData.url} />
                            </div>
                        )}

                        {itemData?.typeOfLearningItem === "DOC" && (
                            <>
                                <div className="flex flex-row gap-2 items-center w-full justify-between">
                                    <div className="text-zinc-900 font-['Be_Vietnam_Pro']">Ngày đăng</div>
                                    <input
                                        type="date"
                                        readOnly
                                        className="text-right bg-gray-100 border border-gray-300 rounded px-2 py-1 w-1/2"
                                        value={itemData.createdAt?.slice(0, 10) || ''}
                                        onChange={(e) => handleChange("createdAt", e.target.value)}
                                    />
                                </div>
                                <UploadPdfForm id={itemData.id} onSubmit={handleUpload} />

                                <PdfViewer url={itemData.url} />

                            </>
                        )}

                        {itemData?.typeOfLearningItem === "BTVN" && (
                            <div className="w-full flex flex-col gap-4 ">
                                <div className="inline-flex w-full flex-col justify-center items-start gap-1 text-zinc-900 font-['Be_Vietnam_Pro']">
                                    <div className="flex flex-row gap-2 items-center w-full justify-between">
                                        <div>Ngày đăng</div>
                                        <input
                                            type="date"
                                            readOnly
                                            className="text-right bg-gray-100 border border-gray-300 rounded px-2 py-1 w-1/2"
                                            value={itemData.createdAt?.slice(0, 10) || ''}
                                            onChange={(e) => handleChange("createdAt", e.target.value)}
                                        />
                                    </div>


                                    <div className="flex flex-row gap-2 items-center w-full justify-between">
                                        <div>Hạn chót</div>
                                        <input
                                            type="date"
                                            className="text-right border border-gray-300 rounded px-2 py-1 w-1/2"
                                            value={itemData.deadline?.slice(0, 10) || ''}
                                            onChange={(e) => handleChange("deadline", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-row gap-2 items-center w-full justify-between">
                                        <div>Mã đề</div>
                                        <div className="relative w-1/2">
                                            <button
                                                onClick={findExam}
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </button>
                                            <input
                                                value={itemData?.url || ""}
                                                onChange={(e) => handleChange("url", e.target.value)}
                                                className="w-full pl-8 pr-2 py-1 text-right rounded border border-gray-300"
                                                placeholder="Nhập mã đề"
                                            />
                                        </div>
                                    </div>


                                    {
                                        loadingExam ? (
                                            <div className="w-full h-20 flex justify-center items-center">
                                                <LoadingSpinner
                                                    type="dots"
                                                    color="border-blue-600"
                                                    size="4rem"
                                                    showText={true}
                                                    text="Đang tải thông tin đề thi..."
                                                />
                                            </div>
                                        )
                                            : (
                                                exam ? (
                                                    <>
                                                        <div className="flex flex-row gap-2 items-center w-full justify-between">
                                                            <div className="font-medium">Tên đề</div>
                                                            <div className="text-right flex-1">{exam?.name}</div>
                                                        </div>

                                                        <div className="flex flex-row gap-2 items-center w-full justify-between">
                                                            <div>Thời gian làm bài</div>
                                                            <input
                                                                value={exam?.testDuration || ""}
                                                                readOnly
                                                                className="text-right bg-gray-100 rounded px-2 py-1 w-1/2"
                                                            />
                                                        </div>
                                                        <div className="flex flex-row gap-2 items-center w-full justify-between">
                                                            <div>Tỷ lệ đạt</div>
                                                            <input
                                                                value={exam?.passRate || ""}
                                                                readOnly
                                                                className="text-right bg-gray-100 rounded px-2 py-1 w-1/2"
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p>Không tìm thấy đề</p>
                                                )
                                            )
                                    }
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeItem?.type === "lesson" && (
                    <div className="flex w-full flex-col gap-4 text-zinc-900 font-['Be_Vietnam_Pro']">
                        <input
                            value={itemData.name || ''}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="text-zinc-900 text-2xl font-semibold font-['Be_Vietnam_Pro'] w-full"
                        />
                        <div className="flex flex-row gap-2 items-center w-full justify-between">
                            <div>Ngày đăng</div>
                            <input
                                type="date"
                                readOnly
                                className="text-right bg-gray-100 border border-gray-300 rounded px-2 py-1 w-1/2"
                                value={itemData.createdAt?.slice(0, 10) || ''}
                                onChange={(e) => handleChange("createdAt", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row gap-2 items-center w-full justify-between">
                            <div>Ngày học</div>
                            <input
                                type="date"
                                className="text-right border border-gray-300 rounded px-2 py-1 w-1/2"
                                value={itemData.day?.slice(0, 10) || ''}
                                onChange={(e) => handleChange("day", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row gap-2 items-center w-full justify-between">
                            <div>Chuơng
                                <span className="text-gray-400 text-sm font-['Be_Vietnam_Pro']"
                                > - {(itemData.chapter !== null) ? `${itemData.chapter}` : "Không có"}</span>
                            </div>
                            <div className="relative w-1/2">
                                <SuggestInputBarAdmin
                                    key={itemData.id} // 👈 Thêm dòng này!
                                    options={codes['chapter'] ? codes['chapter'].filter((c) => c.code.length === 4) : []}
                                    selectedOption={itemData.chapter ?? null} // dùng toán tử nullish để an toàn
                                    onChange={(value) => handleChange("chapter", value)}
                                    placeholder="Chọn chương"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center w-full justify-between">
                            <div>Mô tả</div>
                            <textarea
                                value={itemData.description || ''}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="w-3/4 bg-[#f9fafb] border border-gray-200 p-2 rounded-md resize-none text-gray-700 text-sm font-['Be_Vietnam_Pro']"
                            />
                        </div>
                        <div className="flex flex-row gap-2 items-center w-full justify-between">
                            <p className="text-zinc-700 font-medium font-['Be_Vietnam_Pro']">Số mục học tập</p>
                            <p className="text-zinc-700 font-medium font-['Be_Vietnam_Pro']">{itemData?.learningItems?.length || 0}</p>
                        </div>
                    </div>
                )}
                <div className="flex justify-between gap-4 mt-4">
                    <button
                        onClick={handleDeleteItem}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow-md transition-all"
                    >
                        Xóa
                    </button>
                    <button
                        onClick={handleSaveItem}
                        className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-md shadow-md transition-all"
                    >
                        Lưu
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ViewDetail;
