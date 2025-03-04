import AdminSidebar from "../components/sidebar/AdminSidebar";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen p-[1.25rem] gap-[1rem] items-center bg-[#F7F9FA]">
            <AdminSidebar />
            {children}
        </div>
    );
}

export default AdminLayout;