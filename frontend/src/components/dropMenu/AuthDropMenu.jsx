import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const DropMenu = ({ title, type, selected, onSelect, className, required }) => {
    const options = type === "gender" ? ["Nữ", "Nam"] : ["10", "11", "12"];
    const [isOpen, setIsOpen] = useState(false);
    const [placeholder, setPlaceholder] = useState("Lựa chọn");
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (type === "gender"){
            setPlaceholder(selected !== -1 ? options[selected] : "Lựa chọn");
        }
        else {
            setPlaceholder(selected ? selected : "Lựa chọn");
        }
        
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-2 w-2/3" ref={dropdownRef}>
            {/* Label */}
            <p className="text-[#666666] text-base font-normal font-bevietnam">{title}
                {required && (
                    <span className="text-red-500"> *</span>
                )}
            </p>

            {/* Dropdown */}
            <div className="relative w-full">
                <button
                    type="button"
                    className={`bg-white px-4 py-2 rounded-xl border border-[#666666] w-full flex justify-between items-center ${className}`}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span
                        className={`text-[#767676] opacity-50 ${selected !== -1 ? "opacity-100 text-black" : ""}`}
                    >
                        {placeholder}
                    </span>
                    <ChevronDown size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Danh sách tùy chọn */}
                {isOpen && (
                    <div className="absolute left-0 w-full mt-0.5 bg-white border border-[#666666] rounded-xl shadow-md z-10">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className="py-2 px-4 hover:bg-gray-200 cursor-pointer rounded-xl"
                                onClick={() => {
                                    const value = type === "gender" ? index : option;
                                    onSelect(value);
                                    setIsOpen(false);
                                    setPlaceholder(option);
                                }}
                            >
                                {option}
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
};

export default DropMenu;
