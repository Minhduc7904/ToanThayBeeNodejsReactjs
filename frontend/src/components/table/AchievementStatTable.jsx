import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAchievementStats, deleteAchievementStat } from "../../features/achievement/achievementSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import ConfirmModal from "../modal/ConfirmModal";
import { resetFilters, setIsAddView } from "../../features/filter/filterSlice";

const AchievementStatTable = ({ onEdit }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stats, loading } = useSelector(state => state.achievements);
    const { search, currentPage, limit, sortOrder } = useSelector(state => state.filter);
    const [deleteMode, setDeleteMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [didInit, setDidInit] = useState(false);

    useEffect(() => {
        if (!didInit) {
            dispatch(resetFilters());
            setDidInit(true);
        }
    }, [dispatch, didInit]);

    useEffect(() => {
        if (didInit) {
            dispatch(fetchAchievementStats({
                currentPage,
                limit,
                sortOrder: sortOrder.toUpperCase()
            }));
        }
    }, [dispatch, currentPage, limit, sortOrder, didInit]);

    const handleClickedRow = (id) => {
        if (deleteMode) {
            setIsOpenConfirmDeleteModal(true);
            setSelectedId(id);
        } else if (editMode) {
            // Handle edit mode
            setSelectedId(id);
            if (onEdit) {
                onEdit(id, "stats");
            }
        } else {
            navigate(`/admin/achievement-management/stat/${id}`);
        }
    };

    const confirmDelete = () => {
        if (selectedId === null) return;

        dispatch(deleteAchievementStat(selectedId))
            .unwrap()
            .then(() => {
                dispatch(fetchAchievementStats({
                    currentPage,
                    limit,
                    sortOrder: sortOrder.toUpperCase()
                }));
                setIsOpenConfirmDeleteModal(false);
                setSelectedId(null);
            })
            .catch(error => {
                console.error("Error deleting stat:", error);
                alert("Lỗi khi xóa thống kê: " + (error.message || "Vui lòng thử lại"));
            });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner color="border-black" size="5rem" />
            </div>
        );
    }

    return (
        <>
            <ConfirmModal
                isOpen={isOpenConfirmDeleteModal}
                onClose={() => setIsOpenConfirmDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa thống kê thành tích này không? Hành động này không thể hoàn tác."
            />

            <div className="flex justify-end mb-4 gap-2">
                <button
                    onClick={() => {
                        setEditMode(!editMode);
                        if (deleteMode) setDeleteMode(false);
                    }}
                    className={`px-4 py-2 rounded-md ${
                        editMode ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    {editMode ? "Hủy chỉnh sửa" : "Chế độ chỉnh sửa"}
                </button>
                <button
                    onClick={() => {
                        setDeleteMode(!deleteMode);
                        if (editMode) setEditMode(false);
                    }}
                    className={`px-4 py-2 rounded-md ${
                        deleteMode ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    {deleteMode ? "Hủy xóa" : "Chế độ xóa"}
                </button>
            </div>

            <div className="flex-grow h-[70vh] overflow-y-auto hide-scrollbar">
                <table className="w-full border-collapse border border-[#E7E7ED]">
                    <thead className="bg-[#F6FAFD] sticky top-0 z-10">
                        <tr className="border border-[#E7E7ED]">
                            <th className="py-3 text-center w-16">ID</th>
                            <th className="py-3 text-center w-64">Danh mục</th>
                            <th className="py-3 text-center w-32">Giá trị</th>
                            <th className="py-3 text-center w-64">Nhãn</th>
                            <th className="py-3 text-center w-32">Thứ tự hiển thị</th>
                            <th className="py-3 text-center w-40">Ngày tạo</th>
                            <th className="py-3 text-center w-40">Cập nhật lúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((stat) => (
                            <tr
                                key={stat.id}
                                onClick={() => handleClickedRow(stat.id)}
                                className={`border border-[#E7E7ED] cursor-pointer ${
                                    deleteMode ? "hover:bg-red-50" :
                                    editMode ? "hover:bg-blue-50" :
                                    "hover:bg-gray-50"
                                }`}
                            >
                                <td className="py-3 text-center">{stat.id}</td>
                                <td className="py-3 text-center">{stat.category_id}</td>
                                <td className="py-3 text-center">{stat.value}</td>
                                <td className="py-3 text-center">
                                    <div className="max-w-xs mx-auto overflow-hidden text-ellipsis whitespace-nowrap">
                                        {stat.label}
                                    </div>
                                </td>
                                <td className="py-3 text-center">{stat.display_order}</td>
                                <td className="py-3 text-center">
                                    {new Date(stat.createdAt).toLocaleDateString("vi-VN")}
                                </td>
                                <td className="py-3 text-center">
                                    {new Date(stat.updatedAt).toLocaleDateString("vi-VN")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AchievementStatTable;
