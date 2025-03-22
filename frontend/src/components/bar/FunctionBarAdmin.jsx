import ButtonFunctionBarAdmin from "../button/ButtonFunctionBarAdmin";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { setLimit, setSearch, setCurrentPage, setIsAddView, setIsFilterView } from "../../features/filter/filterSlice";

const FunctionBarAdmin = () => {
    const dispatch = useDispatch();
    const { limit, currentPage, totalPages, isAddView, isFilterView } = useSelector((state) => state.filter);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpenPage, setIsDropdownOpenPage] = useState(false);
    const dropdownRef = useRef(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setIsDropdownOpenPage(false);
            }
        };

        // Lắng nghe sự kiện click trên document
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const options = [5, 10, 15];
    // const optionsPage = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const optionsPage = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleSelectLimit = (newLimit) => {
        dispatch(setLimit(newLimit)); // Cập nhật limit trong Redux
        setIsDropdownOpen(false); // Đóng dropdown sau khi chọn
    };

    const handleSelectPage = (newPage) => {
        dispatch(setCurrentPage(newPage)); // Cập nhật trang trong Redux
        setIsDropdownOpenPage(false); // Đóng dropdown sau khi chọn
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(setSearch(inputValue)); 
        }, 1000);

        return () => clearTimeout(delayDebounceFn); // Cleanup timeout nếu user tiếp tục nhập
    }, [inputValue, dispatch]);

    const iconAdd = (
        <div data-svg-wrapper className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L12 20M20 12L4 12" stroke="#202325" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        </div>
    )

    const iconFilter = (
        <div data-svg-wrapper className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4.5 7H19.5M7 12H17M10 17H14" stroke="#202325" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )

    const iconExport = (
        <div data-svg-wrapper className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 14.6667V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4.00001 18.6569 4.00001 17L4 14.6667M7.55556 10.2222L12 14.6667M12 14.6667L16.4444 10.2222M12 14.6667V4" stroke="#202325" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )

    return (
        <div className="flex justify-between items-center h-[4.25rem] border-b border-[#E7E7ED] pb-4">
            <div className="flex gap-[0.875rem] h-full items-center">
                <div className="flex items-center h-full gap-[0.5rem]">
                    <div className="w-[15rem] h-full relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="absolute left-[1rem] top-1/2 transform -translate-y-1/2"
                        >
                            <path
                                d="M13.3333 13.3333L10.7555 10.7556M12.1481 7.40741C12.1481 10.0256 10.0256 12.1481 7.40736 12.1481C4.78913 12.1481 2.66663 10.0256 2.66663 7.40741C2.66663 4.78917 4.78913 2.66667 7.40736 2.66667C10.0256 2.66667 12.1481 4.78917 12.1481 7.40741Z"
                                stroke="#131214"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full h-full pl-[2.5rem] pr-[1rem] border border-[#CDCFD0] rounded-[3.25rem] text-[#090a0a] text-[0.875rem] font-['Be Vietnam Pro']"
                        />
                    </div>
                    <ButtonFunctionBarAdmin icon={iconAdd} text={'Thêm mới'} onClick={() => dispatch(setIsAddView(true))} />
                    <ButtonFunctionBarAdmin icon={iconFilter} text={'Bộ lọc'} onClick={() => dispatch(setIsFilterView(true))} />

                </div>
                <div data-svg-wrapper className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2" height="" viewBox="0 0 2 38" fill="none">
                        <path d="M1 1L1 37" stroke="#CDCFD0" strokeLinecap="round" />
                    </svg>
                </div>
                <ButtonFunctionBarAdmin icon={iconExport} text={'Xuất file'} />

            </div>
            <div className="flex items-center h-full gap-[1.25rem]">

                <div
                    className="flex items-center h-full gap-[0.625rem]">
                    <p className="text-[#303437] text-sm font-['Be Vietnam Pro'] text-center font-normal">
                        Số dòng
                    </p>
                    <div className="relative h-full">
                        {/* Button mở dropdown */}
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="relative flex gap-[0.5rem] h-full justify-center items-center py-[0.125rem] px-[0.75rem] border border-[#CDCFD0] rounded-[0.5rem] bg-white z-10"
                        >
                            <p className="text-[#303437] text-sm font-['Be Vietnam Pro'] text-center font-normal">
                                {limit}
                            </p>
                            <div data-svg-wrapper className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
                                    <path d="M11 6.5L8.42679 4.35566C8.17956 4.14963 7.82044 4.14963 7.57321 4.35566L5 6.5M11 9.5L8.42679 11.6443C8.17956 11.8504 7.82044 11.8504 7.57321 11.6443L5 9.5" stroke="#131214" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </button>

                        {/* Dropdown hiển thị chồng lên button */}
                        {isDropdownOpen && (
                            <div className="absolute top-0 left-0 w-full bg-white border border-[#CDCFD0] rounded-[0.5rem] shadow-md z-20"  ref={dropdownRef}>
                                {options.map((option) => (
                                    <p
                                        key={option}
                                        className={`p-2 text-center text-sm cursor-pointer hover:bg-gray-200  ${limit === option ? "bg-gray-100 font-bold" : ""}`}
                                        onClick={() => handleSelectLimit(option)}
                                    >
                                        {option}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>


                </div>

                <div className="flex items-center h-full gap-[0.625rem]">
                    <p className="text-[#303437] text-sm font-['Be Vietnam Pro'] text-center font-normal">
                        Trang
                    </p>
                    <div className="relative h-full">
                        <button
                            onClick={() => setIsDropdownOpenPage(!isDropdownOpenPage)}
                            className="flex gap-[0.5rem] h-full justify-center items-center py-[0.5rem] px-[0.75rem] border border-[#CDCFD0] rounded-[0.5rem]">
                            <p className="text-[#303437] text-sm font-['Be Vietnam Pro'] text-center font-normal">
                                {currentPage}
                            </p>
                            <div data-svg-wrapper className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
                                    <path d="M11.7166 5.23204C11.858 5.08339 12.049 5 12.248 5C12.4471 5 12.6381 5.08339 12.7795 5.23204C12.8493 5.30503 12.9048 5.39204 12.9427 5.48799C12.9805 5.58395 13 5.68694 13 5.79097C13 5.895 12.9805 5.99799 12.9427 6.09395C12.9048 6.18991 12.8493 6.27691 12.7795 6.34991L8.53202 10.7683C8.39026 10.9168 8.19913 11 8 11C7.80087 11 7.60974 10.9168 7.46798 10.7683L3.22049 6.34991C3.15065 6.27691 3.0952 6.18991 3.05735 6.09395C3.01949 5.99799 3 5.895 3 5.79097C3 5.68694 3.01949 5.58395 3.05735 5.48799C3.0952 5.39204 3.15065 5.30503 3.22049 5.23204C3.36192 5.08339 3.55292 5 3.75197 5C3.95101 5 4.14201 5.08339 4.28345 5.23204L8.00163 8.8556L11.7166 5.23204Z" fill="#333333" />
                                </svg>
                            </div>
                        </button>

                        {isDropdownOpenPage && (
                            <div className="absolute top-full mt-[0.5rem] w-full bg-white border border-[#CDCFD0] rounded-[0.5rem] shadow-md z-20 
                    max-h-[200px] overflow-y-auto" ref={dropdownRef}>
                                {optionsPage.map((option) => (
                                    <p
                                        key={option}
                                        className={`p-2 text-center text-sm cursor-pointer hover:bg-gray-200 ${currentPage === option ? "bg-gray-100 font-bold" : ""}`}
                                        onClick={() => handleSelectPage(option)}
                                    >
                                        {option}
                                    </p>
                                ))}
                            </div>
                        )}


                    </div>
                    <p className="text-[#303437] text-sm font-['Be Vietnam Pro'] text-center font-normal">
                        trên {totalPages}
                    </p>
                </div>

            </div>
        </div>
    )
}

export default FunctionBarAdmin;
