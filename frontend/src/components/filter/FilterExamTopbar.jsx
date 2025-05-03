import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCodesByType } from "../../features/code/codeSlice";
import { fetchPublicExams } from "../../features/exam/examSlice";
import { resetFilters, setSelectedGrade, setSelectedChapters, setSelectedExamTypes, setIsSearch } from "../../features/filter/filterSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import { Search, X, Filter } from "lucide-react";

const FilterExamTopbar = () => {
    const { codes } = useSelector((state) => state.codes);
    const { limit, currentPage, sortOrder, isSearch, selectedGrade, selectedChapters, selectedExamTypes } = useSelector((state) => state.filter);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [didInit, setDidInit] = useState(false);
    const [isClassroomExam, setIsClassroomExam] = useState(null);
    // State for mobile filter
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'classroom', 'self'

    // Ref for mobile filter panel
    const mobileFilterRef = useRef(null);

    useEffect(() => {
        if (!didInit) {
            dispatch(resetFilters());
            setDidInit(true);
        }
    }, [dispatch, didInit]);

    useEffect(() => {
        dispatch(fetchCodesByType(['chapter', 'grade', 'exam type']));
    }, [dispatch]);

    const fetchExams = (override = {}) => {
        // console.log("fetchExams", override)

        // Only apply filters if isSearch is true or if explicitly overridden
        const shouldApplyFilters = isSearch || override.applyFilters;

        dispatch(fetchPublicExams({
            page: currentPage,
            limit: 10,
            sortOrder,
            typeOfExam: shouldApplyFilters ? (override.typeOfExam ?? selectedExamTypes) : [],
            class: shouldApplyFilters ? (override.class === null ? override.class : selectedGrade) : null,
            chapter: shouldApplyFilters ? (override.chapter ?? selectedChapters) : [],
            search: shouldApplyFilters ? search : "",
            isClassroomExam: override.isClassroomExam
        }));
    }

    // Only fetch exams when page changes, not when filters change
    useEffect(() => {
        if (didInit || isSearch) {
            fetchExams({ isClassroomExam });
        }
    }, [dispatch, didInit, isSearch]);

    useEffect(() => {
        if (didInit) {
            fetchExams({ isClassroomExam });
        }
    }, [currentPage]);

    useEffect(() => {
        if (selectedChapters.length === 0 && selectedGrade === null && selectedExamTypes.length === 0 && search === "") {
            dispatch(setIsSearch(false));
        }
    }, [dispatch, selectedChapters, selectedGrade, selectedExamTypes, search]);

    // Handle click outside to close mobile filter
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileFilterRef.current && !mobileFilterRef.current.contains(e.target)) {
                setShowMobileFilter(false);
            }
        };

        if (showMobileFilter) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMobileFilter]);

    const handleSearch = () => {
        setLoading(true);
        // Set isSearch to true first so filters will be applied
        dispatch(setIsSearch(true));

        dispatch(fetchPublicExams({
            page: currentPage,
            limit: 10,
            sortOrder,
            typeOfExam: selectedExamTypes,
            class: selectedGrade,
            chapter: selectedChapters,
            search,
            isClassroomExam
        }))
            .then(() => {
                setLoading(false);
            });
    }

    const resetAllFilters = () => {
        setSearch("");
        dispatch(setSelectedGrade(null));
        dispatch(setSelectedChapters([]));
        dispatch(setSelectedExamTypes([]));

        // Set isSearch to true to ensure filters are applied (in this case, empty filters)
        dispatch(setIsSearch(true));

        // Apply the reset filters immediately
        setLoading(true);
        dispatch(fetchPublicExams({
            page: currentPage,
            limit: 10,
            sortOrder,
            typeOfExam: [],
            class: null,
            chapter: [],
            search: "",
            isClassroomExam
        }))
            .then(() => {
                setLoading(false);
            });
    }

    const toggleItem = (codeList, dispatchSetAction) => (code) => (isChecked) => {
        const newList = isChecked
            ? [...codeList, code]
            : codeList.filter((item) => item !== code);

        dispatch(dispatchSetAction(newList));
    };

    const handleSelectGrade = (gradeCode) => (isChecked) => {
        dispatch(setSelectedGrade(isChecked ? gradeCode : null));
        dispatch(setSelectedChapters([])); // reset selected chapters when grade changes
    };



    return (

        <div className="w-full bg-gray-100 shadow-sm px-4 pt-4 mb-4">
            <div className="flex flex-col gap-4 max-w-[70rem] mx-auto">
                {/* Search bar and buttons */}
                <p className="text-4xl font-bold text-zinc-800 mb-4">Thư viện đề thi</p>

                {/* Desktop filters - always visible */}
                {/* Grade filter */}
                <div className="mb-4">
                    <h3 className="text-base font-medium text-gray-700 mb-2">Lớp</h3>
                    <div className="flex flex-wrap gap-2">
                        {codes?.['grade']?.map((code) => (
                            <div
                                key={code.code}
                                onClick={() => handleSelectGrade(code.code)(selectedGrade !== code.code)}
                                className={`px-3 py-1.5 rounded-lg text-base cursor-pointer ${selectedGrade === code.code
                                    ? 'bg-blue-50 text-blue-700 border border-blue-300 font-medium'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                {code.description}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chapter filter */}
                <div className="mb-4">
                    <h3 className="text-base font-medium text-gray-700 mb-2">Chương</h3>
                    {!selectedGrade ? (
                        <div className="text-base text-gray-500 italic">
                            Chọn lớp để hiển thị chương
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                            {codes?.['chapter']
                                ?.filter((code) => code.code.startsWith(selectedGrade) && code.code.length === 4)
                                ?.map((code) => (
                                    <div
                                        key={code.code}
                                        onClick={() => {
                                            toggleItem(selectedChapters, setSelectedChapters)(code.code)(
                                                !selectedChapters.includes(code.code)
                                            );
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-base cursor-pointer ${selectedChapters.includes(code.code)
                                            ? 'bg-blue-50 text-blue-700 border border-blue-300 font-medium'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                            }`}
                                    >
                                        {code.description}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>

                {/* Exam type filter */}
                <div className="mb-4">
                    <h3 className="text-base font-medium text-gray-700 mb-2">Loại đề</h3>
                    <div className="flex flex-wrap gap-2">
                        {codes?.['exam type']?.map((code) => (
                            <div
                                key={code.code}
                                onClick={() => {
                                    toggleItem(selectedExamTypes, setSelectedExamTypes)(code.code)(
                                        !selectedExamTypes.includes(code.code)
                                    );
                                }}
                                className={`px-3 py-1.5 rounded-lg text-base cursor-pointer ${selectedExamTypes.includes(code.code)
                                    ? 'bg-blue-50 text-blue-700 border border-blue-300 font-medium'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                {code.description}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <div className="relative w-full sm:w-2/3 md:w-1/2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm đề thi..."
                            className="w-full h-10 pl-10 pr-10 text-sm text-gray-700 placeholder-gray-400 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all duration-150"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        {loading && (
                            <div className="absolute inset-y-0 right-3 flex items-center">
                                <LoadingSpinner color="border-black" size="1.25rem" />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={resetAllFilters}
                        className="text-blue-600 text-sm font-medium hover:underline whitespace-nowrap"
                    >
                        Xóa bộ lọc
                    </button>
                    <button
                        onClick={handleSearch}
                        className="bg-slate-700 hover:bg-slate-600 text-white hidden sm:block text-sm font-medium py-2 px-4 rounded-lg transition-all ml-auto"
                    >
                        Tìm kiếm
                    </button>

                    {/* Mobile filter button */}

                </div>
                <button
                    onClick={handleSearch}
                    className="bg-slate-700 hover:bg-slate-600 text-white block sm:hidden w-full text-sm font-medium py-2 px-4 rounded-lg transition-all ml-auto"
                >
                    Tìm kiếm
                </button>
                <div className="flex gap-6 border-b border-gray-200">
                    <div
                        className={`p-2 cursor-pointer ${activeTab === 'all' ? 'font-medium text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => {
                            setIsClassroomExam(null);
                            setActiveTab('all');
                            // Apply filters only if search has been clicked
                            fetchExams({
                                isClassroomExam: null,
                                applyFilters: isSearch
                            });
                        }}
                    >
                        Tất cả
                    </div>
                    <div
                        className={`p-2 cursor-pointer ${activeTab === 'classroom' ? 'font-medium text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => {
                            setIsClassroomExam(true);
                            setActiveTab('classroom');
                            // Apply filters only if search has been clicked
                            fetchExams({
                                isClassroomExam: true,
                                applyFilters: isSearch
                            });
                        }}
                    >
                        Đề trên lớp
                    </div>
                    <div
                        className={`p-2 cursor-pointer ${activeTab === 'self' ? 'font-medium text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => {
                            setIsClassroomExam(false);
                            setActiveTab('self');
                            // Apply filters only if search has been clicked
                            fetchExams({
                                isClassroomExam: false,
                                applyFilters: isSearch
                            });
                        }}
                    >
                        Đề tự luyện
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterExamTopbar;
