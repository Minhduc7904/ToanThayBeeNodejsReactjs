import React, { useState, useRef, useEffect } from "react";

const TooltipTd = ({ text, tooltipText, value, className='', imageUrl }) => {
    const tdRef = useRef(null);
    const [tooltipPosition, setTooltipPosition] = useState("top-full");

    useEffect(() => {
        if (tdRef.current) {
            const rect = tdRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const spaceBelow = windowHeight - rect.bottom;

            // Kiểm tra khoảng trống để hiển thị tooltip
            if (spaceBelow < 50) {
                setTooltipPosition("bottom-full");
            } else {
                setTooltipPosition("top-full");
            }
        }
    }, []);

    return (
        <td
            ref={tdRef}
            className={`py-3 text-center relative group ${value ? "" : "text-yellow-500 font-semibold"} ${className}`}
        >   
            <span className="cursor-pointer">{value ? value : "Chưa phân loại"}</span>

            {tooltipText && (
                <div
                    className={`absolute left-1/2 -translate-x-1/2 ${tooltipPosition} mt-2 w-max max-w-[15rem] px-3 py-2 bg-black text-white text-sm rounded-md shadow-xl
                        opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50 border border-gray-300 break-words`}
                >
                    {tooltipText}
                    {imageUrl && (
                        <img src={imageUrl
                        } alt="Tooltip" className="mt-2 w-full h-32 object-cover rounded" />
                    )}
                </div>
            )}
        </td>
    );
};

export default TooltipTd;
