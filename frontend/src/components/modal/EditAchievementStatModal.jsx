import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateAchievementStat,
    fetchAchievementStats,
    fetchAchievementStatById,
    fetchAchievementCategories
} from "../../features/achievement/achievementSlice";
import LoadingSpinner from "../loading/LoadingSpinner";

const EditAchievementStatModal = ({ onClose, statId }) => {
    const dispatch = useDispatch();
    const { loading, currentStat, categories } = useSelector(state => state.achievements);
    const { currentPage, limit, sortOrder } = useSelector(state => state.filter);

    const [statData, setStatData] = useState({
        category_id: "",
        value: "",
        label: "",
        display_order: 0
    });

    // Fetch stat data and categories when component mounts
    useEffect(() => {
        dispatch(fetchAchievementCategories());
        
        if (statId) {
            dispatch(fetchAchievementStatById(statId));
        }
    }, [dispatch, statId]);

    // Update form when stat data is loaded
    useEffect(() => {
        if (currentStat) {
            setStatData({
                category_id: currentStat.category_id || "",
                value: currentStat.value || "",
                label: currentStat.label || "",
                display_order: currentStat.display_order || 0
            });
        }
    }, [currentStat]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setStatData({
            ...statData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!statData.value || !statData.label) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        dispatch(updateAchievementStat({ id: statId, statData }))
            .unwrap()
            .then(() => {
                onClose();
                dispatch(fetchAchievementStats({
                    category_id: statData.category_id,
                    currentPage,
                    limit,
                    sortOrder: sortOrder.toUpperCase()
                }));
            })
            .catch(error => {
                console.error("Error updating stat:", error);
                alert("Lỗi khi cập nhật thống kê: " + (error.message || "Vui lòng thử lại"));
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
                        value={statData.category_id}
                        onChange={handleChange}
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                        disabled // Category cannot be changed for existing stats
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
                        Giá trị <span className="text-red-500">*</span>
                    </div>
                    <input
                        type="text"
                        name="value"
                        required
                        value={statData.value}
                        onChange={handleChange}
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                        placeholder="Nhập giá trị (ví dụ: 95%, 100+, 50)"
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
                        value={statData.label}
                        onChange={handleChange}
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                        placeholder="Nhập nhãn (ví dụ: Học sinh đạt điểm cao)"
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
                        value={statData.display_order}
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

export default EditAchievementStatModal;
