import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserById, putUser } from "../../features/user/userSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../features/user/userSlice";
import DropMenuBarAdmin from "../dropMenu/OptionBarAdmin";
import { fetchCodesByType } from "../../features/code/codeSlice";
import { validationUser } from "../../utils/validation";

const UserDetail = ({ userId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { student } = useSelector((state) => state.users);
    const { user } = useSelector((state) => state.auth);
    const { codes } = useSelector((state) => state.codes);
    const attributes = ['id', 'lastName', 'firstName', 'userType', 'email', 'phone', 'class', 'highSchool', 'status', 'createdAt'];
    const attributesName = ['ID', 'Họ', 'Tên', 'Loại Người Dùng', 'Email', 'Số Điện Thoại', 'Lớp', 'Trường Học', 'Trạng Thái', 'Ngày tham gia'];
    useEffect(() => {
        dispatch(fetchCodesByType(["user type", "student status", "grade"]));
    }, [dispatch]);

    const { loading } = useSelector((state) => state.states);
    const [editLastName, setEditLastName] = useState(false);
    const [editFirstName, setEditFirstName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [editClass, setEditClass] = useState(false);
    const [editHighSchool, setEditHighSchool] = useState(false);
    const [editStatus, setEditStatus] = useState(false);
    const [editUserType, setEditUserType] = useState(false);

    useEffect(() => {
        dispatch(fetchUserById(userId))
    }, [dispatch, userId]);

    const handlePutUser = () => {
        const studentData = {
            lastName: student.lastName,
            firstName: student.firstName,
            email: student.email ? student.email : null,
            phone: student.phone ? student.phone : null,
            class: student.class,
            highSchool: student.highSchool,
            status: student.status,
            userType: student.userType,
        };
        if (!validationUser(studentData, dispatch)) return;
        dispatch(putUser({ id: student.id, user: studentData }));
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner color="border-black" size="5rem" />
            </div>
        );
    }

    if (!student) {
        return (
            <>
                <p className="text-center text-gray-500">Không tìm thấy người dùng.</p>
                <button
                    onClick={() => navigate("/admin/student-management")}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                >
                    ← Quay lại danh sách
                </button>
            </>

        );
    }

    return (
        <div className="flex flex-col gap-4 min-h-0 w-full h-full">
            <div className="flex gap-2 items-center">
                <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 hover:bg-[#F6FAFD] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M12.6667 8.66675L5.50292 15.8289C5.38989 15.94 5.33337 16.0856 5.33337 16.2312M12.6667 23.3334L5.50292 16.6335C5.38989 16.5224 5.33337 16.3768 5.33337 16.2312M5.33337 16.2312H26.6667" stroke="#131214" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                </button>
                <div className="relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose">Chi tiết học sinh - {student.id}</div>
            </div>
            <div className="flex-grow overflow-y-auto">
                <table className="w-full border-collapse border border-[#E7E7ED]">
                    <thead className="bg-[#F6FAFD]">
                        <tr className="border border-[#E7E7ED]">
                            <th className="p-3 text-[#202325] text-lg font-bold font-['Be_Vietnam_Pro'] leading-[18px] w-64">Thuộc tính</th>
                            <th className="p-3 text-[#202325] text-lg font-bold font-['Be_Vietnam_Pro'] leading-[18px]">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3  text-[#202325] text-lg font-bold">ID </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {student.id}
                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Họ và tên đệm <span className="text-red-500"> *</span>
                                </label>

                                <button onClick={() => setEditLastName(!editLastName)} className="flex items-center justify-center w-8 h-8 hover:bg-[#F6FAFD] rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {!editLastName ? (
                                    <>{student.lastName}</>
                                ) : (
                                    <input
                                        placeholder="Nhập họ và tên đệm"
                                        value={student.lastName}
                                        onChange={(e) => dispatch(setUser({ ...student, lastName: e.target.value }))}
                                        className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                    />
                                )}
                            </td>
                        </tr>
                        <tr className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Tên <span className="text-red-500"> *</span>
                                </label>

                                <button onClick={() => setEditFirstName(!editFirstName)} className="flex items-center justify-center w-8 h-8 hover:bg-[#F6FAFD] rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {!editFirstName ? (
                                    <>{student.firstName}</>
                                ) : (
                                    <input
                                        placeholder="Nhập tên"
                                        value={student.firstName}
                                        onChange={(e) => dispatch(setUser({ ...student, firstName: e.target.value }))}
                                        className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                    />
                                )}
                            </td>
                        </tr>
                        {(user.userType === "GV" || user.userType === "AD") ? (
                            <tr
                                className="border border-[#E7E7ED] ">
                                <td className="p-3 flex justify-between items-center">
                                    <label className="text-[#202325] text-lg font-bold">
                                        Kiểu người dùng<span className="text-red-500"> *</span>
                                    </label>
                                    <button onClick={() => setEditUserType(!editUserType)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </td>
                                <td className="p-3 text-[#72777a] text-lg">
                                    {!editUserType ? (
                                        <>{student.userType}</>
                                    ) : (
                                        <DropMenuBarAdmin
                                            selectedOption={student.userType}
                                            onChange={(option) => dispatch(setUser({ ...student, userType: option }))}
                                            options={Array.isArray(codes["user type"]) ? codes["user type"].filter((code) => code.code !== "AD") : []}
                                        />
                                    )}
                                </td>
                            </tr>
                        ) : (
                            <tr
                                className="border border-[#E7E7ED] ">
                                <td className="p-3  text-[#202325] text-lg font-bold">Kiểu người dùng</td>
                                <td className="p-3 text-[#72777a] text-lg">
                                    {student.userType}
                                </td>
                            </tr>
                        )}
                        <tr className="border border-[#E7E7ED] ">
                            <td className="p-3  text-[#202325] text-lg font-bold">Giới tính<span className="text-red-500"> *</span></td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {student.gender ? "Nam" : "Nữ"}
                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3  text-[#202325] text-lg font-bold">Ngày sinh<span className="text-red-500"> *</span></td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {student.birthDate ? new Date(student.birthDate).toLocaleDateString() : "Chưa cập nhật"}
                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Email
                                </label>
                                <button onClick={() => setEditEmail(!editEmail)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {!editEmail ? (
                                    <>{student.email ? student.email : "Chưa cập nhật"}</>
                                ) : (
                                    <input
                                        placeholder="Nhập Email"
                                        value={student.email}
                                        onChange={(e) => dispatch(setUser({ ...student, email: e.target.value }))}
                                        className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                    />
                                )}
                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Phone<span className="text-red-500"> *</span>
                                </label>
                                <button onClick={() => setEditPhone(!editPhone)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {!editPhone ? (
                                    <>{student.phone ? student.phone : "Chưa cập nhật"}</>
                                ) : (
                                    <input
                                        placeholder="Nhập tên"
                                        value={student.phone}
                                        onChange={(e) => dispatch(setUser({ ...student, phone: e.target.value }))}
                                        className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                    />
                                )}
                            </td>
                        </tr>

                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Lớp<span className="text-red-500"> *</span>
                                </label>
                                <button onClick={() => setEditClass(!editClass)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {!editClass ? (
                                    <>{student.class}</>
                                ) : (
                                    <DropMenuBarAdmin
                                        selectedOption={student.class}
                                        onChange={(option) => dispatch(setUser({ ...student, class: option }))}
                                        options={Array.isArray(codes["grade"]) ? codes["grade"] : []}
                                    />
                                )}
                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Trường học<span className="text-red-500"> *</span>
                                </label>
                                <button onClick={() => setEditHighSchool(!editHighSchool)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {!editHighSchool ? (
                                    <>{student.highSchool}</>
                                ) : (
                                    <DropMenuBarAdmin
                                        selectedOption={student.highSchool}
                                        onChange={(option) => dispatch(setUser({ ...student, highSchool: option }))}
                                        options={Array.isArray(codes["highSchool"]) ? codes["highSchool"] : []}
                                    />
                                )}
                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Trạng thái<span className="text-red-500"> *</span>
                                </label>
                                <button onClick={() => setEditStatus(!editStatus)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {!editStatus ? (
                                    <>{student.status}</>
                                ) : (
                                    <DropMenuBarAdmin
                                        selectedOption={student.status}
                                        onChange={(option) => dispatch(setUser({ ...student, status: option }))}
                                        options={Array.isArray(codes["student status"]) ? codes["student status"] : []}
                                    />
                                )}
                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3  text-[#202325] text-lg font-bold">Ngày tham gia</td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {new Date(student?.createdAt).toLocaleDateString()}
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <div className="flex w-full justify-end">
                <button
                    type="button"
                    onClick={handlePutUser}
                    data-icon Position="None" data-mode="Light" data-size="Large" data-state="Default" data-type="Primary"
                    className="h-12 px-8 py-4 bg-[#253f61] hover:bg-[#1b2e47] active:bg-[#16263a] transition-all duration-300 rounded-[48px] flex justify-center items-center gap-2.5"
                >
                    <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">
                        Lưu
                    </div>
                </button>
            </div>
        </div>



    );
};

export default UserDetail;
