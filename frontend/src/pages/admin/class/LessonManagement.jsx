import AdminLayout from "../../../layouts/AdminLayout";
import { useParams } from "react-router-dom";
import UserClassTable from "../../../components/table/UserClassTable";
import { useNavigate } from "react-router-dom";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFullLessonLearningItemByClassId, postLesson, deleteLesson, postLearningItem, deleteLearningItem } from "../../../features/class/classSlice";
import LearningItemIcon from "../../../components/image/LearningItemIcon";
import ViewDetail from "../../../components/ViewDetail";
import { setErrorMessage } from "../../../features/state/stateApiSlice";
import { fetchCodesByType } from "../../../features/code/codeSlice";
import DropMenuBarAdmin from "../../../components/dropMenu/OptionBarAdmin";
import { fetchPublicExamById, setExam } from "../../../features/exam/examSlice";
import LoadingSpinner from "../../../components/loading/LoadingSpinner";
import YouTubePlayer from "../../../components/YouTubePlayer";
import SuggestInputBarAdmin from "../../../components/input/suggestInputBarAdmin";

const LessonManagement = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { classDetail } = useSelector((state) => state.classes);
    const { codes } = useSelector((state) => state.codes);
    const { exam } = useSelector((state) => state.exams);
    const [openLessons, setOpenLessons] = useState([]);
    const [isAddViewLesson, setIsAddViewLesson] = useState(false);
    const [isAddViewLearningItem, setIsAddViewLearningItem] = useState(false);
    const [loadingExam, setLoadingExam] = useState(false);
    const [loading, setLoading] = useState(false);

    const [newLesson, setNewLesson] = useState({
        name: '',
        day: '',
        description: '',
        chapter: null,
    });

    const [newLearningItem, setNewLearningItem] = useState({
        name: '',
        typeOfLearningItem: '',
        url: '',
        deadline: '',
        description: '',
        lessonId: '',
    });

    const handleChange = (e) => {
        setNewLesson({
            ...newLesson,
            [e.target.name]: e.target.value,
        });
    };

    const findExam = async () => {
        if (newLearningItem.url) {
            setLoadingExam(true);
            await dispatch(fetchPublicExamById(newLearningItem.url));
            setLoadingExam(false);
        }
    };

    const handleChangeLearningItem = (e) => {

        setNewLearningItem({
            ...newLearningItem,
            [e.target.name]: e.target.value,
        });
    };

    const toggleLesson = (index) => {
        setOpenLessons((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // nếu đang mở thì đóng lại
                : [...prev, index]               // nếu đang đóng thì mở ra
        );
    };
    const [activeItem, setActiveItem] = useState({
        type: null,
        index: null,
        item: null,
    });

    const handleAddLesson = () => {
        setIsAddViewLesson(true);
        setIsAddViewLearningItem(false);
        setNewLesson({
            name: '',
            day: '',
            description: '',
            chapter: null,
        });
    }

    const handleAddLearningItem = (lessonId) => {
        setIsAddViewLearningItem(true);
        setIsAddViewLesson(false);
        setNewLearningItem({
            name: '',
            typeOfLearningItem: '',
            url: '',
            deadline: '',
            description: '',
            lessonId,
        });
    }

    const handleSubmitLesson = async () => {

        if (!newLesson.name || !newLesson.day) {
            dispatch(setErrorMessage("Vui lòng điền đầy đủ thông tin"));
            return;
        }

        if (newLesson.description.length > 500) {
            dispatch(setErrorMessage("Mô tả không được quá 500 ký tự"));
            return;
        }

        // Dispatch action to add lesson
        await dispatch(postLesson({ data: { ...newLesson, classId } })); // Gọi API để thêm lesson mới

        setIsAddViewLesson(false); // Đóng form thêm buổi học sau khi đã lưu
        setNewLesson({ name: '', day: '', description: '', chapter: null }); // Reset form

        // Cập nhật lại danh sách lessons
        dispatch(getFullLessonLearningItemByClassId({ classId }));
    };

    const handleSubmitLearningItem = async () => {
        if (!newLearningItem.name || !newLearningItem.typeOfLearningItem) {
            dispatch(setErrorMessage("Vui lòng điền đầy đủ thông tin"));
            return;
        }

        if (newLearningItem.typeOfLearningItem === 'BTVN' && !newLearningItem.url) {
            dispatch(setErrorMessage("Vui lòng nhập mã đề"));
            return;
        }

        if (newLearningItem.description.length > 500) {
            dispatch(setErrorMessage("Mô tả không được quá 500 ký tự"));
            return;
        }
        const filteredItem = Object.fromEntries(
            Object.entries(newLearningItem).filter(
                ([_, value]) => value !== null && value !== ''
            )
        );
        // Dispatch action to add learning item
        await dispatch(postLearningItem({
            data: {
                ...filteredItem,
                lessonId: activeItem.index
            }
        }));
        setIsAddViewLearningItem(false); // Đóng form thêm mục học tập sau khi đã lưu
        setNewLearningItem({ name: '', typeOfLearningItem: '', url: '', deadline: '', description: '' }); // Reset form

        // Cập nhật lại danh sách learning items
        dispatch(getFullLessonLearningItemByClassId({ classId }));
    };

    const handleDeleteLesson = async (lessonId) => {
        await dispatch(deleteLesson({ lessonId }));
        dispatch(getFullLessonLearningItemByClassId({ classId }));
    };

    const handleDeleteLearningItem = async (learningItemId) => {
        await dispatch(deleteLearningItem({ learningItemId }));
        dispatch(getFullLessonLearningItemByClassId({ classId }));
    };

    useEffect(() => {
        setLoading(true);
        dispatch(fetchCodesByType(['study item type', 'chapter']))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        setIsAddViewLearningItem(false);
        setIsAddViewLesson(false);
    }, [activeItem]);

    useEffect(() => {
        if (classId) {
            setLoading(true);
            dispatch(getFullLessonLearningItemByClassId({ classId }))
                .then(() => setLoading(false))
                .catch(() => setLoading(false));

        }
    }, [dispatch, classId]);

    useEffect(() => {
        if (classDetail && classDetail?.lessons?.length > 0) {
            setActiveItem({
                type: "lesson",
                index: classDetail?.lessons[0]?.id || null,
                item: classDetail?.lessons[0] || null,
            });
        }
    }, [classDetail]);
    useEffect(() => {
        const handleSelectItem = (e) => {
            const item = e.detail;
            setActiveItem({ type: 'learningItem', index: item.id, item });
        };

        window.addEventListener("selectLearningItem", handleSelectItem);
        return () => window.removeEventListener("selectLearningItem", handleSelectItem);
    }, []);

    // useEffect(() => {
    //     console.log("newLesson", newLesson);
    // }, [newLesson]);

    return (
        <AdminLayout>
            <div className="flex gap-2 items-center">
                <button onClick={() => navigate("/admin/class-management")} className="flex items-center justify-center w-10 h-10 hover:bg-[#F6FAFD] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M12.6667 8.66675L5.50292 15.8289C5.38989 15.94 5.33337 16.0856 5.33337 16.2312M12.6667 23.3334L5.50292 16.6335C5.38989 16.5224 5.33337 16.3768 5.33337 16.2312M5.33337 16.2312H26.6667" stroke="#131214" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                </button>
                <div className="relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose">Chi tiết lớp học - {classId}</div>
            </div>
            <div className="flex w-full h-2 border-b border-[#E7E7ED]"></div>
            <div className="flex gap-2 items-center border-b border-[#E7E7ED]">
                <div
                    onClick={() => navigate(`/admin/class-management/${classId}`)}
                    className={`cursor-pointer relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                    Chi tiết
                </div>
                <div
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                    -
                </div>
                <div
                    onClick={() => navigate(`/admin/class-management/${classId}/users`)}
                    className={`cursor-pointer relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                    Danh sách học sinh
                </div>
                <div
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                    -
                </div>
                <div
                    // onClick={handleClickedPreviewExam}
                    className={`relative justify-center text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-gray-500 underline`}>
                    Danh sách buổi học
                </div>
            </div>
            <div className="flex flex-row w-full gap-4">
                {loading ? (
                    <div className="flex items-center w-1/3 justify-center h-screen">
                        <LoadingSpinner
                            type="dots"
                            color="border-blue-600"
                            size="4rem"
                            showText={true}
                            text="Đang tải danh sách buổi học..."
                        />
                    </div>

                ) : (
                    <div className="flex flex-col w-1/3 gap-1 h-[100vh] overflow-y-auto hide-scrollbar  p-4">
                        <div className="flex justify-between items-center w-full text-black border border-dashed border-blue-400 hover:bg-blue-600 hover:text-white rounded-md">
                            <button
                                onClick={handleAddLesson}
                                className="px-4 w-full py-2 rounded "
                            >
                                + Thêm buổi học
                            </button>
                        </div>
                        {classDetail?.lessons?.length === 0 && (
                            <div className="flex justify-center items-center h-96">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="text-xl font-bold text-gray-500">Chưa có buổi học nào</div>
                                </div>
                            </div>
                        )}

                        {classDetail?.lessons?.map((lesson, index) => (
                            <div key={index} className="self-stretch text-sm rounded-md flex flex-col justify-start items-start gap-1">
                                <div

                                    className={`cursor-pointer self-stretch p-2 ${activeItem.type === 'lesson' && activeItem.index === lesson.id ? 'bg-slate-700 hover:bg-slate-600 text-white' : ' hover:bg-gray-200 text-black'} rounded-md inline-flex justify-start items-center gap-1 transition `}
                                >
                                    {
                                        lesson?.learningItems?.length > 0 ? (
                                            <svg
                                                onClick={() => {
                                                    toggleLesson(index); // toggle mở/đóng
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="25"
                                                viewBox="0 0 24 25"
                                                fill="none"
                                                className={`transform transition-transform duration-300 ${openLessons.includes(index) ? '' : 'rotate-180'} ${activeItem.type === 'lesson' && activeItem.index === lesson.id ? 'stroke-white' : ' stroke-black'}`}
                                            >
                                                <path d="M18 9.5L12 15.5L6 9.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className={` ${activeItem.type === 'lesson' && activeItem.index === lesson.id ? 'stroke-white' : ' stroke-black'}`}
                                            >
                                                <path d="M12 4V20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )
                                    }

                                    <div
                                        onClick={() => {
                                            setActiveItem({ type: 'lesson', index: lesson.id, item: lesson }); // set là lesson đang được chọn
                                        }}
                                        className="truncate w-full text-md font-medium font-['Be_Vietnam_Pro']">
                                        {lesson.name}
                                    </div>

                                    <div className=" text-md font-medium font-['Be_Vietnam_Pro']">
                                        {new Date(lesson.day).toLocaleDateString()}
                                    </div>

                                </div>

                                {/* Lesson Content */}
                                <div
                                    className={`flex flex-col transition-all duration-500 ease-in-out overflow-hidden w-full
        ${openLessons.includes(index) || lesson.learningItems.length === 0 ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                                >
                                    {lesson.learningItems?.map((learningItem, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setActiveItem({ type: 'learningItem', index: learningItem.id, item: learningItem })}
                                            className={`pl-12 pr-4 py-2 rounded-md inline-flex justify-start items-center gap-2.5 cursor-pointer transition
                ${activeItem.type === 'learningItem' && activeItem.index === learningItem.id ? 'bg-slate-700 text-white' : 'hover:bg-gray-200'}`}
                                        >
                                            <LearningItemIcon type={learningItem.typeOfLearningItem} />
                                            <div className="truncate w-full font-medium font-['Be_Vietnam_Pro']">
                                                {learningItem.name}
                                            </div>
                                        </div>
                                    ))}
                                    {/* Thêm mục học tập luôn hiển thị */}
                                    <div className="flex justify-between items-center w-full text-black border border-dashed border-purple-400 hover:bg-purple-600 hover:text-white rounded-md mt-2">
                                        <button
                                            onClick={() => handleAddLearningItem(lesson.id)}
                                            className="px-4 w-full py-2 rounded "
                                        >
                                            + Thêm mục học tập
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex bg-slate-100 flex-col flex-1">
                    {isAddViewLesson ? (
                        <div className="w-full mt-[2rem] mb-[2rem] rounded-md shadow-sm inline-flex justify-center items-center gap-8">
                            <div className="w-3/4 h-full bg-white rounded-md shadow-md p-4 justify-center items-center gap-10">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-semibold font-['Be_Vietnam_Pro']">Tên buổi học</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newLesson.name}
                                            onChange={handleChange}
                                            className="w-full h-10 border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-semibold font-['Be_Vietnam_Pro']">Ngày học</label>
                                        <input
                                            type="date"
                                            name="day"
                                            value={newLesson.day}
                                            onChange={handleChange}
                                            className="w-full h-10 border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-semibold font-['Be_Vietnam_Pro']">Chương
                                            <span className="text-gray-400 text-sm font-['Be_Vietnam_Pro']"
                                            > - {(newLesson.chapter !== null) ? `${newLesson.chapter}` : "Không có"}</span>
                                        </label>
                                        <SuggestInputBarAdmin
                                            options={codes['chapter'] ? codes['chapter'].filter((c) => c.code.length===4) : []}
                                            selectedOption={newLesson.chapter}
                                            onChange={(option) => setNewLesson({ ...newLesson, chapter: option })}
                                            placeholder="Chọn chương" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-semibold font-['Be_Vietnam_Pro']">Mô tả</label>
                                        <textarea
                                            name="description"
                                            value={newLesson.description}
                                            onChange={handleChange}
                                            className="w-full h-32 border resize-none border-gray-300 rounded-md p-2"
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end items-center gap-4">
                                        <button
                                            onClick={handleSubmitLesson}
                                            className="px-4 py-2 bg-slate-700 rounded-[50px] inline-flex justify-center items-center gap-2.5">
                                            <div className="justify-center text-white font-medium font-['Be_Vietnam_Pro']">
                                                Lưu
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setIsAddViewLesson(false)}
                                            className="px-4 py-2 bg-gray-400 rounded-[50px] inline-flex justify-center items-center gap-2.5">
                                            <div className="justify-center text-white font-medium font-['Be_Vietnam_Pro']">
                                                Hủy
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : isAddViewLearningItem ? (
                        <div className="w-full mt-[2rem] mb-[2rem] rounded-md shadow-sm inline-flex justify-center items-center gap-8">
                            <div className="w-3/4 h-full bg-white rounded-md shadow-md p-4 justify-center items-center gap-10">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-semibold font-['Be_Vietnam_Pro']">Tên mục học tập</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newLearningItem.name}
                                            onChange={handleChangeLearningItem}
                                            className="w-full h-10 border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between gap-2">
                                        <label className="text-lg font-semibold font-['Be_Vietnam_Pro']">Buổi học</label>
                                        <div>{classDetail?.lessons?.find((lesson) => lesson.id === newLearningItem.lessonId).name}</div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-semibold font-['Be_Vietnam_Pro']">Loại mục học tập</label>
                                        <DropMenuBarAdmin
                                            selectedOption={newLearningItem.typeOfLearningItem}
                                            onChange={(option) => setNewLearningItem({ ...newLearningItem, typeOfLearningItem: option })}
                                            options={codes['study item type'] ? codes['study item type'] : []} />
                                    </div>
                                    {newLearningItem.typeOfLearningItem === 'BTVN' ? (
                                        <>
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
                                                        type="text"
                                                        name="url"
                                                        value={newLearningItem?.url || ""}
                                                        onChange={handleChangeLearningItem}
                                                        className="w-full pl-8 pr-2 py-1 text-right rounded border border-gray-300"
                                                        placeholder="Nhập mã đề"
                                                    />
                                                </div>
                                            </div>
                                            {
                                                loadingExam ? (
                                                    <div className="w-full h-20 flex justify-center items-center">
                                                        <LoadingSpinner color="border-black" />
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
                                        </>
                                    ) : newLearningItem.typeOfLearningItem === 'VID' ? (
                                        <>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-lg font-semibold font-['Be_Vietnam_Pro']">Link video</label>
                                                <input
                                                    type="text"
                                                    name="url"
                                                    value={newLearningItem.url}
                                                    onChange={handleChangeLearningItem}
                                                    className="w-full h-10 border border-gray-300 rounded-md p-2"
                                                />
                                            </div>
                                            <YouTubePlayer url={newLearningItem.url} />
                                        </>
                                    ) : newLearningItem.typeOfLearningItem === 'DOC' && (
                                        <div className="text-red-500 font-bevietnam">
                                            Thêm tài liệu sau khi thêm mục học tập
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-semibold font-['Be_Vietnam_Pro']">Ngày hết hạn</label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            value={newLearningItem.deadline}
                                            onChange={handleChangeLearningItem}
                                            className="w-full h-10 border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-semibold font-['Be_Vietnam_Pro']">Mô tả</label>
                                        <textarea
                                            name="description"
                                            value={newLearningItem.description}
                                            onChange={handleChangeLearningItem}
                                            className="w-full h-32 border resize-none border-gray-300 rounded-md p-2"
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end items-center gap-4">
                                        <button
                                            onClick={handleSubmitLearningItem}
                                            className="px-4 py-2 bg-slate-700 rounded-[50px] inline-flex justify-center items-center gap-2.5">
                                            <div className="justify-center text-white font-medium font-['Be_Vietnam_Pro']">
                                                Lưu
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setIsAddViewLearningItem(false)}
                                            className="px-4 py-2 bg-gray-400 rounded-[50px] inline-flex justify-center items-center gap-2.5">
                                            <div className="justify-center text-white font-medium font-['Be_Vietnam_Pro']">
                                                Hủy
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (classDetail?.lessons?.length > 0 &&
                        <ViewDetail
                            activeItem={activeItem} deleteLearningItem={handleDeleteLearningItem} deleteLesson={handleDeleteLesson}
                        />
                    )}

                </div>
            </div>
        </AdminLayout>
    )
}

export default LessonManagement;
