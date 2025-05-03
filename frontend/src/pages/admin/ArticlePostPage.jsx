import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import MarkdownEditor from "../../components/latex/MarkDownEditer";
import MarkdownPreview from "@uiw/react-markdown-preview";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "@uiw/react-markdown-preview/markdown.css";
import "katex/dist/katex.min.css";
import { useDispatch, useSelector } from "react-redux";
import { postArticle, fetchArticleById, putArticle } from "../../features/article/articleSlice";
import { fetchImages, postImage, deleteImage } from "../../features/image/imageSlice";
import { setSuccessMessage, setErrorMessage } from "../../features/state/stateApiSlice";
import "../../styles/markdown-preview.css";
import DropMenuBarAdmin from "../../components/dropMenu/OptionBarAdmin";
import { fetchCodesByType } from "../../features/code/codeSlice";
import { useParams, useNavigate } from "react-router-dom";

const ArticlePostPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { images } = useSelector(state => state.images);
    const { article } = useSelector(state => state.articles);
    const { codes } = useSelector(state => state.codes);
    const [isEditing, setIsEditing] = useState(false);
    const [articleId, setArticleId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        type: "",
        class: "",
        chapter: "",
        author: "",
        content: ""
    });
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // We don't need selectedImage state as we're directly inserting images
    const [showImageGallery, setShowImageGallery] = useState(false);
    const editorRef = useRef(null);
    const previewRef = useRef(null);
    const [optionChapter, setOptionChapter] = useState([]);

    // Function to replace LaTeX delimiters for preview
    const processContentForPreview = useMemo(() => {
        if (!formData.content) return "";

        // Replace \( \) with $ $ for inline math
        // Replace \[ \] with $$ $$ for block math
        let processedContent = formData.content
            .replace(/\\\(/g, "$")
            .replace(/\\\)/g, "$")
            .replace(/\\\[/g, "$$")
            .replace(/\\\]/g, "$$");

        return processedContent;
    }, [formData.content]);

    // Fetch images from the article folder when component mounts
    useEffect(() => {
        dispatch(fetchImages("article"));
        dispatch(fetchCodesByType(["chapter", "grade", "article type"]));
    }, [dispatch]);

    // Filter chapter options based on selected class
    useEffect(() => {
        if (Array.isArray(codes["chapter"])) {
            if (formData.class && formData.class.trim() !== "") {
                setOptionChapter(
                    codes["chapter"].filter((code) => code.code.startsWith(formData.class))
                );
            } else {
                setOptionChapter(codes["chapter"]);
            }
        } else {
            setOptionChapter([]);
        }
    }, [codes, formData.class]);

    // Check if we're in edit mode based on URL parameter
    useEffect(() => {
        if (id) {
            setIsEditing(true);
            setArticleId(id);
        }
    }, [id]);

    // If editing an existing article, populate the form with article data
    useEffect(() => {
        if (articleId) {
            dispatch(fetchArticleById(articleId));
        }
    }, [articleId, dispatch]);

    useEffect(() => {
        if (article && isEditing) {
            // Make sure we're setting the exact values from the article
            // This is important for the dropdown menus to work correctly
            setFormData({
                name: article.name || "",
                title: article.title || "",
                type: article.type || "",
                class: article.class || "",
                chapter: article.chapter || "",
                author: article.author || "",
                content: article.content || ""
            });

            // Log the values to help with debugging
            console.log("Article data loaded:", {
                type: article.type,
                class: article.class,
                chapter: article.chapter
            });
        }
    }, [article, isEditing]);

    // Function to scroll preview to bottom
    const scrollPreviewToBottom = useCallback(() => {
        if (previewRef.current) {
            const previewContainer = previewRef.current;
            previewContainer.scrollTop = previewContainer.scrollHeight;
        }
    }, []);

    // Scroll preview to bottom when content changes
    useEffect(() => {
        // Use a short delay to ensure the content has been rendered
        const timer = setTimeout(scrollPreviewToBottom, 100);
        return () => clearTimeout(timer);
    }, [formData.content, scrollPreviewToBottom]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Validate required fields
    const validateForm = () => {
        const requiredFields = ['name', 'type', 'title', 'content', 'author'];
        const missingFields = [];

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            const fieldNames = {
                name: 'Tên bài viết',
                type: 'Loại bài viết',
                title: 'Tiêu đề',
                content: 'Nội dung',
                author: 'Tác giả'
            };

            const missingFieldNames = missingFields.map(field => fieldNames[field]);
            dispatch(setErrorMessage(`Vui lòng điền đầy đủ các trường: ${missingFieldNames.join(', ')}`));
            return false;
        }

        return true;
    };

    // Filter out null, undefined, or empty string values from formData
    const filterNonNullValues = (data) => {
        const filteredData = {};
        Object.keys(data).forEach(key => {
            // Keep the value if it's not null, undefined, or an empty string
            if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
                filteredData[key] = data[key];
            }
        });
        return filteredData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            // Filter out null values before submitting
            const filteredData = filterNonNullValues(formData);

            // Log the filtered data for debugging
            console.log('Filtered form data:', filteredData);

            if (isEditing && articleId) {
                await dispatch(putArticle({ articleId, data: filteredData })).unwrap();
                dispatch(setSuccessMessage("Cập nhật bài viết thành công"));
                navigate("/admin/article-management");
            } else {
                await dispatch(postArticle(filteredData)).unwrap();
                dispatch(setSuccessMessage("Đăng bài viết thành công"));
                navigate("/admin/article-management");
            }
        } catch (error) {
            dispatch(setErrorMessage(error.message || "Có lỗi xảy ra khi lưu bài viết"));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            dispatch(setErrorMessage("Vui lòng chọn file hình ảnh"));
            return;
        }

        setIsUploading(true);
        try {
            const result = await dispatch(postImage({ image: file, folder: "article" })).unwrap();
            if (result && result.file) {
                insertImageToEditor(result.file);
                dispatch(setSuccessMessage("Tải lên hình ảnh thành công"));
                // dispatch(fetchImages("article"));
            }
        } catch (error) {
            dispatch(setErrorMessage("Lỗi khi tải lên hình ảnh: " + error.message));
        } finally {
            setIsUploading(false);
        }
    };

    // Insert image URL to editor content at cursor position or at the end
    const insertImageToEditor = (imageUrl) => {
        const imageMarkdown = `![image](${imageUrl})`;
        const currentContent = formData.content;

        // Insert at the end if we don't have cursor position info
        const newContent = currentContent + "\n" + imageMarkdown + "\n";
        setFormData({ ...formData, content: newContent });

        // Scroll preview to bottom after a short delay to allow rendering
        setTimeout(scrollPreviewToBottom, 100);
    };

    // Handle selecting an image from the gallery
    const handleSelectImage = (imageUrl) => {
        insertImageToEditor(imageUrl);
        setShowImageGallery(false);
    };

    // Handle deleting an image
    const handleDeleteImage = async (imageUrl) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hình ảnh này?")) {
            try {
                await dispatch(deleteImage(imageUrl)).unwrap();
                dispatch(setSuccessMessage("Xóa hình ảnh thành công"));
                // Refresh the image list
                // dispatch(fetchImages("article"));
            } catch (error) {
                dispatch(setErrorMessage("Lỗi khi xóa hình ảnh: " + error.message));
            }
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-700">
                        {isEditing ? "✏️ Chỉnh sửa bài viết" : "📝 Đăng bài viết lý thuyết"}
                    </h2>
                    {isEditing && (
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setArticleId(null);
                                setFormData({
                                    name: "",
                                    title: "",
                                    type: "",
                                    class: "",
                                    chapter: "",
                                    author: "",
                                    content: ""
                                });
                            }}
                            className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                        >
                            Tạo mới
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Tên bài viết"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                        <input
                            type="text"
                            name="title"
                            placeholder="Tiêu đề bài viết"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Loại bài viết</label>
                            <DropMenuBarAdmin
                                selectedOption={formData.type}
                                onChange={(option) => setFormData({ ...formData, type: option })}
                                options={Array.isArray(codes["article type"]) ? codes["article type"] : []}
                                placeholder="Chọn loại bài viết"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Lớp</label>
                            <DropMenuBarAdmin
                                selectedOption={formData.class}
                                onChange={(option) => setFormData({ ...formData, class: option })}
                                options={Array.isArray(codes["grade"]) ? codes["grade"] : []}
                                placeholder="Chọn lớp"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Chương</label>
                            <DropMenuBarAdmin
                                selectedOption={formData.chapter}
                                onChange={(option) => setFormData({ ...formData, chapter: option })}
                                options={optionChapter}
                                placeholder="Chọn chương"
                            />
                        </div>
                    </div>

                    <input
                        type="text"
                        name="author"
                        placeholder="Tác giả"
                        value={formData.author}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />

                    {/* Image Management Controls */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            id="image-upload"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                        />
                        <label
                            htmlFor="image-upload"
                            className={`bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUploading ? "Đang tải lên..." : "Tải lên hình ảnh"}
                        </label>

                        <button
                            type="button"
                            onClick={() => setShowImageGallery(!showImageGallery)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                        >
                            {showImageGallery ? "Ẩn thư viện ảnh" : "Hiện thư viện ảnh"}
                        </button>
                    </div>

                    {/* Image Gallery */}
                    {showImageGallery && (
                        <div className="border rounded-md p-4 bg-gray-50">
                            <h3 className="font-semibold mb-2">Thư viện ảnh</h3>
                            {images["article"] && images["article"].length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {images["article"].map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`Gallery image ${index}`}
                                                className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-90"
                                                onClick={() => handleSelectImage(image)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(image)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Không có hình ảnh nào trong thư viện</p>
                            )}
                        </div>
                    )}

                    {/* Split View: Editor and Preview */}
                    <div className="flex flex-col h-[600px]  lg:flex-row gap-4" style={{ minHeight: "600px" }}>
                        {/* Editor Section */}
                        <div className="flex-1 border h-full rounded-md overflow-hidden flex flex-col">
                            <div className="bg-gray-100 px-4 py-2 border-b">
                                <h3 className="font-semibold">Soạn thảo nội dung</h3>
                            </div>
                            <div className="flex-1 h-full overflow-auto" ref={editorRef}>
                                <MarkdownEditor
                                    value={formData.content}
                                    setValue={(val) => setFormData({ ...formData, content: val })}
                                    height="100%"
                                />
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="flex-1 bg-white border rounded-md overflow-hidden flex flex-col" style={{ minHeight: "600px" }}>
                            <div className="bg-gray-100 px-4 py-2 border-b">
                                <h3 className="font-semibold text-slate-700">👁️ Xem trước bài viết</h3>
                            </div>
                            <div
                                className="p-4 custom-markdown-preview overflow-auto flex-1"
                                ref={previewRef}
                            >
                                <MarkdownPreview
                                    source={processContentForPreview}
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    className="markdown-preview"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            disabled={isUploading || isSubmitting}
                        >
                            {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Đăng bài"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/article-management")}
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default ArticlePostPage;
