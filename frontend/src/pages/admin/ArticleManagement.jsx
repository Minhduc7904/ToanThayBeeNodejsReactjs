import AdminLayout from "../../layouts/AdminLayout";
import FunctionBarAdmin from "../../components/bar/FunctionBarAdmin";
import ArticleTable from "../../components/table/ArticleTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetFilters } from "../../features/filter/filterSlice";

const ArticleManagement = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [didInit, setDidInit] = useState(false);
    const { isAddView } = useSelector(state => state.filter);

    useEffect(() => {
        if (!didInit) {
            dispatch(resetFilters());
            setDidInit(true);
        }
    }, [dispatch, didInit]);

    useEffect(() => {
        if (didInit && isAddView) {
            navigate("/admin/article-post");
        }
    }, [isAddView]);

    return (
        <AdminLayout>
            <div className="text-[#090a0a] w-full text-[32px] font-bold font-bevietnam leading-9">
                Danh sách bài viết
            </div>
            <FunctionBarAdmin />
            <ArticleTable />
        </AdminLayout>
    );
};

export default ArticleManagement;