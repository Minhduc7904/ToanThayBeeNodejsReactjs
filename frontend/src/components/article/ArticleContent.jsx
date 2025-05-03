import React, { useMemo } from 'react';
import MarkdownPreview from "@uiw/react-markdown-preview";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "@uiw/react-markdown-preview/markdown.css";
import "katex/dist/katex.min.css";
import "../../styles/markdown-preview.css";

const ArticleContent = ({ content }) => {
    // Process content to replace LaTeX delimiters
    const processedContent = useMemo(() => {
        if (!content) return "";

        // Replace \( \) with $ $ for inline math
        // Replace \[ \] with $$ $$ for block math
        let processed = content
            .replace(/\\\(/g, "$")
            .replace(/\\\)/g, "$")
            .replace(/\\\[/g, "$$")
            .replace(/\\\]/g, "$$");

        return processed;
    }, [content]);

    return (
        <div className="bg-white border rounded-md overflow-hidden mb-6">
            <div className="p-6">
                <div className="custom-markdown-preview">
                    <MarkdownPreview
                        source={processedContent}
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        className="markdown-preview"
                    />
                </div>
            </div>
        </div>
    );
};

export default ArticleContent;
