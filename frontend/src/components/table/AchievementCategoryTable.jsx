import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAchievementCategories, deleteAchievementCategory } from "../../features/achievement/achievementSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import ConfirmModal from "../modal/ConfirmModal";
import { resetFilters, setIsAddView } from "../../features/filter/filterSlice";

const AchievementCategoryTable = ({ onEdit }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, loading } = useSelector(state => state.achievements);
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
            dispatch(fetchAchievementCategories({
                search,
                currentPage,
                limit,
                sortOrder: sortOrder.toUpperCase(),
                sortBy: 'display_order'
            }));
        }
    }, [dispatch, search, currentPage, limit, sortOrder, didInit]);

    const handleClickedRow = (id) => {
        if (deleteMode) {
            setIsOpenConfirmDeleteModal(true);
            setSelectedId(id);
        } else if (editMode) {
            // Handle edit mode
            setSelectedId(id);
            if (onEdit) {
                onEdit(id, "categories");
            }
        } else {
            navigate(`/admin/achievement-management/category/${id}`);
        }
    };

    const confirmDelete = () => {
        if (selectedId === null) return;

        dispatch(deleteAchievementCategory(selectedId))
            .unwrap()
            .then(() => {
                dispatch(fetchAchievementCategories({
                    search,
                    currentPage,
                    limit,
                    sortOrder: sortOrder.toUpperCase(),
                    sortBy: 'display_order'
                }));
                setIsOpenConfirmDeleteModal(false);
                setSelectedId(null);
            })
            .catch(error => {
                console.error("Error deleting category:", error);
                alert("Lỗi khi xóa danh mục: " + (error.message || "Vui lòng thử lại"));
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
                message="Bạn có chắc chắn muốn xóa danh mục thành tích này không? Hành động này không thể hoàn tác."
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
                            <th className="py-3 text-center w-32">Mã danh mục</th>
                            <th className="py-3 text-center w-64">Tiêu đề</th>
                            <th className="py-3 text-center w-96">Mô tả</th>
                            <th className="py-3 text-center w-32">Thứ tự hiển thị</th>
                            <th className="py-3 text-center w-40">Ngày tạo</th>
                            <th className="py-3 text-center w-40">Cập nhật lúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr
                                key={category.id}
                                onClick={() => handleClickedRow(category.id)}
                                className={`border border-[#E7E7ED] cursor-pointer ${
                                    deleteMode ? "hover:bg-red-50" :
                                    editMode ? "hover:bg-blue-50" :
                                    "hover:bg-gray-50"
                                }`}
                            >
                                <td className="py-3 text-center">{category.id}</td>
                                <td className="py-3 text-center">{category.label}</td>
                                <td className="py-3 text-center">{category.title}</td>
                                <td className="py-3 text-center">
                                    <div className="max-w-xs mx-auto overflow-hidden text-ellipsis whitespace-nowrap">
                                        {category.description.replace(/\n/g, ' ')}
                                    </div>
                                </td>
                                <td className="py-3 text-center">{category.display_order}</td>
                                <td className="py-3 text-center">
                                    {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                                </td>
                                <td className="py-3 text-center">
                                    {new Date(category.updatedAt).toLocaleDateString("vi-VN")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AchievementCategoryTable;
