import AdminSidebar from "../components/sidebar/AdminSidebar";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen gap-[1rem] items-center bg-[#F7F9FA]">
            <AdminSidebar />
            <div className="flex w-full h-full py-[1.9375rem] px-[2.25rem] flex-col gap-[1.25rem] bg-white shadow-[0px_1px_8px_2px_rgba(20,20,20,0.08)] overflow-y-auto">
                {children}
            </div>

        </div>
    );
}

export default AdminLayout;