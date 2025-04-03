import { useDispatch, useSelector } from "react-redux";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDataForLearning } from "../../features/class/classSlice";
import LearningItemIcon from "../../components/image/LearningItemIcon";
import ViewLearning from "../../components/ViewLearning";
import { useNavigate } from "react-router-dom";
import FullScreen from "../../components/button/ScreenButton";

const LearningPage = () => {
    const { classCode } = useParams();
    const { classDetail } = useSelector((state) => state.classes);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openLessons, setOpenLessons] = useState([]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        if (classDetail) {
            setActiveItem({
                type: "lesson",
                index: classDetail.lessons[0]?.id || null,
                item: classDetail.lessons[0] || null,
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

            <div className="flex flex-col lg:flex-row w-full gap-5 pt-20">
                <div
                    className={`transition-all lg:fixed duration-300 fixed z-30 bg-white border-r border-slate-300 shadow-md pb-10 top-20
  ${isSidebarOpen ? 'left-0' : '-left-full'} 
  lg:top-20 w-4/5 h-[calc(100vh-64px)] lg:w-1/5 lg:h-full lg:left-0`}
                >
                    <div className="inline-flex flex-col justify-start items-start px-4">
                        <div
                            className="w-48 justify-start text-zinc-900 text-xl font-semibold font-['Be_Vietnam_Pro']">Chương trình học</div>
                        <div className="w-52 justify-start text-sm text-zinc-700 font-normal font-['Be_Vietnam_Pro']">{classDetail?.name}</div>
                    </div>
                    <hr className="w-full h-[1px] bg-neutral-200 my-4" />
                    {classDetail?.lessons?.map((lesson, index) => (
                        <div key={index} className="self-stretch text-sm rounded-md flex flex-col justify-start items-start gap-1">
                            <div

                                className={`cursor-pointer self-stretch p-2 ${activeItem.type === 'lesson' && activeItem.index === lesson.id ? 'bg-slate-700 hover:bg-slate-600 text-white' : ' hover:bg-gray-200 text-black'} rounded-md inline-flex justify-start items-center gap-2.5 transition `}
                            >
                                {
                                    lesson.learningItems?.length > 0 ? (
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
                                            className={` ${activeItem.type === 'lesson' && activeItem.index === lesson.id ? 'stroke-white' : ' stroke-black'} focus:`}
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
                                className={`flex flex-col transition-all duration-500 ease-in-out overflow-hidden w-full ${openLessons.includes(index) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                    }`}
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
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col w-full px-4 pb-6 lg:px-10 lg:pb-8 ml-[20%] justify-between">
                    {classDetail?.lessons?.length > 0 ? (
                        <ViewLearning activeItem={activeItem} classDetail={classDetail} />
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-400">Không có buổi học nào</p>
                        </div>
                    )}

                </div>
                {activeItem?.type === "learningItem" && (
                    <div className={`w-full bg-sky-100 p-2 fixed bottom-0 flex pl-[20%] gap-2 justify-end items-center`}>
                    <button
                            disabled={!prevItem}
                            onClick={() =>
                                prevItem &&
                                window.dispatchEvent(
                                    new CustomEvent("selectLearningItem", {
                                        detail: prevItem,
                                    })
                                )
                            }
                            className={`px-4 py-2 rounded-md ${prevItem
                                    ? "bg-sky-600 hover:bg-sky-700 text-white"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            ← Mục trước
                        </button>

                        <button
                            disabled={!nextItem}
                            onClick={() =>
                                nextItem &&
                                window.dispatchEvent(
                                    new CustomEvent("selectLearningItem", {
                                        detail: nextItem,
                                    })
                                )
                            }
                            className={`px-4 py-2 rounded-md ${nextItem
                                    ? "bg-sky-600 hover:bg-sky-700 text-white"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Mục tiếp →
                        </button>

                    </div>
                )}
            </div>

        </div>

    );
}

export default LearningPage;