import { Check } from "lucide-react";

const TickSideBar = ({ title, onClick, isChecked = false, type = "radio" }) => {
    const handleClick = () => {
        onClick?.(!isChecked);
    };

    const baseClasses = "w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all duration-150";
    const radioClass = "rounded-full border border-neutral-400";
    const checkboxClass = `rounded border 
        ${isChecked ? "bg-blue-500 border-blue-500" : "bg-white border-neutral-400"}`;

    return (
        <div
            onClick={handleClick}
            className="flex items-start gap-2 cursor-pointer"
        >
            {/* Nút chọn */}
            <div className={`${baseClasses} ${type === "radio" ? radioClass : checkboxClass}`}>
                {type === "radio" && isChecked && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
                {type === "checkbox" && isChecked && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
            </div>

            {/* Tiêu đề */}
            <div className="text-zinc-900 text-sm font-normal font-['Be_Vietnam_Pro'] break-words">
                {title}
            </div>
        </div>
    );
};

export default TickSideBar;
