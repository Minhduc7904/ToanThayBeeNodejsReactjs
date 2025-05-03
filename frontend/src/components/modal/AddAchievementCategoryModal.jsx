import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAchievementCategory, fetchAchievementCategories } from "../../features/achievement/achievementSlice";
import LoadingSpinner from "../loading/LoadingSpinner";

const AddAchievementCategoryModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.states);
    const { search, currentPage, limit, sortOrder } = useSelector(state => state.filter);

    const [categoryData, setCategoryData] = useState({
        id: "",
        label: "",
        title: "",
        description: "",
        display_order: 0
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCategoryData({
            ...categoryData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate ID format (alphanumeric with underscores)
        if (!/^[a-zA-Z0-9_]+$/.test(categoryData.id)) {
            alert("ID chỉ được chứa chữ cái, số và dấu gạch dưới");
            return;
        }

        dispatch(createAchievementCategory(categoryData))
            .unwrap()
            .then(() => {
                onClose();
                dispatch(fetchAchievementCategories({ search, currentPage, limit, sortOrder }));
            })
            .catch(error => {
                console.error("Error creating category:", error);
                alert("Lỗi khi tạo danh mục: " + (error.message || "Vui lòng thử lại"));
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
                        Mã danh mục <span className="text-red-500">*</span>
                    </div>
                    <input
                        type="text"
                        name="id"
                        required
                        value={categoryData.id}
                        onChange={handleChange}
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                        placeholder="Nhập mã danh mục (ví dụ: university_2023)"
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
                        min="0"
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                    />
                </div>
            </div>

            <div className="self-stretch h-[1px] bg-[#E7E7ED] my-4"></div>

            <div className="self-stretch flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-4 rounded-[48px] outline-1 outline-offset-[-1px] outline-[#253f61] flex justify-center items-center border border-[#253f61] bg-white gap-2.5"
                >
                    <div className="text-center justify-center text-[#253f61] text-base font-medium font-['Inter'] leading-none">
                        Hủy bỏ
                    </div>
                </button>
                <button
                    type="submit"
                    className="h-12 px-8 py-4 bg-[#253f61] rounded-[48px] flex justify-center items-center gap-2.5"
                >
                    <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">
                        Hoàn tất
                    </div>
                </button>
            </div>
        </form>
    );
};

export default AddAchievementCategoryModal;
