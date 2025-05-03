import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateAchievementImage,
    fetchAchievementImages,
    fetchAchievementImageById,
    fetchAchievementCategories
} from "../../features/achievement/achievementSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import ImageUpload from "../image/UploadImage";

const EditAchievementImageModal = ({ onClose, imageId }) => {
    const dispatch = useDispatch();
    const { loading, currentImage, categories } = useSelector(state => state.achievements);
    const { currentPage, limit, sortOrder } = useSelector(state => state.filter);

    const [imageData, setImageData] = useState({
        category_id: "",
        caption: "",
        display_order: 0,
        is_featured: false
    });
    const [image, setImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState("");

    // Fetch image data and categories when component mounts
    useEffect(() => {
        dispatch(fetchAchievementCategories());

        if (imageId) {
            dispatch(fetchAchievementImageById(imageId));
        }
    }, [dispatch, imageId]);

    // Update form when image data is loaded
    useEffect(() => {
        if (currentImage) {
            // Convert escaped newlines back to actual newlines
            const processedCaption = currentImage.caption
                ? currentImage.caption.replace(/\\n/g, '\n')
                : "";

            setImageData({
                category_id: currentImage.category_id || "",
                caption: processedCaption,
                display_order: currentImage.display_order || 0,
                is_featured: currentImage.is_featured || false
            });
            setCurrentImageUrl(currentImage.image_url || "");
        }
    }, [currentImage]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setImageData({
            ...imageData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(updateAchievementImage({ id: imageId, imageData, image }))
            .unwrap()
            .then(() => {
                onClose();
                dispatch(fetchAchievementImages({
                    category_id: imageData.category_id,
                    currentPage,
                    limit,
                    sortOrder: sortOrder.toUpperCase()
                }));
            })
            .catch(error => {
                console.error("Error updating image:", error);
                alert("Lỗi khi cập nhật hình ảnh: " + (error.message || "Vui lòng thử lại"));
            });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner color="border-black" size="3rem" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Danh mục <span className="text-red-500">*</span>
                    </div>
                    <select
                        name="category_id"
                        required
                        value={imageData.category_id}
                        onChange={handleChange}
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                        disabled // Category cannot be changed for existing images
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Chú thích
                    </div>
                    <textarea
                        name="caption"
                        value={imageData.caption}
                        onChange={handleChange}
                        className="w-full h-20 py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-start gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal whitespace-pre-wrap"
                        placeholder="Nhập chú thích cho hình ảnh (hỗ trợ xuống dòng)"
                    />
                </div>
            </div>

            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Thứ tự hiển thị <span className="text-red-500">*</span>
                    </div>
                    <input
                        type="number"
                        name="display_order"
                        required
                        value={imageData.display_order}
                        onChange={handleChange}
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                        placeholder="Nhập thứ tự hiển thị (số nguyên)"
                    />
                </div>
            </div>

            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_featured"
                            id="is_featured"
                            checked={imageData.is_featured}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_featured" className="text-[#090a0a] text-lg font-medium">
                            Đặt làm ảnh nổi bật
                        </label>
                    </div>
                    <p className="text-sm text-gray-500">
                        Ảnh nổi bật sẽ được hiển thị đầu tiên trong danh mục
                    </p>
                </div>
            </div>

            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Hình ảnh hiện tại
                    </div>
                    {currentImageUrl && (
                        <div className="w-full max-w-md">
                            <img
                                src={currentImageUrl}
                                alt="Current"
                                className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-300"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Tải lên hình ảnh mới (không bắt buộc)
                    </div>
                    <ImageUpload
                        image={image}
                        setImage={setImage}
                        inputId="achievement-image-upload-edit"
                    />
                </div>
            </div>

            <div className="self-stretch px-1 flex justify-end items-center gap-4 mt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Cập nhật
                </button>
            </div>
        </form>
    );
};

export default EditAchievementImageModal;
