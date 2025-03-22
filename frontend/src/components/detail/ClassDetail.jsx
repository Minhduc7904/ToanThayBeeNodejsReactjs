import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassById } from "../../features/class/classSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { setClass } from "../../features/class/classSlice";
import DropMenuBarAdmin from "../dropMenu/OptionBarAdmin";
import { fetchCodesByType } from "../../features/code/codeSlice";
import { setSuccessMessage } from "../../features/state/stateApiSlice";
import DetailTr from "./DetailTr";

const ClassDetail = ({ classId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { classDetail } = useSelector((state) => state.classes);
    const { codes } = useSelector((state) => state.codes);
    const { loading } = useSelector((state) => state.states);
    const [classData, setClassData] = useState(null);

    useEffect(() => {
        dispatch(fetchCodesByType(["class status", "year", "dow", "duration"]));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchClassById(classId));
    }, [dispatch, classId]);

    useEffect(() => {
        if (classDetail) {
            setClassData({ ...classDetail });
        }
    }, [classDetail]);



    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner color="border-black" size="5rem" />
        </div>
    )

    if (!classData) {
        return (
            <>
                <p className="text-center text-gray-500">Không tìm thấy lớp học nào.</p>
                <button
                    onClick={() => navigate("/admin/class-management")}
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
                <div className="relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose">Chi tiết lớp học - {classId}</div>
            </div>
            <div className="flex-grow h-full overflow-y-auto">
                <table className="w-full h-full border-collapse border border-[#E7E7ED]">
                    <thead className="bg-[#F6FAFD]">
                        <tr className="border border-[#E7E7ED]">
                            <th className="p-3 text-[#202325] text-md font-bold font-['Be_Vietnam_Pro'] leading-[18px] w-64">Thuộc tính</th>
                            <th className="p-3 text-[#202325] text-md font-bold font-['Be_Vietnam_Pro'] leading-[18px]">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        <DetailTr
                            title="ID"
                            value={classData?.id}
                            type={0}
                        />
                        <DetailTr
                            title="Tên lớp"
                            placeholder={"Nhập tên lớp"}
                            value={classData?.name}
                            onChange={(e) => setClassData({ ...classData, name: e.target.value })}
                        />
                        <DetailTr
                            title="Mô tả"
                            placeholder={"Nhập mô tả"}
                            value={classData?.description}
                            onChange={(e) => setClassData({ ...classData, description: e.target.value })}
                            type={2}
                        />
                        <DetailTr
                            title="Thứ"
                            value={classData?.dayOfWeek}
                            valueText={Array.isArray(codes["dow"]) ? codes["dow"].find((item) => item.code === classData?.dayOfWeek)?.description : ""}
                            onChange={(option) => setClassData({ ...classData, dow: option })}
                            type={3}
                            options={Array.isArray(codes["dow"]) ? codes["dow"] : []}
                        />
                        <DetailTr
                            title="Thời gian học"
                            placeholder={"Nhập thời gian học"}
                            value={classData?.studyTime}
                            onChange={(option) => setClassData({ ...classData, studyTime: option })}
                            type={3}
                            options={Array.isArray(codes["duration"]) ? codes["duration"] : []}
                        />
                        <DetailTr
                            title="Năm học"
                            value={classData?.academicYear}
                            onChange={(option) => setClassData({ ...classData, academicYear: option })}
                            type={3}
                            options={Array.isArray(codes["year"]) ? codes["year"] : []}
                        />
                        <DetailTr
                            title="Số buổi học"
                            value={classData?.lessonCount}
                            type={0}
                        />
                        <DetailTr
                            title="Số học sinh"
                            value={classData?.studentCount}
                            
                            type={0}
                        />
                        <DetailTr
                            title="Công khai"
                            value={classData?.public}
                            onChange={(option) => setClassData({ ...classData, public: option })}
                            type={3}
                            valueText={classData?.public ? "Công khai" : "Không công khai"}
                            options={[
                                { code: true, description: "Công khai" },
                                { code: false, description: "Không công khai" },
                            ]}
                        />
                        <DetailTr
                            title="Trạng thái lớp học"
                            value={classData?.status}
                            valueText={Array.isArray(codes["class status"]) ? codes["class status"].find((item) => item.code === classData?.status)?.description : ""}
                            onChange={(option) => setClassData({ ...classData, status: option })}
                            type={3}
                            options={Array.isArray(codes["class status"]) ? codes["class status"] : []}
                        />
                        <DetailTr
                            title="Ngày tạo"
                            value={new Date(classData?.createdAt).toLocaleDateString()}
                            type={0}
                        />
                        <DetailTr
                            title="Ngày cập nhật"
                            value={new Date(classData?.updatedAt).toLocaleDateString()}
                            type={0}
                        />
                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default ClassDetail;