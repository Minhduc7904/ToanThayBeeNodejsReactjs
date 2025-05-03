import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateAchievementCategory,
    fetchAchievementCategories,
    fetchAchievementCategoryById
} from "../../features/achievement/achievementSlice";
import LoadingSpinner from "../loading/LoadingSpinner";

const EditAchievementCategoryModal = ({ onClose, categoryId }) => {
    const dispatch = useDispatch();
    const { loading, currentCategory } = useSelector(state => state.achievements);
    const { search, currentPage, limit, sortOrder } = useSelector(state => state.filter);

    const [categoryData, setCategoryData] = useState({
        label: "",
        title: "",
        description: "",
        display_order: 0
    });

    // Fetch category data when component mounts
    useEffect(() => {
        if (categoryId) {
            dispatch(fetchAchievementCategoryById(categoryId));
        }
    }, [dispatch, categoryId]);

    // Update form when category data is loaded
    useEffect(() => {
        if (currentCategory) {
            // Convert escaped newlines back to actual newlines
            const processedDescription = currentCategory.description
                ? currentCategory.description.replace(/\\n/g, '\n')
                : "";

            setCategoryData({
                label: currentCategory.label || "",
                title: currentCategory.title || "",
                description: processedDescription,
                display_order: currentCategory.display_order || 0
            });
        }
    }, [currentCategory]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCategoryData({
            ...categoryData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(updateAchievementCategory({ id: categoryId, categoryData }))
            .unwrap()
            .then(() => {
                onClose();
                dispatch(fetchAchievementCategories({
                    search,
                    currentPage,
                    limit,
                    sortOrder: sortOrder.toUpperCase(),
                    sortBy: 'display_order'
                }));
            })
            .catch(error => {
                console.error("Error updating category:", error);
                alert("Lỗi khi cập nhật danh mục: " + (error.message || "Vui lòng thử lại"));
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
                        Mã danh mục
                    </div>
                    <input
                        type="text"
                        value={categoryId}
                        disabled
                        className="w-full py-[0.5rem] px-[0.5rem] bg-gray-100 text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-gray-500 font-medium font-['Inter'] leading-normal"
                    />
                </div>
            </div>

            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Nhãn <span className="text-red-500">*</span>
                    </div>
                    <input
                        type="text"
                        name="label"
                        required
                        value={categoryData.label}
                        onChange={handleChange}
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                        placeholder="Nhập nhãn hiển thị (ví dụ: Đại học 2023-2024)"
                    />
                </div>
            </div>

            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Tiêu đề <span className="text-red-500">*</span>
                    </div>
                    <input
                        type="text"
                        name="title"
                        required
                        value={categoryData.title}
                        onChange={handleChange}
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                        placeholder="Nhập tiêu đề (ví dụ: Kết quả Đại học 2023-2024)"
                    />
                </div>
            </div>

            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Mô tả <span className="text-red-500">*</span>
                    </div>
                    <textarea
                        name="description"
                        required
                        value={categoryData.description}
                        onChange={handleChange}
                        className="w-full h-32 py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-start gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal whitespace-pre-wrap"
                        placeholder="Nhập mô tả chi tiết về danh mục thành tích (hỗ trợ xuống dòng)"
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
                        value={categoryData.display_order}
                        onChange={handleChange}
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                        placeholder="Nhập thứ tự hiển thị (số nguyên)"
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

export default EditAchievementCategoryModal;
