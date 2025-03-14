import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, setDetailView } from "../../features/user/userSlice";
import { setSortOrder } from "../../features/filter/filterSlice";
import LoadingSpinner from "../loading/LoadingSpinner";

const UserList = () => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    const { search, currentPage, limit, totalItems, sortOrder } = useSelector(state => state.filter);
    const { loading } = useSelector(state => state.states);

    useEffect(() => {
        dispatch(fetchUsers({ search, currentPage, limit, sortOrder }))
    }, [dispatch, search, currentPage, limit, sortOrder]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner color="border-black" size="5rem" />
        </div>
    )

    return (
        <div className="flex flex-col gap-4 min-h-0">
            <div className="flex justify-start items-center">
                {totalItems > 0 ? (
                    <div className="flex justify-center items-center gap-2">
                        <p className="text-right text-gray-500">
                            Hiển thị {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalItems)} trong tổng số {totalItems} kết quả
                        </p>
                        <button
                            onClick={() => dispatch(setSortOrder())}
                            className="w-4 h-4 relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="18"
                                viewBox="0 0 16 18"
                                fill="none"
                                className="stroke-gray-500"
                            >
                                <path
                                    d="M4 17V7M4 17L1 14M4 17L7 14M12 1V11M12 1L15 4M12 1L9 4"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                    </div>
                ) : (
                    <p className="text-center text-gray-500">Không tìm thấy kết quả nào</p>
                )}

            </div>

            <div className="flex-grow overflow-y-auto">
                <table className="w-full border-collapse border border-[#E7E7ED]">
                    <thead className="bg-[#F6FAFD] sticky top-0 z-10">
                        <tr className="border border-[#E7E7ED]">
                            <th className="p-3 text-center">ID</th>
                            <th className="p-3 text-center">Họ và Tên</th>
                            <th className="p-3 text-center">Loại Người Dùng</th>
                            <th className="p-3 text-center">Giới Tính</th>
                            <th className="p-3 text-center">Ngày Sinh</th>
                            <th className="p-3 text-center">Số Điện Thoại</th>
                            <th className="p-3 text-center">Trường Học</th>
                            <th className="p-3 text-center">Lớp</th>
                            <th className="p-3 text-center">Email</th>
                            <th className="p-3 text-center">Trạng Thái</th>
                            <th className="p-3 text-center">Ngày tham gia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr
                                onClick={() => dispatch(setDetailView(user.id))}
                                key={user.id} className="border border-[#E7E7ED] hover:bg-gray-50 cursor-pointer">
                                <td className="p-3 text-center">{user.id}</td>
                                <td className="p-3 text-center">{user.lastName} {user.firstName}</td>
                                <td className="p-3 text-center">{user.userType}</td>
                                <td className="p-3 text-center">{user.gender ? "Nam" : "Nữ"}</td>
                                <td className="p-3 text-center">
                                    {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : "Chưa cập nhật"}
                                </td>
                                <td className="p-3 text-center">{user.phone || "Chưa có"}</td>
                                <td className="p-3 text-center">{user.highSchool || "Chưa cập nhật"}</td>
                                <td className="p-3 text-center">{user.class || "Chưa cập nhật"}</td>
                                <td className="p-3 text-center">{user.email || "Chưa có email"}</td>
                                <td className="p-3 text-center">{user.status || "Chưa cập nhật"}</td>
                                <td className="p-3 text-center">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default UserList;
