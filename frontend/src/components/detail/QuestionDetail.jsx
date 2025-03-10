import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetDetailView, fetchUserById } from "../../features/user/userSlice";
import { setLoading } from "../../features/user/userSlice";
import LoadingSpinner from "../loading/LoadingSpinner";

const UserDetail = () => {
    const dispatch = useDispatch();
    const { user, loading, selectedUserId } = useSelector((state) => state.users);
    const attributes = ['id', 'lastName', 'firstName', 'userType', 'email', 'phone', 'class', 'highSchool', 'status', 'createdAt'];
    const attributesName = ['ID', 'Họ', 'Tên', 'Loại Người Dùng', 'Email', 'Số Điện Thoại', 'Lớp', 'Trường Học', 'Trạng Thái', 'Ngày tham gia'];

    useEffect(() => {
        dispatch(setLoading(true)); // Bật trạng thái loading trước khi gọi API

        const timer = setTimeout(() => {
            dispatch(fetchUserById(selectedUserId))
                .unwrap()
                .finally(() => dispatch(setLoading(false)));
        }, 500);

        return () => clearTimeout(timer);
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner color="border-black" size="5rem" />
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <p className="text-center text-gray-500">Không tìm thấy người dùng.</p>
                <button
                    onClick={() => dispatch(resetDetailView())}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                >
                    ← Quay lại danh sách
                </button>
            </>

        );
    }

    return (
        <div className="flex flex-col gap-4 min-h-0">
            <div className="flex gap-2 items-center">
                <button onClick={() => dispatch(resetDetailView())} className="flex items-center justify-center w-10 h-10 hover:bg-[#F6FAFD] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M12.6667 8.66675L5.50292 15.8289C5.38989 15.94 5.33337 16.0856 5.33337 16.2312M12.6667 23.3334L5.50292 16.6335C5.38989 16.5224 5.33337 16.3768 5.33337 16.2312M5.33337 16.2312H26.6667" stroke="#131214" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                </button>
                <div className="relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose">Chi tiết câu hỏi - 00001</div>
            </div>
            <div className="flex-grow overflow-y-auto">
                <table className="w-full border-collapse border border-[#E7E7ED]">
                    <thead className="bg-[#F6FAFD] sticky top-0 z-10">
                        <tr className="border border-[#E7E7ED]">
                            <th className="p-3 text-center text-[#202325] text-lg font-bold font-['Be_Vietnam_Pro'] leading-[18px]">Thuộc tính</th>
                            <th className="p-3 text-center text-[#202325] text-lg font-bold font-['Be_Vietnam_Pro'] leading-[18px]">Chi tiết</th>
                            <th className="p-3 text-center text-[#202325] text-lg font-bold font-['Be_Vietnam_Pro'] leading-[18px]">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attributesName.map((attribute, index) => (
                            <tr
                                className="border border-[#E7E7ED] ">
                                <td className="p-3 text-center text-[#202325] text-lg font-bold">{attribute}</td>
                                <td className="p-3 text-center text-[#72777a] text-lg">
                                    {user[attributes[index]] ? user[attributes[index]] : "Chưa cập nhật"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>

    );
};

export default UserDetail;
