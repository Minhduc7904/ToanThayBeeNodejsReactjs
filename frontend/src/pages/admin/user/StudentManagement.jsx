import AdminLayout from "../../../layouts/AdminLayout";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
import UserList from "../../../components/table/userTable";

const StudentManagement = () => {
    return (
        <AdminLayout>
            <>
                <div className="text-[#090a0a] text-[32px] font-bold font-['Be Vietnam Pro'] leading-9">
                    Danh sách học sinh
                </div>
                <FunctionBarAdmin />
                <UserList />
            </>

        </AdminLayout >
    );
}

export default StudentManagement;