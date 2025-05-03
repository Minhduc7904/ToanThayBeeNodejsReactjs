import TickSideBar from "./TickSideBar";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCodesByType } from "../../features/code/codeSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import { fetchPublicExams } from "../../features/exam/examSlice";
import { resetFilters, setSelectedGrade, setSelectedChapters, setSelectedExamTypes, setIsSearch } from "../../features/filter/filterSlice";

const FilterExamSidebar = ({ isMobile = false, onClose = () => { } }) => {
    const [isShowClass, setIsShowClass] = useState(true);
    const [isShowExam, setIsShowExam] = useState(true);
    const [isShowChapter, setIsShowChapter] = useState(true);
    const { codes } = useSelector((state) => state.codes);
    const { limit, currentPage, sortOrder, isSearch, selectedGrade, selectedChapters, selectedExamTypes } = useSelector((state) => state.filter);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [didInit, setDidInit] = useState(false); // 👉 Thêm cờ kiểm soát mount đầu tiên

    useEffect(() => {
        if (!didInit) {
            dispatch(resetFilters());
            setDidInit(true);
        }
    }, [dispatch, didInit]);
    
    const fetchExams = (override = {}) => {
        dispatch(fetchPublicExams({
            page: currentPage,
            limit: 10,
            sortOrder,
            typeOfExam: override.typeOfExam ?? selectedExamTypes,
            class: override.class === null ? override.class : selectedGrade,
            chapter: override.chapter ?? selectedChapters,
            search
        }));
    }

    useEffect(() => {
        if (didInit) fetchExams()
    }, [dispatch, currentPage, didInit]);

    useEffect(() => {
        if (selectedChapters.length === 0 && selectedGrade === null && selectedExamTypes.length === 0 && search === "") {
            dispatch(setIsSearch(false));

        }
    }, [dispatch, selectedChapters, selectedGrade, selectedExamTypes, search]);

    const handleClick = () => {
        setLoading(true);
        dispatch(fetchPublicExams({ page: currentPage, limit: 10, sortOrder, typeOfExam: selectedExamTypes, class: selectedGrade, chapter: selectedChapters, search }))
            .then(() => {
                setLoading(false);
                onClose();
            })
        dispatch(setIsSearch(true));
    }

    const toggleItem = (codeList, dispatchSetAction) => (code) => (isChecked) => {
        const newList = isChecked
            ? [...codeList, code]
            : codeList.filter((item) => item !== code);

        dispatch(dispatchSetAction(newList));
    };

    const handleSelectGrade = (gradeCode) => (isChecked) => {
        dispatch(setSelectedGrade(isChecked ? gradeCode : null))
        setSelectedChapters([]); // reset selected chapters when grade changes
    };


    useEffect(() => {
        dispatch(fetchCodesByType(['chapter', 'grade', 'exam type']));
    }, [dispatch]);


    const sidebarContent = (
        <div className="w-full h-full px-6 py-8 bg-white flex flex-col gap-6 overflow-y-auto hide-scrollbar">
            <InputSearch
                placeholder="Tìm kiếm đề thi..."
                className="w-full h-10"
                value={search}
                setValue={setSearch}
                loading={loading}
            />
            <p
                onClick={() => {
                    dispatch(setIsSearch(false));
                    setSearch("")
                    dispatch(setSelectedGrade(null));
                    dispatch(setSelectedChapters([]));
                    dispatch(setSelectedExamTypes([]));
                    fetchExams(
                        { class: null, chapter: [], typeOfExam: [] } // reset filters
                    );
                }}
                className="text-blue-600 text-sm w-fit font-medium cursor-pointer">Tất cả đề</p>

            <FilterGroup title="Lớp" isOpen={isShowClass} setIsOpen={setIsShowClass}>
                {codes?.['grade']?.map((code) => (
                    <TickSideBar
                        title={code.description}
                        key={code.code}
                        type="radio"
                        isChecked={selectedGrade === code.code}
                        onClick={handleSelectGrade(code.code)}
                    />
                ))}
            </FilterGroup>

            <FilterGroup title="Đề ôn tập" isOpen={isShowChapter} setIsOpen={setIsShowChapter}>
                <p className="text-xs text-gray-500 italic">Chọn lớp để hiển thị chương</p>

                {selectedGrade && (
                    codes?.['chapter']
                        ?.filter((code) => code.code.startsWith(selectedGrade) && code.code.length === 4)
                        ?.map((code) => (
                            <TickSideBar
                                title={code.description}
                                key={code.code}
                                type="checkbox"
                                isChecked={selectedChapters.includes(code.code)}
                                onClick={toggleItem(selectedChapters, setSelectedChapters)(code.code)}
                            />
                        ))
                )}
            </FilterGroup>

            <FilterGroup title="Đề thi" isOpen={isShowExam} setIsOpen={setIsShowExam}>
                {codes?.['exam type']?.map((code) => (
                    <TickSideBar
                        title={code.description}
                        key={code.code}
                        type="checkbox"
                        isChecked={selectedExamTypes.includes(code.code)}
                        onClick={toggleItem(selectedExamTypes, setSelectedExamTypes)(code.code)}
                    />

                ))}
            </FilterGroup>
            <button
                onClick={handleClick}
                className="mt-4 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-700 transition-all"
            >
                Tìm kiếm
            </button>
        </div>
    );

    if (!isMobile) {
        return (
            <div className="hidden lg:block sticky top-4 h-full w-full bg-white flex-shrink-0 overflow-y-auto hide-scrollbar rounded-xl shadow-sm">
                {sidebarContent}

            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 pb-10 z-50 w-4/5 max-w-[320px] h-full bg-white shadow-lg"
            >
                <div className="flex justify-end p-4">
                    <button onClick={onClose} className="text-xl font-bold text-gray-600">×</button>
                </div>
                {sidebarContent}
            </motion.div>
        </AnimatePresence>
    );
};

const FilterGroup = ({ title, isOpen, setIsOpen, children }) => (
    <div className="w-full">
        <button className="flex justify-between items-center w-full cursor-pointer mb-2" onClick={() => setIsOpen(!isOpen)}>
            <p className="text-sm font-medium text-zinc-800">{title}</p>
            <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "opacity-100" : "max-h-0 opacity-0"} flex flex-col gap-2 pl-2`}>
            {children}
        </div>
        <div className="mt-4 h-[1px] w-full bg-neutral-200" />
    </div>
);

const InputSearch = ({ value, setValue, placeholder = "Tìm kiếm...", className = "", loading = false }) => {
    return (
        <div className={`relative ${className}`}>
            <div className="relative w-full h-full">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-10 pl-10 pr-10 text-sm text-gray-700 placeholder-gray-400 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all duration-150"
                />

                {!loading && (
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z"
                                fill="#9CA3AF"
                            />
                        </svg>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                        <LoadingSpinner size="1.25rem" color="border-gray-400" />
                    </div>
                )}
            </div>
        </div>
    );
};


export default FilterExamSidebar;
