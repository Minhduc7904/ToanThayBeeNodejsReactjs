import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
import { setSortOrder } from "../../features/filter/filterSlice";
import TooltipTd from "./TooltipTd";
import { fetchCodesByType } from "../../features/code/codeSlice";
import { useNavigate } from "react-router-dom";
import { fetchArticles, deleteArticle } from "../../features/article/articleSlice";

const ArticleTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { articles } = useSelector(state => state.articles);
    const { codes } = useSelector(state => state.codes);
    const { loading } = useSelector(state => state.states);
    const [deleteMode, setDeleteMode] = useState(false);
    const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState(false);
    const [id, setId] = useState(null);

    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCodesByType(["article type", "grade", "chapter"]));
    }, [dispatch]);

    const handleClickedRow = (id) => {
        if (deleteMode) {
            setIsOpenConfirmDeleteModal(true);
            setId(id);
        } else {
            navigate(`/admin/article-management/edit/${id}`);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner
                type="dots"
                color="border-blue-600"
                size="4rem"
                showText={true}
                text="Đang tải danh sách bài viết..."
            />
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setDeleteMode(!deleteMode)}
                    className="relative">
                    <div className="w-[0.75rem] h-[0.75rem]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11 0V1.02924H14V3.00351H2V1.02924H5V0H11ZM2 13.7731C2 15.002 3 16 4.23145 16H11.7656C12.9971 16 13.9971 15.002 13.9971 13.7731V4.02339H2V13.7731ZM4 6.01949H12V13.2616C12 13.6702 11.666 14.0039 11.2559 14.0039H4.74414C4.33398 14.0039 4 13.6702 4 13.2616V6.01949ZM9 6.98636H11V12.9747H9V6.98636ZM7 6.98636H5V12.9747H7V6.98636Z"
                                fill={`${deleteMode ? '#DC3545' : '#28A745'}`} />
                        </svg>
                    </div>

                </button>
            </div>
            <div className="flex-grow h-[70vh] overflow-y-auto hide-scrollbar">
                <table className="w-full border-collapse border border-[#E7E7ED]">
                    <thead className="bg-[#F6FAFD] sticky top-0 z-10">
                        <tr className="border border-[#E7E7ED]">
                            <th className="py-3">ID</th>
                            <th className="py-3">Tên</th>
                            <th className="py-3">Tiêu đề</th>
                            <th className="py-3">Loại</th>
                            <th className="py-3">Lớp</th>
                            <th className="py-3">Chương</th>
                            <th className="py-3">Tác giả</th>
                            <th className="py-3">Ngày đăng</th>
                            <th className="py-3">Cập nhật lúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles && articles.length > 0 ? (
                            articles.map((article) => (
                                <tr
                                    onClick={() => handleClickedRow(article.id)}
                                    key={article.id}
                                    className={`border border-[#E7E7ED] cursor-pointer ${deleteMode ? 'hover:bg-red-50' : 'hover:bg-gray-50'}`}
                                >
                                    <td className="py-3 text-center">{article.id}</td>
                                    <TooltipTd
                                        value={article.name}
                                        tooltipText={article.name}
                                        maxLength={30} // Limit name to 30 characters
                                    />
                                    <TooltipTd
                                        value={article.title}
                                        tooltipText={article.title}
                                        maxLength={40} // Limit title to 40 characters
                                    />
                                    <TooltipTd
                                        value={article.type}
                                        tooltipText={
                                            codes['article type']?.find((code) => code.code === article.type)?.description || article.type
                                        }
                                    />
                                    <td className="py-3 text-center">{article.class ? article.class : "Không có"}</td>
                                    <TooltipTd
                                        value={article.chapter}
                                        tooltipText={
                                            codes['chapter']?.find((code) => code.code === article.chapter)?.description || article.chapter
                                        }
                                    />
                                    <td className="py-3 text-center">{article.author}</td>
                                    <td className="py-3 text-center">
                                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="py-3 text-center">
                                        {article.updatedAt ? new Date(article.updatedAt).toLocaleDateString() : "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="py-4 text-center text-gray-500">
                                    Không có bài viết nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isOpenConfirmDeleteModal && (
                <ConfirmDeleteModal
                    isOpen={isOpenConfirmDeleteModal}
                    onClose={() => setIsOpenConfirmDeleteModal(false)}
                    onConfirm={() => {
                        dispatch(deleteArticle(id));
                        setIsOpenConfirmDeleteModal(false);
                        setDeleteMode(false);
                    }}
                    title="Xác nhận xóa bài viết"
                    message="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
                />
            )}
        </div>
    );
};

export default ArticleTable;
