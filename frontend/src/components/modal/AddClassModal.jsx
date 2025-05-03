import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import { postClass } from "../../features/class/classSlice";
import { useState, useEffect, use } from "react";
import { fetchCodesByType } from "../../features/code/codeSlice";
import DropMenuBarAdmin from "../dropMenu/OptionBarAdmin";
import { fetchClasses } from "../../features/class/classSlice";

const AddClassModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.states);
    const { codes } = useSelector(state => state.codes);
    const [classData, setClassData] = useState({
        name: "",
        description: "",
        dayOfWeek: "",
        status: "LHD",
        academicYear: "",
        studyTime: "",
        public: true
    })
    const { search, currentPage, limit, sortOrder } = useSelector(state => state.filter);

    useEffect(() => {
        dispatch(fetchCodesByType(["dow", "year", "duration"]))
    }, [dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(postClass(classData))
            .unwrap()
            .then(() => {
                onClose();
                dispatch(fetchClasses({ search, currentPage, limit, sortOrder })).unwrap();
            })
    }

    if (loading) return (
        <div className="flex items-center justify-center h-full w-full">
            <LoadingSpinner
                type="dots"
                color="border-blue-600"
                size="4rem"
                showText={true}
                text="Đang tải..."
            />
        </div>
    )


    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Tên lớp <span className="text-red-500"> *</span>
                    </div>
                    <input
                        type="text"
                        required
                        value={classData.name}
                        onChange={(e) => setClassData({ ...classData, name: e.target.value })}
                        className="w-full py-[0.5rem] px-[0.5rem] bg-white text-sm border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] font-medium font-['Inter'] leading-normal"
                        placeholder="Nhập tên lớp"
                    />
                </div>
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Năm học <span className="text-red-500"> *</span>
                    </div>
                    <DropMenuBarAdmin
                        selectedOption={classData.academicYear}
                        onChange={(option) => setClassData({ ...classData, academicYear: option })}
                        options={
                            Array.isArray(codes.year) ? codes.year : []
                        }
                    />
                </div>

            </div>
            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Thứ <span className="text-red-500"> *</span>
                    </div>
                    <DropMenuBarAdmin
                        selectedOption={classData.dayOfWeek}
                        onChange={(option) => setClassData({ ...classData, dayOfWeek: option })}
                        options={
                            Array.isArray(codes.dow) ? codes.dow : []
                        }
                    />
                </div>
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Thời gian học <span className="text-red-500"> *</span>
                    </div>
                    <DropMenuBarAdmin
                        selectedOption={classData.studyTime}
                        onChange={(option) => setClassData({ ...classData, studyTime: option })}
                        options={
                            Array.isArray(codes.duration) ? codes.duration : []
                        }
                    />
                </div>
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Công khai
                    </div>
                    <DropMenuBarAdmin
                        selectedOption={classData.public}
                        onChange={(option) => setClassData({ ...classData, public: option })}
                        options={[
                            { code: true, description: "Công khai" },
                            { code: false, description: "Không công khai" }
                        ]}
                    />
                </div>

            </div>

            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-bevietnam leading-loose">
                        Mô tả
                    </div>
                    <textarea
                        value={classData.description}
                        onChange={(e) => setClassData({ ...classData, description: e.target.value })}
                        className="w-full h-full text-sm resize-none border-[1px] border-solid border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                        placeholder="Nhập mô tả"
                    />
                </div>
            </div>
            <div className="h-12 inline-flex justify-end items-start mt-[1.25rem] gap-5">
                <button
                    type="button"
                    onClick={onClose}
                    data-icon Position="None" data-mode="Light" data-size="Large" data-state="Disabled" data-type="Outline" className="px-8 py-4 rounded-[48px] outline-1 outline-offset-[-1px] outline-[#253f61] flex justify-center items-center border border-[#253f61] bg-white gap-2.5">
                    <div className="text-center justify-center text-[#253f61] text-base font-medium font-['Inter'] leading-none">Hủy bỏ</div>
                </button>
                <button
                    type="submit"
                    data-icon Position="None" data-mode="Light" data-size="Large" data-state="Default" data-type="Primary" className="h-12 px-8 py-4 bg-[#253f61] rounded-[48px] flex justify-center items-center gap-2.5">
                    <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">Hoàn tất</div>
                </button>
            </div>

        </form>
    )

}

export default AddClassModal;