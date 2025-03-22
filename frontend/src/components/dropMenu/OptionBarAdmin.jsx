import { useState, useEffect, useRef } from "react";

const DropMenuBarAdmin = ({ options, placeholder = "Chọn một mục", selectedOption, onChange, className='' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [p, setP] = useState(placeholder);

    const handleSelect = (option) => {
        onChange(option.code);
        setP(option.description);
        setIsOpen(false); // Đóng dropdown sau khi chọn
    };

    useEffect(() => {
        if (selectedOption || selectedOption === false) {
            setP(options.find((option) => option.code === selectedOption)?.description);
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className={`relative flex-1 ${className ? className : 'w-full'} text-md`}>
            {/* Nút chọn */}
            <button
                type="button"
                className="w-full bg-white border flex items-center justify-between border-gray-300 rounded-[0.5rem] py-[0.5rem] px-[0.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`text-[#303437] font-medium font-['Inter'] ${selectedOption === true ? "text-green-500" : selectedOption === false ? "text-red-500" : ""}`}>
                    {(selectedOption || selectedOption === false) ? p : placeholder}
                </span>
                <div className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L11.2929 14.6854C11.6834 15.1049 12.3166 15.1049 12.7071 14.6854L18 9" stroke="#131214" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            </button>

            {/* Danh sách dropdown */}
            {isOpen && (
                <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-y-auto max-h-60">
                    {options?.length > 0 ? (
                        options.map((option, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSelect(option)}
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

export default DropMenuBarAdmin;
