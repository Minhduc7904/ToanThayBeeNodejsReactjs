import { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddView } from "../../../features/filter/filterSlice";
import AdminModal from "../../../components/modal/AdminModal";
import { resetFilters } from "../../../features/filter/filterSlice";
import AchievementCategoryTable from "../../../components/table/AchievementCategoryTable";
import AchievementStatTable from "../../../components/table/AchievementStatTable";
import AchievementImageTable from "../../../components/table/AchievementImageTable";
import AddAchievementCategoryModal from "../../../components/modal/AddAchievementCategoryModal";
import AddAchievementStatModal from "../../../components/modal/AddAchievementStatModal";
import AddAchievementImageModal from "../../../components/modal/AddAchievementImageModal";
import EditAchievementCategoryModal from "../../../components/modal/EditAchievementCategoryModal";
import EditAchievementStatModal from "../../../components/modal/EditAchievementStatModal";
import EditAchievementImageModal from "../../../components/modal/EditAchievementImageModal";

const AchievementManagement = () => {
    const dispatch = useDispatch();
    const { isAddView } = useSelector(state => state.filter);
    const [activeTab, setActiveTab] = useState("categories"); // categories, stats, images
    const [didInit, setDidInit] = useState(false);
    const [modalTitle, setModalTitle] = useState("");

    // State for edit mode
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        if (!didInit) {
            dispatch(resetFilters());
            setDidInit(true);
        }
    }, [dispatch, didInit]);

    // Set modal title based on active tab
    useEffect(() => {
        switch (activeTab) {
            case "categories":
                setModalTitle("Thêm danh mục thành tích mới");
                break;
            case "stats":
                setModalTitle("Thêm thống kê thành tích mới");
                break;
            case "images":
                setModalTitle("Thêm hình ảnh thành tích mới");
                break;
            default:
                setModalTitle("Thêm mới");
        }
    }, [activeTab]);

    // Set modal title based on mode and active tab
    useEffect(() => {
        if (isEditMode) {
            switch (activeTab) {
                case "categories":
                    setModalTitle("Chỉnh sửa danh mục thành tích");
                    break;
                case "stats":
                    setModalTitle("Chỉnh sửa thống kê thành tích");
                    break;
                case "images":
                    setModalTitle("Chỉnh sửa hình ảnh thành tích");
                    break;
                default:
                    setModalTitle("Chỉnh sửa");
            }
        } else {
            switch (activeTab) {
                case "categories":
                    setModalTitle("Thêm danh mục thành tích mới");
                    break;
                case "stats":
                    setModalTitle("Thêm thống kê thành tích mới");
                    break;
                case "images":
                    setModalTitle("Thêm hình ảnh thành tích mới");
                    break;
                default:
                    setModalTitle("Thêm mới");
            }
        }
    }, [activeTab, isEditMode]);

    // Handle closing the modal
    const handleCloseModal = () => {
        dispatch(setIsAddView(false));
        setIsEditMode(false);
        setSelectedItemId(null);
    };

    // Render modal content based on active tab and mode
    const renderModalContent = () => {
        if (isEditMode) {
            switch (activeTab) {
                case "categories":
                    return <EditAchievementCategoryModal onClose={handleCloseModal} categoryId={selectedItemId} />;
                case "stats":
                    return <EditAchievementStatModal onClose={handleCloseModal} statId={selectedItemId} />;
                case "images":
                    return <EditAchievementImageModal onClose={handleCloseModal} imageId={selectedItemId} />;
                default:
                    return null;
            }
        } else {
            switch (activeTab) {
                case "categories":
                    return <AddAchievementCategoryModal onClose={handleCloseModal} />;
                case "stats":
                    return <AddAchievementStatModal onClose={handleCloseModal} />;
                case "images":
                    return <AddAchievementImageModal onClose={handleCloseModal} />;
                default:
                    return null;
            }
        }
    };

    // Handle edit action from tables
    const handleEdit = (id, type) => {
        setSelectedItemId(id);
        setIsEditMode(true);
        setActiveTab(type);
        dispatch(setIsAddView(true));
    };

    // Render table based on active tab
    const renderTable = () => {
        switch (activeTab) {
            case "categories":
                return <AchievementCategoryTable onEdit={handleEdit} />;
            case "stats":
                return <AchievementStatTable onEdit={handleEdit} />;
            case "images":
                return <AchievementImageTable onEdit={handleEdit} />;
            default:
                return null;
        }
    };

    return (
        <AdminLayout>
            <AdminModal
                isOpen={isAddView}
                headerText={modalTitle}
                onClose={() => dispatch(setIsAddView(false))}
            >
                {renderModalContent()}
            </AdminModal>

            <div className="text-[#090a0a] text-[32px] font-bold font-bevietnam leading-9 mb-4">
                Quản lý thành tích
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === "categories"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("categories")}
                >
                    Danh mục thành tích
                </button>
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === "stats"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("stats")}
                >
                    Thống kê thành tích
                </button>
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === "images"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("images")}
                >
                    Hình ảnh thành tích
                </button>
            </div>

            <FunctionBarAdmin />
            {renderTable()}
        </AdminLayout>
    );
};

export default AchievementManagement;
