import { useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import CodeTable from "../../components/table/CodeTable";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllCodes } from "../../features/code/codeSlice";
import FunctionBarAdmin from "../../components/bar/FunctionBarAdmin";
import AdminModal from "../../components/modal/AdminModal";
import AddCodeModal from "../../components/modal/AddCodeModal";
import { setIsAddView } from "../../features/filter/filterSlice";

const CodeManagement = () => {
    const dispatch = useDispatch();
    const { allCodes } = useSelector(state => state.codes);
    const { search, currentPage, limit, totalItems, sortOrder } = useSelector(state => state.filter);
    const { isAddView, isFilterVIew } = useSelector(state => state.filter);


    useEffect(() => {
        dispatch(fetchAllCodes({ search, currentPage, limit, sortOrder }))
            .unwrap()
    }, [dispatch, search, currentPage, limit, sortOrder]);

    return (
        <AdminLayout>
            <AdminModal isOpen={isAddView} headerText={'Tạo mã mới'} onClose={() => dispatch(setIsAddView(false))} >
                <AddCodeModal onClose={() => dispatch(setIsAddView(false))} fetchCodes={fetchAllCodes} />
            </AdminModal>

            <div className="text-[#090a0a] text-[32px] font-bold font-['Be Vietnam Pro'] leading-9">
                Danh sách mã
            </div>
            <FunctionBarAdmin />
            <CodeTable codes={allCodes} />
        </AdminLayout>
    );
}

export default CodeManagement;