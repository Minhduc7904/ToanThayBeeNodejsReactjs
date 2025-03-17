import { useState, useEffect, useRef } from "react";

const SuggestInputBarAdmin = ({ options, placeholder = "Chọn một mục", selectedOption, onChange }) => {
    const [inputValue, setInputValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([...options]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Khi có selectedOption, cập nhật giá trị input ban đầu
    useEffect(() => {
        if (selectedOption) {
            const selected = options.find((option) => option.code === selectedOption);
            if (selected) {
                setInputValue(selected.description);
            }
        }
    }, [selectedOption, options]);

    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        // Lọc các option theo giá trị input (không phân biệt chữ hoa thường)
        const filtered = options.filter((option) =>
            option.description.toLowerCase().includes(value.toLowerCase())
        );
        onChange(options.find((option) => option.description === value)?.code);
        setFilteredOptions(filtered);
        setShowSuggestions(true);
    };

    const handleOptionClick = (option) => {
        setInputValue(option.description);
        onChange(option.code);
        setShowSuggestions(false);
    };

    // Ẩn suggestions khi click bên ngoài component
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full flex-1">
            <input
                type="text"
                className="w-full bg-white border border-gray-300 rounded-[0.5rem] py-[0.75rem] px-[1rem] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#303437] text-lg font-medium font-['Inter'] leading-normal"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && (
                <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-y-auto max-h-60">
                    {filteredOptions?.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.description}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-500">Không có dữ liệu</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SuggestInputBarAdmin;
