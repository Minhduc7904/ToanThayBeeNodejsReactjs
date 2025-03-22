import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserById, putUser, putUserType, putUserStatus } from "../../features/user/userSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../features/user/userSlice";
import DropMenuBarAdmin from "../dropMenu/OptionBarAdmin";
import { fetchCodesByType } from "../../features/code/codeSlice";
import { validationUser } from "../../utils/validation";
import { setSuccessMessage } from "../../features/state/stateApiSlice";
import DetailTr from "./DetailTr";

const UserDetail = ({ userId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { student } = useSelector((state) => state.users);
    const { user } = useSelector((state) => state.auth);
    const { codes } = useSelector((state) => state.codes);

    const [studentData, setStudentData] = useState(null)

    useEffect(() => {
        dispatch(fetchCodesByType(["user type", "student status", "grade", "highSchool"]));
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

    useEffect(() => {
        if (student) {
            setStudentData({ ...student })
        }
    }, [student]);


    const handlePutUser = () => {
        const data = {
            lastName: studentData.lastName,
            firstName: studentData.firstName,
            email: studentData.email ? studentData.email : null,
            phone: studentData.phone ? studentData.phone : null,
            class: studentData.class,
            highSchool: studentData.highSchool,
        };

        if (!validationUser(data, dispatch)) return;
        if (JSON.stringify(student) === JSON.stringify(studentData)) {
            dispatch(setSuccessMessage("Không có thay đổi nào được thực hiện"));
            return;
        } else {
            if (user.userType === "AD" || user.userType === "GV") {
                if (studentData.userType !== student.userType) {
                    dispatch(putUserType({ id: student.id, type: studentData.userType }));
                }
                if (studentData.status !== student.status) {
                    dispatch(putUserStatus({ id: student.id, status: studentData.status }));
                }
            } 
            dispatch(putUser({ id: student.id, user: data }));
        }

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
            <div className="flex-grow h-full overflow-y-auto">
                <table className="w-full border-collapse h-full border border-[#E7E7ED]">
                    <thead className="bg-[#F6FAFD]">
                        <tr className="border border-[#E7E7ED]">
                            <th className="p-3 text-[#202325] text-md font-bold font-['Be_Vietnam_Pro'] leading-[18px] w-64">Thuộc tính</th>
                            <th className="p-3 text-[#202325] text-md font-bold font-['Be_Vietnam_Pro'] leading-[18px]">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        <DetailTr
                            title="ID"
                            value={studentData?.id}
                            type={0}
                        />
                        <DetailTr
                            title="Họ và tên đệm"
                            value={studentData?.lastName}
                            type={1}
                            required={true}
                            placeholder={"Nhập họ và tên đệm"}
                            onChange={(e) => setStudentData({ ...studentData, lastName: e.target.value })}
                        />
                        <DetailTr
                            title="Tên"
                            value={studentData?.firstName}
                            type={1}
                            required={true}
                            placeholder={"Nhập tên"}
                            onChange={(e) => setStudentData({ ...studentData, firstName: e.target.value })}
                        />
                        {(user.userType === "GV" || user.userType === "AD") ? (
                            <DetailTr
                                title="Kiểu người dùng"
                                value={studentData?.userType}
                                type={3}
                                options={Array.isArray(codes["user type"]) ? codes["user type"] : []}
                                onChange={(option) => setStudentData({ ...studentData, userType: option })}
                                required={true}
                            />
                        ) : (
                            <DetailTr
                                title="Kiểu người dùng"
                                value={studentData?.userType}
                                type={0}
                                required={true}
                            />
                        )}
                        <DetailTr
                            title={"Giới tính"}
                            value={studentData?.gender}
                            valueText={studentData?.gender ? "Nam" : "Nữ"}
                            type={0}
                            required={true}
                        />
                        <DetailTr
                            title="Ngày sinh"
                            valueText={studentData?.birthDate ? new Date(studentData?.birthDate).toLocaleDateString() : "Chưa cập nhật"}
                            type={0}
                            required={true}
                        />
                        
                        <DetailTr
                            title="Email"
                            value={studentData?.email}
                            valueText={studentData?.email ? studentData?.email : "Chưa cập nhật"} 
                            type={1}
                            required={true}
                            placeholder={"Nhập email"}
                            onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                        />
                        <DetailTr
                            title="Số điện thoại"
                            value={studentData?.phone}
                            valueText={studentData?.phone ? studentData?.phone : "Chưa cập nhật"}
                            type={1}
                            required={true}
                            placeholder={"Nhập số điện thoại"}
                            onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                        />
                        <DetailTr
                            title="Lớp"
                            value={studentData?.class}
                            type={3}
                            options={Array.isArray(codes["grade"]) ? codes["grade"] : []}
                            onChange={(option) => setStudentData({ ...studentData, class: option })}
                            required={true}
                        />
                        <DetailTr
                            title="Trường học"
                            value={studentData?.highSchool}
                            valueText={codes["highSchool"]?.find((item) => item.code === studentData?.highSchool)?.description ? codes["highSchool"]?.find((item) => item.code === studentData?.highSchool)?.description : studentData?.highSchool ? studentData?.highSchool : "Chưa cập nhật"}
                            type={5}
                            options={Array.isArray(codes["highSchool"]) ? codes["highSchool"] : []}
                            onChange={(option) => setStudentData({ ...studentData, highSchool: option })}
                            required={true}
                        />
                        <DetailTr
                            title="Trạng thái"
                            value={studentData?.status}
                            type={3}
                            options={Array.isArray(codes["student status"]) ? codes["student status"] : []}
                            onChange={(option) => setStudentData({ ...studentData, status: option })}
                            required={true}
                        />
                        <DetailTr
                            title="Ngày tham gia"
                            valueText={new Date(studentData?.createdAt).toLocaleDateString()}
                            type={0}
                        />
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
                    <div className="text-center justify-center text-white text-md font-medium font-['Inter'] leading-normal">
                        Lưu
                    </div>
                </button>
            </div>
        </div>



    );
};

export default UserDetail;
