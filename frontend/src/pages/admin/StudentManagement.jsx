import AdminLayout from "../../layouts/AdminLayout";


const StudentManagement = () => {
    return (
        <AdminLayout>
            <div className="flex w-full h-full py-[1.9375rem] px-[2.25rem] flex-col gap-[1.25rem] bg-white rounded-[34px] shadow-[0px_1px_8px_2px_rgba(20,20,20,0.08)]">
                <div className="text-[#090a0a] text-[32px] font-bold font-['Be Vietnam Pro'] leading-9">
                    Quản lý câu hỏi
                </div>
                <div className="flex gap-[1.25rem]">
                    <input type="text" className="border border-[#e0e0e0] rounded-[0.5rem]">
                    </input>
                </div>
            </div>
        </AdminLayout >
    );
}

export default StudentManagement;