import React, { useEffect, useState, useRef } from "react";
import LatexRenderer from "../latex/RenderLatex";

const QuestionTableRow = ({ question }) => {
    const maxLength = 100;
    const isLongText = question.content.length > maxLength;
    const shortText = isLongText ? question.content.slice(0, maxLength) + "..." : question.content;

    const tdRef = useRef(null);
    const [tooltipPosition, setTooltipPosition] = useState("top-full");

    useEffect(() => {
        if (tdRef.current) {
            const rect = tdRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const spaceBelow = windowHeight - rect.bottom;

            // Nếu không đủ khoảng trống phía dưới, hiển thị tooltip ở trên
            if (spaceBelow < 200) {
                setTooltipPosition("bottom-full");
            } else {
                setTooltipPosition("top-full");
            }
        }
    }, []);

    return (
        <td ref={tdRef} className="py-3 relative group">
            <div className="relative inline-block">
                {/* Nội dung rút gọn */}
                <span className="cursor-pointer">
                    <LatexRenderer text={shortText} />
                </span>

                {/* Tooltip tự động đổi vị trí */}
                {(isLongText || question.imageUrl) && (
                    <div
                        className={`absolute left-[80%] -translate-x-1/2 ${tooltipPosition} mt-2 w-max max-w-[20rem] px-4 py-2 bg-black text-white text-sm rounded-md shadow-xl
                            opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50 border border-gray-300`}
                    >

                        <LatexRenderer text={question.content} />
                        {question.imageUrl && (
                            <img src={question.imageUrl} alt="image" className="max-w-[5rem] " />
                        )}
                    </div>
                )}
            </div>
        </td>
    );
};

export default QuestionTableRow;
