import InputSearch from "../input/InputSearch";
import TickSideBar from "./TickSideBar";
import { useState } from "react";

const FilterExamSidebar = () => {

    const [isShowClass, setIsShowClass] = useState(false);
    const [isShowExam, setIsShowExam] = useState(false);
    const [isShowChapter, setIsShowChapter] = useState(false);

    return (
        <div className="w-1/5 h-full p-8 bg-white inline-flex flex-col justify-start items-start gap-3 overflow-y-auto">
            <InputSearch
                placeholder="Tìm kiếm đề thi"
                className="w-full h-10"
            />
            <div className="justify-start text-blue-600 text-sm font-medium font-['Be_Vietnam_Pro']">Tất cả đề</div>
            <div className="flex flex-col justify-start items-start gap-2">
                <button className="flex items-center gap-2 cursor-pointer" onClick={() => setIsShowClass(!isShowClass)}>
                    <p className="text-zinc-900 text-sm font-medium font-['Be_Vietnam_Pro']">
                        Lớp
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`transition-transform duration-300 ${isShowClass ? "rotate-180" : ""}`}
                    >
                        <path d="M6.82367 2.40928C7.36267 1.41261 8.79567 1.42061 9.32367 2.42328L14.5013 12.2573C14.998 13.2006 14.314 14.3339 13.248 14.3339H2.75167C1.67834 14.3339 0.995007 13.1873 1.50567 12.2433L6.82367 2.40928Z" fill="black" />
                    </svg>
                </button>
                <div
                    className={`overflow-hidden flex flex-col gap-2 transition-all duration-300 ease-in-out ${isShowClass ? "max-h-min opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <TickSideBar title="Lớp 10" />
                    <TickSideBar title="Lớp 11" />
                    <TickSideBar title="Lớp 12" />
                </div>
            </div>
            <div className="h-[1px] w-full bg-neutral-200"></div>
            <div className="flex flex-col justify-start items-start gap-2">
                <button className="flex items-center gap-2 cursor-pointer" onClick={() => setIsShowChapter(!isShowChapter)}>
                    <p className="text-zinc-900 text-sm font-medium font-['Be_Vietnam_Pro']">
                        Đề ôn tập
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`transition-transform duration-300 ${isShowChapter ? "rotate-180" : ""}`}
                    >
                        <path d="M6.82367 2.40928C7.36267 1.41261 8.79567 1.42061 9.32367 2.42328L14.5013 12.2573C14.998 13.2006 14.314 14.3339 13.248 14.3339H2.75167C1.67834 14.3339 0.995007 13.1873 1.50567 12.2433L6.82367 2.40928Z" fill="black" />
                    </svg>
                </button>
                <div
                    className={`overflow-hidden flex flex-col gap-2 transition-all duration-300 ease-in-out ${isShowChapter ? "max-h-auto opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="justify-start text-zinc-900 text-sm font-light font-['Be_Vietnam_Pro']">Chọn lớp để hiển thị chương</div>
                    <TickSideBar title="Chương 1" />
                    <TickSideBar title="Chương 2" />
                </div>
            </div>
            <div className="h-[1px] w-full bg-neutral-200"></div>

            <div className="flex flex-col justify-start items-start gap-2">
                <button className="flex items-center gap-2 cursor-pointer" onClick={() => setIsShowExam(!isShowExam)}>
                    <p className="text-zinc-900 text-sm font-medium font-['Be_Vietnam_Pro']">
                        Đề thi
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`transition-transform duration-300 ${isShowExam ? "rotate-180" : ""}`}
                    >
                        <path d="M6.82367 2.40928C7.36267 1.41261 8.79567 1.42061 9.32367 2.42328L14.5013 12.2573C14.998 13.2006 14.314 14.3339 13.248 14.3339H2.75167C1.67834 14.3339 0.995007 13.1873 1.50567 12.2433L6.82367 2.40928Z" fill="black" />
                    </svg>
                </button>
                <div
                    className={`overflow-hidden flex flex-col gap-2 transition-all duration-300 ease-in-out ${isShowExam ? "max-h-auto opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <TickSideBar title="Đề thi giữa kì 1" />
                    <TickSideBar title="Đề thi cuối kì 1" />
                    <TickSideBar title="Đề thi giữa kì 2" />
                    <TickSideBar title="Đề thi cuối kì 2" />
                    <TickSideBar title="Đề ôn thi THPT" />
                    <TickSideBar title="Đề thi THPT" />
                    <TickSideBar title="Đề thi ĐGNL" />
                    <TickSideBar title="Đề thi ĐGTD" />
                </div>
            </div>
            <div className="h-[1px] w-full bg-neutral-200"></div>
        </div>
    );
}

export default FilterExamSidebar;