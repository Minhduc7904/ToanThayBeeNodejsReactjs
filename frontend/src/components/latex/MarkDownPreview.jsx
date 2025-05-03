import React from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const MarkdownPreviewWithMath = ({ content }) => {
    return (
        <MarkdownPreview
            source={content}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
        />
    );
};

export default MarkdownPreviewWithMath;
