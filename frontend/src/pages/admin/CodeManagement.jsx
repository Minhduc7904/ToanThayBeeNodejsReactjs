import { useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import CodeTable from "../../components/table/CodeTable";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllCodes } from "../../features/code/codeSlice";
import FunctionBarAdmin from "../../components/bar/FunctionBarAdmin";
import AdminModal from "../../components/modal/AdminModal";
import AddCodeModal from "../../components/modal/AddCodeModal";
import { setIsAddView } from "../../features/filter/filterSlice";
import { resetFilters } from "../../features/filter/filterSlice";
import { useState } from "react";

const CodeManagement = () => {
    const dispatch = useDispatch();
    const { allCodes } = useSelector(state => state.codes);
    const { search, currentPage, limit, totalItems, sortOrder } = useSelector(state => state.filter);
    const { isAddView, isFilterVIew } = useSelector(state => state.filter);

    const [didInit, setDidInit] = useState(false); // 👉 Thêm cờ kiểm soát mount đầu tiên

    useEffect(() => {
        if (!didInit) {
            dispatch(resetFilters());
            setDidInit(true);
        }
    }, [dispatch, didInit]);

    useEffect(() => {
        if (didInit) {
            dispatch(fetchAllCodes({ search, currentPage, limit, sortOrder }));
        }
    }, [dispatch, search, currentPage, limit, sortOrder, didInit]);

    return (
        <AdminLayout>
            <AdminModal isOpen={isAddView} headerText={'Tạo mã mới'} onClose={() => dispatch(setIsAddView(false))} >
                <AddCodeModal onClose={() => dispatch(setIsAddView(false))} fetchCodes={fetchAllCodes} />
            </AdminModal>

            <div className="text-[#090a0a] text-[32px] font-bold font-bevietnam leading-9">
                Danh sách mã
            </div>
            <FunctionBarAdmin />
            <CodeTable codes={allCodes} />
        </AdminLayout>
    );
}

export default CodeManagement;