import AdminLayout from "../../../layouts/AdminLayout";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
import ClassTable from "../../../components/table/ClassTable";

const StudentManagement = () => {
    return (
        <AdminLayout>
            <>
                <div className="text-[#090a0a] text-[32px] font-bold font-['Be Vietnam Pro'] leading-9">
                    Danh sách lớp học
                </div>
                <FunctionBarAdmin />
                <ClassTable />
            </>

        </AdminLayout >
    );
}

export default StudentManagement;