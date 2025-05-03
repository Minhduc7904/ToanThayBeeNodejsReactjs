import { useDispatch, useSelector } from "react-redux";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDataForLearning, markLearningItem } from "../../../features/class/classSlice";
import LearningItemIcon from "../../../components/image/LearningItemIcon";
import ViewLearning from "../../../components/ViewLearning";
import { useNavigate } from "react-router-dom";
import FullScreen from "../../../components/button/ScreenButton";
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchCodesByType } from "../../../features/code/codeSlice";


const LearningPage = () => {
    const { classCode } = useParams();
    const { classDetail } = useSelector((state) => state.classes);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openLessons, setOpenLessons] = useState([]);
    const { exam } = useSelector((state) => state.exams);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { codes } = useSelector((state) => state.codes);

    const sortLessons = (lessons) => {
        if (!Array.isArray(lessons)) return [];

        const lessonsWithChapter = lessons.filter(l => l.chapter);
        const lessonsWithoutChapter = lessons.filter(l => !l.chapter);

        // Nhóm theo chapter
        const groupedByChapter = lessonsWithChapter.reduce((acc, lesson) => {
            if (!acc[lesson.chapter]) acc[lesson.chapter] = [];
            acc[lesson.chapter].push(lesson);
            return acc;
        }, {});

        // Mỗi nhóm sort theo day tăng dần (xa nhất đến gần nhất)
        const sortedChapterGroups = Object.entries(groupedByChapter).map(([chapter, lessonList]) => {
            const sortedLessons = lessonList.sort((a, b) => new Date(a.day) - new Date(b.day));
            return {
                chapter,
                lessons: sortedLessons,
                earliestDay: new Date(sortedLessons[0].day),
            };
        });

        // Sắp xếp nhóm theo earliestDay tăng dần
        sortedChapterGroups.sort((a, b) => a.earliestDay - b.earliestDay);

        const result = [];

        // Sort lessons không chapter theo day tăng dần (xa → gần)
        const sortedNoChapter = lessonsWithoutChapter.sort((a, b) => new Date(a.day) - new Date(b.day));

        let chapterIndex = 0;

        sortedNoChapter.forEach(noChapLesson => {
            const day = new Date(noChapLesson.day);

            // Chèn lesson không chapter trước nhóm có ngày >=
            while (
                chapterIndex < sortedChapterGroups.length &&
                day > sortedChapterGroups[chapterIndex].earliestDay
            ) {
                const group = sortedChapterGroups[chapterIndex];
                result.push(...group.lessons.map(l => ({ type: 'lesson', ...l })));
                chapterIndex++;
            }

            result.push({ type: 'lesson', ...noChapLesson });
        });

        // Thêm nhóm còn lại
        for (; chapterIndex < sortedChapterGroups.length; chapterIndex++) {
            const group = sortedChapterGroups[chapterIndex];
            result.push(...group.lessons.map(l => ({ type: 'lesson', ...l })));
        }

        return result;
    };

    const groupLessonsByChapter = (lessons) => {
        const grouped = {};
        for (const lesson of lessons) {
            const key = lesson.chapter || '__no_chapter__';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(lesson);
        }
        return grouped;
    };

    const sortedLessons = classDetail?.lessons ? sortLessons(classDetail.lessons) : [];
    const groupedLessons = groupLessonsByChapter(sortedLessons);


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

    const getPrevNextItem = () => {
        if (activeItem?.type !== "learningItem" || !classDetail) return {};

        const allItems = classDetail.lessons.flatMap((lesson) =>
            lesson.learningItems.map((item) => ({
                ...item,
                lessonId: lesson.id,
            }))
        );

        const currentIndex = allItems.findIndex((item) => item.id === activeItem.item.id);

        const prevItem = allItems[currentIndex - 1] || null;
        const nextItem = allItems[currentIndex + 1] || null;

        return { prevItem, nextItem };
    };

    const { prevItem, nextItem } = getPrevNextItem();

    useEffect(() => {
        if (classCode) {
            dispatch(getDataForLearning(classCode));
        }
    }, [dispatch, classCode]);

    useEffect(() => {
        dispatch(fetchCodesByType(['chapter']));
    }, [dispatch]);

    useEffect(() => {
        console.log("activeItem", activeItem);
    }, [activeItem]);

    useEffect(() => {
        if (
            activeItem?.type === "learningItem" &&
            activeItem.item?.typeOfLearningItem === "BTVN" &&
            exam?.isDone &&
            activeItem.item?.studyStatuses?.[0]?.isDone === false
        ) {
            dispatch(markLearningItem({ learningItemId: activeItem.item.id }));
        }
    }, [activeItem, exam, dispatch]);

    useEffect(() => {
        if (classDetail) {
            const learningItem = classDetail.lessons.flatMap((lesson) =>
                lesson.learningItems.map((item) => ({
                    ...item,
                    lessonId: lesson.id,
                }))
            ).find((item) => item.id === activeItem?.index);
            if (learningItem) {
                setActiveItem((prev) => ({
                    ...prev,
                    item: learningItem,
                }));
            }
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



    return (
        <div className={`flex flex-col bg-[#F6FAFD] text-black min-h-screen`}>
            <div className="fixed w-full top-0 z-20 bg-sky-800 shadow-md p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            className="text-white block lg:hidden"
                            onClick={() => setIsSidebarOpen(prev => !prev)}
                        >
                            {isSidebarOpen ? '✖' : '☰'}
                        </button>
                        <div
                            onClick={() => navigate(`/class/${classDetail.class_code}`)}
                            className="text-white text-xl cursor-pointer"
                        >
                            Toán thầy Bee
                        </div>

                    </div>


                    <div className="flex items-center gap-4">
                        {/* Toggle Sidebar Button */}
                        <FullScreen />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row w-full gap-5 pt-20 ">
                <div
                    className={`transition-all lg:fixed duration-300 fixed z-30 bg-white border-r border-slate-300 shadow-md top-20
  ${isSidebarOpen ? 'left-0' : '-left-full'} 
  lg:top-20 w-4/5 lg:w-1/5 lg:left-0 h-[calc(100vh-64px)] overflow-y-auto hide-scrollbar pb-10`}
                >
                    <div className="inline-flex flex-col justify-start items-start px-4">
                        <div
                            onClick={() => setActiveItem({ type: null, index: null, item: null })}
                            className="w-48 justify-start text-zinc-900 text-xl font-semibold font-['Be_Vietnam_Pro'] cursor-pointer">Chương trình học</div>
                        <div className="w-52 justify-start text-sm text-zinc-700 font-normal font-['Be_Vietnam_Pro']">{classDetail?.name}</div>
                    </div>
                    <hr className="w-full h-[1px] bg-neutral-200 my-4" />
                    {sortedLessons.map((lesson, index) => {
                        const prevLesson = sortedLessons[index - 1];
                        const nextLesson = sortedLessons[index + 1];
                        const isFirstOfGroup = lesson.chapter && lesson.chapter !== prevLesson?.chapter;
                        const isLastOfGroup = lesson.chapter && lesson.chapter !== nextLesson?.chapter;
                        const chapterDescription = lesson.chapter
                            ? codes['chapter']?.find((c) => c.code === lesson.chapter)?.description || lesson.chapter
                            : null;
                        return (
                            <div key={lesson.id} className="w-full">
                                {/* Hiển thị CHAPTER nếu là bài đầu của nhóm */}
                                {isFirstOfGroup && (
                                    <>
                                        <div className="text-base text-sky-600 font-semibold font-['Be_Vietnam_Pro'] px-4 pt-3">
                                            {chapterDescription}
                                        </div>
                                    </>

                                )}

                                {/* Bài học */}
                                <div className="self-stretch text-sm rounded-md flex flex-col justify-start items-start gap-1">
                                    <div
                                        className={`cursor-pointer self-stretch p-2 ${activeItem.type === 'lesson' && activeItem.index === lesson.id
                                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                            : 'hover:bg-gray-200 text-black'
                                            } rounded-md inline-flex justify-start items-center gap-2.5 transition`}
                                    >
                                        {/* Toggle nút */}
                                        {lesson.learningItems?.length > 0 ? (
                                            <svg
                                                onClick={() => toggleLesson(index)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="25"
                                                viewBox="0 0 24 25"
                                                fill="none"
                                                className={`transform transition-transform duration-300 ${openLessons.includes(index) ? '' : 'rotate-180'
                                                    } ${activeItem.type === 'lesson' && activeItem.index === lesson.id
                                                        ? 'stroke-white'
                                                        : 'stroke-black'
                                                    }`}
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
                                                className={`${activeItem.type === 'lesson' && activeItem.index === lesson.id
                                                    ? 'stroke-white'
                                                    : 'stroke-black'
                                                    }`}
                                            >
                                                <path d="M12 4V20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}

                                        <div
                                            onClick={() => setActiveItem({ type: 'lesson', index: lesson.id, item: lesson })}
                                            className="truncate w-full text-md font-medium font-['Be_Vietnam_Pro']"
                                        >
                                            {lesson.name}
                                        </div>
                                        <div className="text-md font-medium font-['Be_Vietnam_Pro']">
                                            {new Date(lesson.day).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Hiển thị các mục học */}
                                    <div
                                        className={`flex flex-col transition-all duration-500 ease-in-out overflow-hidden w-full ${openLessons.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        {lesson.learningItems?.map((learningItem, i) => {
                                            const isDone = learningItem.studyStatuses?.[0]?.isDone;
                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() =>
                                                        setActiveItem({ type: 'learningItem', index: learningItem.id, item: learningItem })
                                                    }
                                                    className={`pl-4 pr-2 py-2 rounded-md inline-flex justify-start items-center gap-2.5 cursor-pointer transition ${activeItem.type === 'learningItem' && activeItem.index === learningItem.id
                                                        ? 'bg-slate-700 text-white'
                                                        : 'hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${isDone ? 'bg-green-500' : 'bg-yellow-400'
                                                            }`}
                                                    />
                                                    <LearningItemIcon type={learningItem.typeOfLearningItem} />
                                                    <div className="truncate w-full font-medium font-['Be_Vietnam_Pro']">
                                                        {learningItem.name}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Dòng kẻ dưới nhóm chương */}
                                {isLastOfGroup && <hr className="w-full border-t border-slate-200 my-3" />}
                            </div>
                        );
                    })}

                </div>
                <div className="flex flex-col w-full px-4 pb-6 lg:px-10 lg:pb-8 lg:ml-[20%] justify-between">
                    {sortedLessons.length > 0 ? (
                        <ViewLearning activeItem={activeItem} classDetail={classDetail} />
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-400">Không có buổi học nào</p>
                        </div>
                    )}

                </div>
                {activeItem?.type === "learningItem" && (
                    <div className="w-full bg-sky-100 border-t border-sky-200 p-2 fixed bottom-0 flex justify-between items-center lg:pl-[21%]">
                        {/* Bên trái: Trạng thái và nút đánh dấu */}
                        {activeItem?.type === "learningItem" && (
                            <div className="flex items-center gap-4">
                                {activeItem?.item.typeOfLearningItem !== "BTVN" && (
                                    <button
                                        onClick={() => {
                                            dispatch(markLearningItem({
                                                learningItemId: activeItem?.item?.id,
                                            }));
                                        }}
                                        className={`px-4 py-2 rounded-md text-sm transition ${activeItem?.item?.studyStatuses?.[0]?.isDone
                                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                                            : "bg-green-600 text-white hover:bg-green-700"
                                            }`}
                                    >
                                        {activeItem?.item?.studyStatuses?.[0]?.isDone
                                            ? "Bỏ đánh dấu"
                                            : "Đánh dấu đã học"}
                                    </button>
                                )}
                                <div className="flex items-start lg:items-center justify-center lg:flex-row lg:gap-2 flex-col">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-2 h-2 rounded-full flex-shrink-0 ${activeItem?.item?.studyStatuses?.[0]?.isDone ? 'bg-green-500' : 'bg-yellow-400'
                                                }`}
                                        ></div>
                                        <p
                                            className={`text-sm font-medium ${activeItem?.item?.studyStatuses?.[0]?.isDone ? 'text-green-500' : 'text-yellow-400'
                                                }`}
                                        >
                                            {activeItem?.item?.studyStatuses?.[0]?.isDone ? 'Đã học' : 'Chưa học'}
                                        </p>
                                    </div>

                                    {activeItem?.item?.studyStatuses?.[0]?.isDone && (
                                        <p className="text-xs lg:text-sm font-medium text-gray-500 ">
                                            {new Date(activeItem?.item?.studyStatuses?.[0]?.studyTime).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Bên phải: Nút chuyển mục */}
                        <div className="flex items-center gap-2">
                            <button
                                disabled={!prevItem}
                                onClick={() =>
                                    prevItem &&
                                    window.dispatchEvent(new CustomEvent("selectLearningItem", { detail: prevItem }))
                                }
                                className={`px-3 py-2 rounded-md flex items-center justify-center gap-1 ${prevItem ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden lg:inline">Mục trước</span>
                            </button>

                            <button
                                disabled={!nextItem}
                                onClick={() =>
                                    nextItem &&
                                    window.dispatchEvent(new CustomEvent("selectLearningItem", { detail: nextItem }))
                                }
                                className={`px-3 py-2 rounded-md flex items-center justify-center gap-1 ${nextItem ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                <span className="hidden lg:inline">Mục tiếp</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>


                )}
            </div>

        </div >

    );
}

export default LearningPage;