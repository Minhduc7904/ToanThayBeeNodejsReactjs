import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { setLimit, setSearch, setCurrentPage } from "../../features/filter/filterSlice";
import Pagination from "../Pagination";
import { fetchAttemptByExamIdAdmin } from "../../features/attempt/attemptSlice";
import { FileSpreadsheet } from "lucide-react";
import { exportAttemptsToExcel } from "../../utils/excelExport";

const FilterBarAttemp = ({ examId }) => {
    const dispatch = useDispatch();
    const {search, limit, currentPage, totalPages, totalItems } = useSelector((state) => state.filter);
    const [inputValue, setInputValue] = useState("");

    const options = [5, 10, 15];

    const handleSelectLimit = (e) => {
        const newLimit = parseInt(e.target.value, 10);
        dispatch(setLimit(newLimit));
        dispatch(setCurrentPage(1)); // Reset về trang đầu khi đổi số dòng
    };

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    const handleResetFilters = () => {
        if (search === "" || limit === 10 || currentPage === 1) {
            dispatch(fetchAttemptByExamIdAdmin({ examId, search: "", currentPage: 1, limit: 10 }));
            return;
        }
        setInputValue("");
        dispatch(setSearch(""));
        dispatch(setLimit(10));
        dispatch(setCurrentPage(1));
    };

    const handleExportToExcel = () => {
        try {
            // Fetch all attempts for the exam
            dispatch(fetchAttemptByExamIdAdmin({ examId, search, currentPage: 1, limit: 1000 }))
                .unwrap()
                .then((result) => {
                    if (result && result.data && result.data.data) {
                        // Get the exam name from the first attempt if available
                        const examName = result.data.data[0]?.exam?.name || `Exam_${examId}`;
                        // Export to Excel
                        exportAttemptsToExcel(result.data.data, examName);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching attempts for export:', error);
                });
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(setSearch(inputValue));
        }, 600);
        return () => clearTimeout(delayDebounce);
    }, [inputValue, dispatch]);

    return (
        <div className="w-full px-4 md:px-0">
            {/* Search + Limit */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-2">
                <div className="flex items-center w-full md:w-[22rem] gap-2">
                    <div className="relative flex-1">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                stroke="#9CA3AF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Tìm kiếm học sinh hoặc lớp..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleResetFilters}
                            className="px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm border border-gray-300"
                            title="Đặt lại bộ lọc"
                        >
                            🔄 Đặt lại
                        </button>
                        <button
                            onClick={handleExportToExcel}
                            className="px-3 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm flex items-center gap-1"
                            title="Xuất Excel"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            <span>Excel</span>
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-end flex-row gap-4 w-full">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <label htmlFor="limitSelect" className="font-medium">
                            Số dòng / trang:
                        </label>
                        <div className="relative">
                            <select
                                id="limitSelect"
                                value={limit}
                                onChange={handleSelectLimit}
                                className="appearance-none w-24 border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            >
                                {options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                    stroke="currentColor"
                                >
                                    <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        limit={limit}
                        onPageChange={handlePageChange}
                    />
                </div>

            </div>

            {/* Pagination */}

        </div>
    );
};

export default FilterBarAttemp;
