import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
import { setSortOrder } from "../../features/filter/filterSlice";
import TooltipTd from "./TooltipTd";
import { fetchCodesByType } from "../../features/code/codeSlice";
import { useNavigate } from "react-router-dom";
import { deleteExam } from "../../features/exam/examSlice";

const ExamTable = ({ exams, fetchExams }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.states);
    const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState(false);
    const { search, currentPage, limit, totalItems, sortOrder } = useSelector(state => state.filter);
    const [deleteMode, setDeleteMode] = useState(false);
    const { codes } = useSelector((state) => state.codes);
    const [id, setId] = useState(null);

    const confirmDeleteModal = () => {
        if (id === null) return;
        dispatch(deleteExam(id))
            .unwrap()
            .then(() => {
                dispatch(fetchExams(({ search, currentPage, limit, sortOrder }))).unwrap()
                setIsOpenConfirmDeleteModal(false);
            });
    }

    const handleClickedRow = (id) => {
        if (deleteMode) {
            setIsOpenConfirmDeleteModal(true);
            setId(id);
        } else {
            navigate(`/admin/exam-management/${id}`);
        }
    };

    useEffect(() => {
        dispatch(fetchCodesByType(["chapter", "exam type", "year", "grade", "difficulty", "question type"]))
    }, [dispatch]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner color="border-black" size="5rem" />
        </div>
    )

    return (
        <div className="flex flex-col text-sm gap-4 h-full min-h-0">
            <ConfirmDeleteModal
                isOpen={isOpenConfirmDeleteModal}
                onClose={() => setIsOpenConfirmDeleteModal(false)}
                onConfirm={confirmDeleteModal}
            />
            <div className="flex justify-start items-center">
                {totalItems > 0 ? (
                    <div className="flex justify-between w-full items-center">
                        <div className="flex justify-center items-center gap-2">
                            <p className="text-right text-gray-500">
                                Hiển thị {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalItems)} trong tổng số {totalItems} kết quả
                            </p>
                            <button
                                onClick={() => dispatch(setSortOrder())}
                                className="w-[0.75rem] h-[0.75rem] relative">
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
                        <button
                            onClick={() => setDeleteMode(!deleteMode)}
                            className="relative">
                            <div className="w-[0.75rem] h-[0.75rem]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11 0V1.02924H14V3.00351H2V1.02924H5V0H11ZM2 13.7731C2 15.002 3 16 4.23145 16H11.7656C12.9971 16 13.9971 15.002 13.9971 13.7731V4.02339H2V13.7731ZM4 6.01949H12V13.2616C12 13.6702 11.666 14.0039 11.2559 14.0039H4.74414C4.33398 14.0039 4 13.6702 4 13.2616V6.01949ZM9 6.98636H11V12.9747H9V6.98636ZM7 6.98636H5V12.9747H7V6.98636Z"
                                        fill={`${deleteMode ? '#DC3545' : '#28A745'}`} />
                                </svg>
                            </div>

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
                            <th className="py-3 w-16">ID</th>
                            <th className="py-3 w-64">Tên</th>
                            <th className="py-3 w-16">Kiểu đề</th>
                            <th className="py-3 w-16">Lớp</th>
                            <th className="py-3 w-30">Chương</th>
                            <th className="py-3 w-20">Năm</th>
                            <th className="py-3 w-16">Lời giải</th>
                            <th className="py-3 w-20">Công khai</th>
                            <th className="py-3 w-30">Ngày đăng</th>
                            <th className="py-3 w-30">Cập nhật lúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam, index) => (
                            <tr
                                onClick={() => handleClickedRow(exam.id)}
                                key={exam.id} className={`border border-[#E7E7ED] cursor-pointer ${deleteMode ? 'hover:bg-red-50' : 'hover:bg-gray-50'}`}>
                                <td className="py-3 text-center">{exam.id}</td>
                                <TooltipTd
                                    value={exam.name}
                                    tooltipText={exam.name}
                                    imageUrl={exam.imageUrl}
                                />
                                <TooltipTd
                                    value={exam.typeOfExam}
                                    tooltipText={
                                        codes['exam type']?.find((code) => code.code === exam.typeOfExam)?.description || ""
                                    }
                                />
                                <td className="py-3 text-center">{exam.class}</td>
                                <TooltipTd
                                    value={exam.chapter}
                                    tooltipText={
                                        codes['chapter']?.find((code) => code.code === exam.chapter)?.description || ""
                                    }
                                />
                                <td className="py-3 text-center">{exam.year}</td>
                                <TooltipTd
                                    value={exam.solutionUrl ? "Rồi" : 'Chưa'}
                                    className={`${exam.solutionUrl ? 'text-green-500 font-semibold' : 'text-yellow-500 font-semibold'}`}
                                    tooltipText={
                                        exam.solutionUrl
                                    }
                                />
                                <td className={`py-3 text-center ${exam.public ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}`}>{exam.public ? 'Có' : 'Không'}</td>
                                <td className="py-3 text-center">{new Date(exam.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 text-center">{new Date(exam.updatedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )





}

export default ExamTable;