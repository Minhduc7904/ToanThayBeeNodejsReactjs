import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { createCode, fetchAllCodes } from '../../features/code/codeSlice';
import LoadingSpinner from '../loading/LoadingSpinner';
import DropMenuBarAdmin from '../dropMenu/OptionBarAdmin';

const AddCodeModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const [code, setCode] = useState({
        code: "",
        type: "",
        description: "",
    });
    const { search, currentPage, limit, sortOrder } = useSelector(state => state.filter);

    const optionTypeCode = [
        { code: "chapter", description: "Chương" },
        { code: "exam type", description: "Loại đề" },
        { code: "year", description: "Năm" },
        { code: "grade", description: "Khối (lớp)" },
        { code: "difficulty", description: "Độ khó" },
        { code: "question type", description: "Loại câu hỏi" },
        { code: "highSchool", description: "Trường" },
    ]

    const { loading } = useSelector(state => state.states);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createCode(code))
            .unwrap()
            .then(() => {
                onClose();
                dispatch(fetchAllCodes({ search, currentPage, limit, sortOrder })).unwrap();
            });
    }


    if (loading) return (
        <div className="flex items-center justify-center h-full w-full">
            <LoadingSpinner color="border-black" size="5rem" />
        </div>
    )


    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                        Mã <span className="text-red-500"> *</span>
                    </div>
                    <input
                        type="text"
                        required
                        value={code.code}
                        onChange={(e) => setCode({ ...code, code: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] text-lg font-medium font-['Inter'] leading-normal"
                        placeholder="Nhập mã code"
                    />
                </div>
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                        Kiểu <span className="text-red-500"> *</span>
                    </div>
                    <DropMenuBarAdmin
                        selectedOption={code.type}
                        onChange={(option) => setCode({ ...code, type: option })}
                        options={
                            optionTypeCode
                        }
                    />
                </div>

            </div>
            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                        Mô tả
                    </div>
                    <textarea
                        value={code.description}
                        onChange={(e) => setCode({ ...code, description: e.target.value })}
                        className="w-full h-full resize-none border-[1px] border-solid border-[#707070] rounded-[0.5rem] p-[0.5rem]"
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

export default AddCodeModal;