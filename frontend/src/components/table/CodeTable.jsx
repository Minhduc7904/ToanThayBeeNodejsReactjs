import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import { fetchAllCodes } from "../../features/code/codeSlice";
import { setSortOrder } from "../../features/filter/filterSlice";
import ChangeDescriptionCode from "../../components/modal/ChangeDescriptionCode";

const CodeTable = ({ codes }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.states);
    const { search, currentPage, limit, totalItems, sortOrder } = useSelector(state => state.filter);
    const [id, setId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [code, setCode] = useState(null);
    const optionTypeCode = [
        { code: "chapter", description: "Chương" },
        { code: "exam type", description: "Loại đề" },
        { code: "year", description: "Năm" },
        { code: "grade", description: "Khối (lớp)" },
        { code: "difficulty", description: "Độ khó" },
        { code: "question type", description: "Loại câu hỏi" },
        { code: "highSchool", description: "Trường" },
        { code: "chapter", description: "Chương" },
        { code: "difficulty", description: "Độ khó" },
    ]
    const typeExists = (type) => optionTypeCode.some(option => option.code === type);

    const handleClickedRow = (code) => {
        if (typeExists(code.type)) {
            
            setCode(code);
            setIsEdit(true);
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner color="border-black" size="5rem" />
        </div>
    )

    return (
        <div className="flex flex-col gap-4 h-full min-h-0 text-sm">
            {(isEdit && code) && <ChangeDescriptionCode code={code} onClose={() => setIsEdit(false)} />}
            <div className="flex justify-start items-center">
                {totalItems > 0 ? (
                    <div className="flex justify-between w-full items-center">
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
                    </div>

                ) : (
                    <p className="text-center text-gray-500">Không tìm thấy kết quả nào</p>
                )}
            </div>
            <div className="flex-grow overflow-y-auto">
                <table className="w-full border-collapse border border-[#E7E7ED]">
                    <thead className="bg-[#F6FAFD] sticky top-0 z-10">
                        <tr className="border border-[#E7E7ED]">
                            <th className="py-3 w-16">STT</th>
                            <th className="py-3 w-64">Mã</th>
                            <th className="py-3 w-40">Loại</th>
                            <th className="py-3 w-64">Mô tả</th>
                            <th className="py-3 w-30">Thời gian tạo</th>
                            <th className="py-3 w-30">Thời gian cập nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                        {codes.map((code, index) => (
                            <tr key={code.id} className={`border border-[#E7E7ED] cursor-pointer hover:bg-gray-50`} 
                            onClick={() => handleClickedRow(code)}>
                                <td className="py-3 text-center">{index + 1}</td>
                                <td className="py-3 text-center">{code.code}</td>
                                <td className="py-3 text-center">{code.type}</td>
                                <td className="py-3 text-center">{code.description}</td>
                                <td className="py-3 text-center">{new Date(code.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 text-center">{new Date(code.updatedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}


export default CodeTable