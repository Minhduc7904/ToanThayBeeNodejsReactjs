import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSortOrder } from "../../features/filter/filterSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import QuestionTableRow from "./QuestionTableRow";
import StatementTableRow from "./StatementTableRow";
import { fetchCodesByType } from "../../features/code/codeSlice";
import TooltipTd from "./TooltipTd";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import { deleteQuestion } from "../../features/question/questionSlice";

const QuestionTable = ({ fetchQuestions, examId = null }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { search, currentPage, limit, totalItems, sortOrder } = useSelector(state => state.filter);
    const { questions } = useSelector(state => state.questions);
    const prefixStatementTN = ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J."];
    const prefixStatementDS = ["a)", "b)", "c)", "d)", "e)", "f)", "g)", "h)", "i)", "j)"];
    const { codes } = useSelector((state) => state.codes);
    const [deleteMode, setDeleteMode] = useState(false);
    const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState(false);
    const [id, setId] = useState(null);
    const { loading } = useSelector(state => state.states);

    const params = useMemo(() => ({
        search,
        currentPage,
        limit,
        sortOrder,
        id: examId
    }), [search, currentPage, limit, sortOrder, examId]);

    useEffect(() => {
        dispatch(fetchCodesByType(["chapter", "difficulty", "question type", "grade"]))
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchQuestions(params))
            .unwrap()
    }, [dispatch, search, currentPage, limit, sortOrder]);

    const handleClickedRow = (id) => {
        if (deleteMode) {
            setIsOpenConfirmDeleteModal(true);
            setId(id);
        } else {
            navigate(`/admin/question-management/${id}`);
        }
    };

    const confirmDeleteModal = () => {
        if (id === null) return;
        dispatch(deleteQuestion(id))
            .unwrap()
            .then(() => {
                dispatch(fetchQuestions((params))).unwrap()
                setIsOpenConfirmDeleteModal(false);
            });
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner color="border-black" size="5rem" />
        </div>
    )

    return (
        <div className="flex flex-col gap-4 h-full min-h-0">
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
                        <button
                            onClick={() => setDeleteMode(!deleteMode)}
                            className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11 0V1.02924H14V3.00351H2V1.02924H5V0H11ZM2 13.7731C2 15.002 3 16 4.23145 16H11.7656C12.9971 16 13.9971 15.002 13.9971 13.7731V4.02339H2V13.7731ZM4 6.01949H12V13.2616C12 13.6702 11.666 14.0039 11.2559 14.0039H4.74414C4.33398 14.0039 4 13.6702 4 13.2616V6.01949ZM9 6.98636H11V12.9747H9V6.98636ZM7 6.98636H5V12.9747H7V6.98636Z"
                                    fill={`${deleteMode ? '#DC3545' : '#28A745'}`} />
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
                            <th className="py-3 text-center w-16">ID</th>
                            <th className="py-3 text-center w-64">Nội dung</th>
                            <th className="py-3 text-center w-32">Kiểu câu hỏi</th>
                            <th className="py-3 text-center w-40">Mệnh đề</th>
                            <th className="py-3 text-center w-40">Đáp án</th>
                            <th className="py-3 text-center w-24">Độ khó</th>
                            <th className="py-3 text-center w-24">Lớp</th>
                            <th className="py-3 text-center w-24">Chương</th>
                            <th className="py-3 text-center w-32">Đã có lời giải</th>
                            <th className="py-3 text-center w-40">Ngày đăng</th>
                            <th className="py-3 text-center w-40">Cập nhật lúc</th>
                        </tr>

                    </thead>
                    <tbody>
                        {questions.map((question, index) => (
                            <tr
                                onClick={() => handleClickedRow(question.id)}
                                key={question.id} className={`border border-[#E7E7ED] cursor-pointer ${deleteMode ? 'hover:bg-red-50' : 'hover:bg-gray-50'}`}>
                                <td className="py-3 text-center">{question.id}</td>
                                <QuestionTableRow question={question} />
                                <TooltipTd 
                                    value={question.typeOfQuestion}
                                    tooltipText={
                                        codes['question type']?.find((code) => code.code === question.typeOfQuestion)?.description || ""
                                    }
                                />
                                {question.typeOfQuestion === "TN" && (
                                    <>
                                        <StatementTableRow statements={question.statements} prefixStatements={prefixStatementTN} />
                                        <td className="py-3 text-center">
                                            {question.statements.map((statement, index) => (
                                                <p key={statement.id || index} className={`${statement.isCorrect ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}`}>{statement.isCorrect ? prefixStatementTN[index].replace(".", "") : ''}</p>
                                            ))}
                                        </td>
                                    </>
                                )}
                                {question.typeOfQuestion === "DS" && (
                                    <>
                                        <StatementTableRow statements={question.statements} prefixStatements={prefixStatementDS} />

                                        <td className="py-3 text-center">
                                            {question.statements.map((statement, index) => (
                                                <p key={statement.id || index} className={`${statement.isCorrect ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}`}>{statement.isCorrect ? 'Đ' : 'S'}</p>
                                            ))}
                                        </td>
                                    </>
                                )}
                                {question.typeOfQuestion === "TLN" && (
                                    <>
                                        <td className="py-3 ">
                                        </td>
                                        <td className="py-3 text-center text-green-500 font-semibold">
                                            {question.correctAnswer}
                                        </td>
                                    </>
                                )}
                                <TooltipTd 
                                    value={question.difficulty}
                                    tooltipText={
                                        codes['difficulty']?.find((code) => code.code === question.difficulty)?.description || ""
                                    }
                                />
                                <td className="py-3 text-center">{question.class}</td>
                                <TooltipTd 
                                    value={question.chapter}
                                    tooltipText={
                                        codes['chapter']?.find((code) => code.code === question.chapter)?.description || ""
                                    }
                                />
                                <TooltipTd 
                                    value={question.solution ? "Rồi" : 'Chưa'}
                                    className={`${question.solution ? 'text-green-500 font-semibold' : 'text-yellow-500 font-semibold'}`}
                                    tooltipText={
                                        question.solution
                                    }
                                    imageUrl={question.solutionImageUrl}
                                />

                                <td className="py-3 text-center">
                                    {new Date(question.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 text-center">
                                    {new Date(question.updatedAt).toLocaleDateString()}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default QuestionTable;
