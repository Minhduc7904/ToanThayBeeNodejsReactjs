import AdminSidebar from "../components/sidebar/AdminSidebar";
import { useSelector } from "react-redux";

const AdminLayout = ({ children }) => {
    const closeSidebar = useSelector(state => state.sidebar.closeSidebar);
    return (
        <div className="flex w-screen gap-[1rem] bg-[#F7F9FA] overflow-hidden">
            <AdminSidebar />
            <div className={`flex ${closeSidebar ? "ml-20" : "ml-[16rem]"} w-full h-full py-[1.9375rem] px-[2.25rem] flex-col gap-[1.25rem] bg-white shadow-[0px_1px_8px_2px_rgba(20,20,20,0.08)]  overflow-hidden`}>
                {children}
            </div>

        </div>
    );
}

export default AdminLayout;