import AdminLayout from "../../../layouts/AdminLayout";
import { useParams } from "react-router-dom";
import UserClassTable from "../../../components/table/UserClassTable";
import { useNavigate } from "react-router-dom";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
const ClassUserManagement = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    return (
        <AdminLayout>
            <div className="flex gap-2 items-center">
                <button onClick={() => navigate("/admin/class-management")} className="flex items-center justify-center w-10 h-10 hover:bg-[#F6FAFD] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M12.6667 8.66675L5.50292 15.8289C5.38989 15.94 5.33337 16.0856 5.33337 16.2312M12.6667 23.3334L5.50292 16.6335C5.38989 16.5224 5.33337 16.3768 5.33337 16.2312M5.33337 16.2312H26.6667" stroke="#131214" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                </button>
                <div className="relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose">Chi tiết lớp học - {classId}</div>
            </div>
            <div className="flex w-full h-2 border-b border-[#E7E7ED]"></div>
            <div className="flex gap-2 items-center border-b border-[#E7E7ED]">
                <div
                    onClick={() => navigate(`/admin/class-management/${classId}`)}
                    className={`cursor-pointer relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                    Chi tiết
                </div>
                <div
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                    -
                </div>
                <div
                    className={` relative justify-center text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-gray-500 underline`}>
                    Danh sách học sinh
                </div>
                <div
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                    -
                </div>
                <div
                    onClick={() => navigate(`/admin/class-management/${classId}/lessons`)}
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose cursor-pointer`}>
                    Danh sách buổi học
                </div>
            </div>
            <FunctionBarAdmin />

            <UserClassTable classId={classId} />
        </AdminLayout>
    )
}

export default ClassUserManagement;
