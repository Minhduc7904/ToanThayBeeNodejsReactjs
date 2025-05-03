import AdminLayout from "../../../layouts/AdminLayout";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
import UserList from "../../../components/table/userTable";
import AddStudentModal from "../../../components/modal/AddStudentModal";
import { useSelector } from "react-redux";

const StudentManagement = () => {
    const { isAddView } = useSelector((state) => state.filter);

    return (
        <AdminLayout>
            <>
                <div className="text-[#090a0a] text-[32px] font-bold font-bevietnam leading-9">
                    Danh sách học sinh
                </div>
                <FunctionBarAdmin />
                <UserList />

                {/* Modal thêm học sinh */}
                {isAddView && <AddStudentModal />}
            </>
        </AdminLayout>
    );
}

export default StudentManagement;