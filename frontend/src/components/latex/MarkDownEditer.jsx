import React, { forwardRef, useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import 'katex/dist/katex.min.css';
import './MarkdownEditor.css';

const MarkdownEditor = forwardRef(({value, setValue}, ref) => {
    const [editorHeight, setEditorHeight] = useState(500);

    // Update editor height when window is resized
    useEffect(() => {
        const updateHeight = () => {
            // Get the container height if ref is available
            if (ref && ref.current) {
                const containerHeight = ref.current.parentElement.clientHeight;
                if (containerHeight > 100) { // Ensure we have a reasonable height
                    setEditorHeight(containerHeight - 40); // Subtract padding/margins
                }
            }
        };

        // Initial height update
        updateHeight();

        // Add resize event listener
        window.addEventListener('resize', updateHeight);

        // Cleanup
        return () => window.removeEventListener('resize', updateHeight);
    }, [ref]);

    return (
        <div data-color-mode="light" ref={ref} className='h-full'>
            <MDEditor
                value={value}
                onChange={setValue}
                height={editorHeight}
                preview="edit"
                className="markdown-editor-fullsize"
            />
        </div>
    );
});

export default MarkdownEditor;
