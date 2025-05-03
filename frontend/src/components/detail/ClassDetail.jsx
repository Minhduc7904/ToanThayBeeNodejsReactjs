import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassById, putClass } from "../../features/class/classSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { setClass } from "../../features/class/classSlice";
import DropMenuBarAdmin from "../dropMenu/OptionBarAdmin";
import { fetchCodesByType } from "../../features/code/codeSlice";
import { setSuccessMessage } from "../../features/state/stateApiSlice";
import DetailTr from "./DetailTr";
import PutMultipleImages from "../image/PutMultipleImages";
import { putSlideImagesForClass } from "../../features/class/classSlice";

const ClassDetail = ({ classId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { classDetail } = useSelector((state) => state.classes);
    const { codes } = useSelector((state) => state.codes);
    const { loading } = useSelector((state) => state.states);
    const [classData, setClassData] = useState(null);
    const initialImages = classDetail?.slide?.slideImages?.map(img => ({
        id: img.id,
        url: img.imageUrl,
    })) || [];
    const handlePutImageFuction = (images, keepImageIds, classId) => {
        dispatch(putSlideImagesForClass({
            classId,
            images,
            keepImageIds,
            slideId: classDetail?.slideId,
        })).unwrap()
            .then(() => {
                if (classId) dispatch(fetchClassById(classId));
            })
    };

    const handleClickedUsers = () => {
        navigate(`/admin/class-management/${classId}/users`);
    };

    const handlePutClass = () => {
        const data = {
            name: classData.name,
            description: classData.description,
            dayOfWeek: classData.dayOfWeek,
            studyTime: classData.studyTime,
            academicYear: classData.academicYear,
            status: classData.status,
            public: classData.public,
        }
        if (classId) dispatch(putClass({data, id: classId}))
    };

    useEffect(() => {
        dispatch(fetchCodesByType(["class status", "year", "dow", "duration"]));
    }, [dispatch]);

    useEffect(() => {
        if (classId) dispatch(fetchClassById(classId));
    }, [dispatch, classId]);

    useEffect(() => {
        if (classDetail) {
            setClassData({ ...classDetail });
        }
    }, [classDetail]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner
                type="dots"
                color="border-blue-600"
                size="4rem"
                showText={true}
                text="Đang tải thông tin lớp học..."
            />
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
                    className={`relative justify-center text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-gray-500 underline`}>
                    Chi tiết
                </div>
                <div
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                    -
                </div>
                <div
                    onClick={handleClickedUsers}
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose "text-[#090a0a] cursor-pointer`}>
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
            <div className="flex w-full h-2 border-b border-[#E7E7ED]"></div>
            <PutMultipleImages
                initialImages={initialImages}
                putImageFunction={handlePutImageFuction}
                classId={classId}
            />
            <div className="flex w-full h-2 border-b border-[#E7E7ED]"></div>
            <div className="flex-grow h-full overflow-y-auto hide-scrollbar">
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
                            title="Mã lớp"
                            value={classData?.class_code}
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
                            onChange={(option) => setClassData({ ...classData, dayOfWeek: option })}
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
            <div className="flex w-full justify-end">
                <button
                    type="button"
                    onClick={handlePutClass}
                    data-icon Position="None" data-mode="Light" data-size="Large" data-state="Default" data-type="Primary"
                    className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800"
                >
                    Lưu
                </button>
            </div>
        </div>
    )

}

export default ClassDetail;