import React, { useEffect, useState, useRef } from "react";
import LatexRenderer from "../latex/RenderLatex";

const StatementTableRow = ({ statements, prefixStatements }) => {
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
        <td ref={tdRef} className="py-3 relative group w-40">
            <div className="relative inline-block w-full">
                {/* Nội dung rút gọn hiển thị */}
                {statements.map((statement, index) => {
                    const maxLength = 50; // Giới hạn ký tự hiển thị
                    const isLongText = statement.content.length > maxLength;
                    const shortText = isLongText ? statement.content.slice(0, maxLength) + "..." : statement.content;

                    return (
                        <div key={index} className="flex w-full">
                            <p className="font-bold">{prefixStatements[index]}&nbsp;</p>
                            <span className="cursor-pointer">
                                <LatexRenderer text={shortText} />
                            </span>
                        </div>
                    );
                })}

                {statements.some(statement => (statement.content.length > 50 || statement.imageUrl)) && (
                    <div
                        className={`absolute left-1/2 -translate-x-1/2 ${tooltipPosition} mt-2 w-max max-w-[20rem] px-4 py-2 bg-black text-white text-sm rounded-md shadow-xl
                            opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50 border border-gray-300`}
                    >
                        {statements.map((statement, index) => (
                            <div key={index} className="flex flex-col">
                                <div className="flex items-center">
                                    <p className="font-bold">{prefixStatements[index]}&nbsp;</p>
                                    <LatexRenderer text={statement.content} />

                                </div>

                                {statement.imageUrl && (
                                    <img src={statement.imageUrl} alt="image" className="max-w-[5rem] " />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </td>
    );
};

export default StatementTableRow;
