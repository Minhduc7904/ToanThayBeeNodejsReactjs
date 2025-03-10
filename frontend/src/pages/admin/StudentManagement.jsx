import AdminLayout from "../../layouts/AdminLayout";
import FunctionBarAdmin from "../../components/bar/FunctionBarAdmin";
import UserList from "../../components/table/userTable";
import { useSelector } from "react-redux";
import UserDetail from "../../components/detail/UserDetail";

const StudentManagement = () => {
    const { isDetailView } = useSelector(state => state.users);
    return (
        <AdminLayout>
            <div className="flex w-full h-full py-[1.9375rem] px-[2.25rem] flex-col gap-[1.25rem] bg-white shadow-[0px_1px_8px_2px_rgba(20,20,20,0.08)]">
                {isDetailView ? (
                    // Hiển thị Chi Tiết Người Dùng nếu có selectedUser
                    <UserDetail />
                ) : (
                    // Hiển thị Danh Sách nếu chưa chọn user
                    <>
                        <div className="text-[#090a0a] text-[32px] font-bold font-['Be Vietnam Pro'] leading-9">
                            Danh sách học sinh
                        </div>
                        <FunctionBarAdmin />
                        <div className="w-full flex h-[2px] bg-[#E7E7ED]"></div>
                        <UserList />
                    </>
                )}

            </div>
        </AdminLayout >
    );
}

export default StudentManagement;