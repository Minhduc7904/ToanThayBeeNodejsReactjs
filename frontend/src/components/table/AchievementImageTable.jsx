import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAchievementImages, deleteAchievementImage } from "../../features/achievement/achievementSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import ConfirmModal from "../modal/ConfirmModal";
import { resetFilters, setIsAddView } from "../../features/filter/filterSlice";

const AchievementImageTable = ({ onEdit }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { images, loading } = useSelector(state => state.achievements);
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
            dispatch(fetchAchievementImages({
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
                onEdit(id, "images");
            }
        } else {
            navigate(`/admin/achievement-management/image/${id}`);
        }
    };

    const confirmDelete = () => {
        if (selectedId === null) return;

        dispatch(deleteAchievementImage(selectedId))
            .unwrap()
            .then(() => {
                dispatch(fetchAchievementImages({
                    currentPage,
                    limit,
                    sortOrder: sortOrder.toUpperCase()
                }));
                setIsOpenConfirmDeleteModal(false);
                setSelectedId(null);
            })
            .catch(error => {
                console.error("Error deleting image:", error);
                alert("Lỗi khi xóa hình ảnh: " + (error.message || "Vui lòng thử lại"));
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
                message="Bạn có chắc chắn muốn xóa hình ảnh thành tích này không? Hành động này không thể hoàn tác."
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
                            <th className="py-3 text-center w-32">Hình ảnh</th>
                            <th className="py-3 text-center w-64">Chú thích</th>
                            <th className="py-3 text-center w-32">Thứ tự hiển thị</th>
                            <th className="py-3 text-center w-32">Nổi bật</th>
                            <th className="py-3 text-center w-40">Ngày tạo</th>
                            <th className="py-3 text-center w-40">Cập nhật lúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map((image) => (
                            <tr
                                key={image.id}
                                onClick={() => handleClickedRow(image.id)}
                                className={`border border-[#E7E7ED] cursor-pointer ${
                                    deleteMode ? "hover:bg-red-50" :
                                    editMode ? "hover:bg-blue-50" :
                                    "hover:bg-gray-50"
                                }`}
                            >
                                <td className="py-3 text-center">{image.id}</td>
                                <td className="py-3 text-center">{image.category_id}</td>
                                <td className="py-3 text-center">
                                    {image.image_url && (
                                        <div className="flex justify-center">
                                            <img
                                                src={image.image_url}
                                                alt={image.caption}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                </td>
                                <td className="py-3 text-center">
                                    <div className="max-w-xs mx-auto overflow-hidden text-ellipsis whitespace-nowrap">
                                        {image.caption ? image.caption.replace(/\n/g, ' ') : ''}
                                    </div>
                                </td>
                                <td className="py-3 text-center">{image.display_order}</td>
                                <td className="py-3 text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                            image.is_featured
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {image.is_featured ? "Nổi bật" : "Thường"}
                                    </span>
                                </td>
                                <td className="py-3 text-center">
                                    {new Date(image.createdAt).toLocaleDateString("vi-VN")}
                                </td>
                                <td className="py-3 text-center">
                                    {new Date(image.updatedAt).toLocaleDateString("vi-VN")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AchievementImageTable;
