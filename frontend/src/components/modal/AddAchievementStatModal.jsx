import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createAchievementStat,
    fetchAchievementStats,
    fetchAchievementCategories
} from "../../features/achievement/achievementSlice";
import LoadingSpinner from "../loading/LoadingSpinner";

const AddAchievementStatModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.states);
    const { categories } = useSelector(state => state.achievements);
    const { search, currentPage, limit, sortOrder } = useSelector(state => state.filter);

    const [statData, setStatData] = useState({
        category_id: "",
        value: "",
        label: "",
        display_order: 0
    });

    useEffect(() => {
        // Fetch categories for dropdown
        dispatch(fetchAchievementCategories());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setStatData({
            ...statData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!statData.category_id) {
            alert("Vui lòng chọn danh mục");
            return;
        }

        if (!statData.value || !statData.label) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        dispatch(createAchievementStat(statData))
            .unwrap()
            .then(() => {
                onClose();
                dispatch(fetchAchievementStats({
                    category_id: statData.category_id,
                    currentPage,
                    limit,
                    sortOrder
                }));
            })
            .catch(error => {
                console.error("Error creating stat:", error);
                alert("Lỗi khi tạo thống kê: " + (error.message || "Vui lòng thử lại"));
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
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.title}
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
                        Thứ tự hiển thị
                    </div>
                    <input
                        type="number"
                        name="display_order"
                        value={statData.display_order}
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

export default AddAchievementStatModal;
