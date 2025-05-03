import AdminLayout from "../../../layouts/AdminLayout";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
import ClassTable from "../../../components/table/ClassTable";
import AdminModal from "../../../components/modal/AdminModal";
import { setIsAddView, setIsFilterView } from "../../../features/filter/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import AddClassModal from "../../../components/modal/AddClassModal";
import { setCurrentPage, setLimit, setSearch } from "../../../features/filter/filterSlice";
import { useEffect } from "react";

const ClassManagement = () => {
    const dispatch = useDispatch();
    const { isAddView } = useSelector(state => state.filter);

    return (
        <AdminLayout>
            <AdminModal isOpen={isAddView} headerText={'Tạo lớp mới'} onClose={() => dispatch(setIsAddView(false))}>
                <AddClassModal onClose={() => dispatch(setIsAddView(false))} />
            </AdminModal>
            <div className="text-[#090a0a] text-[32px] font-bold font-bevietnam leading-9">
                Danh sách lớp học
            </div>
            <FunctionBarAdmin />
            <ClassTable />

        </AdminLayout >
    );
}

export default ClassManagement;