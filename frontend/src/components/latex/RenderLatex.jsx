import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

const LatexRenderer = ({ text, className = '' }) => {
    // Chuyển đổi `\( ... \)` thành `$ ... $` và `\[ ... \]` thành `$$ ... $$`
    if (text === null) return null;
    const formattedText = text
        .replace(/\\\(/g, "$") // Thay \( thành $
        .replace(/\\\)/g, "$") // Thay \) thành $
        .replace(/\\\[/g, "$$") // Thay \[ thành $$
        .replace(/\\\]/g, "$$"); // Thay \] thành $$

    // Phân tách và hiển thị LaTeX đúng định dạng
    const elements = formattedText.split(/(\$\$.*?\$\$|\$.*?\$)/).map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
            return <BlockMath key={index}>{part.slice(2, -2)}</BlockMath>;
        } else if (part.startsWith("$") && part.endsWith("$")) {
            return <InlineMath key={index}>{part.slice(1, -1)}</InlineMath>;
        } else {
            return part;
        }
    });

    return <div className={`${className}`}>{elements}</div>;
};

export default LatexRenderer;
