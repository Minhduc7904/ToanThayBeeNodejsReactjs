import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions, setLoading, setDetailView } from "../../features/question/questionSlice";
import { setSortOrder } from "../../features/filter/filterSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import LatexRenderer from "../latex/RenderLatex";
import QuestionTableRow from "./QuestionTableRow";
import StatementTableRow from "./StatementTableRow";

const QuestionTable = () => {
    const dispatch = useDispatch();
    const { questions, loading, error } = useSelector((state) => state.questions);
    const { search, currentPage, limit, totalItems, sortOrder } = useSelector(state => state.filter);
    const prefixStatementTN = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const prefixStatementDS = ["a)", "b)", "c)", "d)", "e)", "f)", "g)", "h)", "i)", "j)"];


    useEffect(() => {
        dispatch(setLoading(true)); // Bật trạng thái loading trước khi gọi API

        const timer = setTimeout(() => {
            dispatch(fetchQuestions({ search, currentPage, limit, sortOrder }))
                .unwrap()
                .finally(() => dispatch(setLoading(false)));
        }, 500);

        return () => clearTimeout(timer);
    }, [dispatch, search, currentPage, limit, sortOrder]);

    
    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner color="border-black" size="5rem" />
        </div>
    )

    if (error) {
        const errorMessage = typeof error === "string" ? error : error.message || "Đã xảy ra lỗi";
        return <p className="text-center text-red-500">Error: {errorMessage}</p>;
    }

    return (
        <div className="flex flex-col gap-4 h-full min-h-0">
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
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>

                    </div>
                ) : (
                    <p className="text-center text-gray-500">Không tìm thấy kết quả nào</p>
                )}

            </div>

            <div className="flex-grow h-full overflow-y-auto">
                <table className="w-full h-full border-collapse border border-[#E7E7ED]">
                    <thead className="bg-[#F6FAFD] sticky top-0 z-10">
                        <tr className="border border-[#E7E7ED]">
                            <th className="p-3 text-center">ID</th>
                            <th className="p-3 text-center">Nội dung</th>
                            <th className="p-3 text-center">Kiểu câu hỏi</th>
                            <th className="p-3 text-center">Mệnh đề</th>
                            <th className="p-3 text-center">Đáp án</th>
                            <th className="p-3 text-center">Độ khó</th>
                            <th className="p-3 text-center">Lớp</th>
                            <th className="p-3 text-center">Chương</th>
                            <th className="p-3 text-center">Đã có lời giải</th>
                            <th className="p-3 text-center">Ngày đăng</th>
                            <th className="p-3 text-center">Cập nhật lúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question, index) => (
                            <tr
                                // onClick={() => dispatch(setDetailView(questions.id))}
                                key={question.id} className="border border-[#E7E7ED] hover:bg-gray-50 cursor-pointer">
                                <td className="p-3 text-center">{question.id}</td>
                                <QuestionTableRow question={question} />
                                <td className="p-3 text-center">{question.typeOfQuestion}</td>
                                {question.typeOfQuestion === "TN" && (
                                    <>
                                        <StatementTableRow statements={question.statements} prefixStatements={prefixStatementTN} />
                                        <td className="p-3 text-center">
                                            {question.statements.map((statement, index) => (
                                                <p className={`${statement.isCorrect ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}`}>{statement.isCorrect ? prefixStatementTN[index] : ''}</p>
                                            ))}
                                        </td>
                                    </>

                                )}
                                {question.typeOfQuestion === "DS" && (
                                    <>
                                        <StatementTableRow statements={question.statements} prefixStatements={prefixStatementDS} />

                                        <td className="p-3 text-center">
                                            {question.statements.map((statement, index) => (
                                                <p className={`${statement.isCorrect ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}`}>{statement.isCorrect ? 'Đ' : 'S'}</p>
                                            ))}
                                        </td>
                                    </>
                                )}
                                {question.typeOfQuestion === "TLN" && (
                                    <>
                                        <td className="p-3 ">
                                        </td>
                                        <td className="p-3 text-center text-green-500 font-semibold">
                                            {question.correctAnswer}
                                        </td>
                                    </>
                                )}
                                <td className={`p-3 text-center ${!question.difficulty ? 'text-yellow-500 font-semibold' : ''}`}>
                                    {question.difficulty ? question.difficulty : 'Chưa phân loại'}
                                </td>
                                <td className="p-3 text-center">{question.class}</td>
                                <td className={`p-3 text-center ${!question.chapter ? 'text-yellow-500 font-semibold' : ''}`}>
                                    {question.chapter ? question.chapter : 'Chưa phân loại'}
                                </td>
                                <td className={`p-3 text-center ${!question.solution ? 'text-yellow-500 font-semibold' : 'text-green-500 font-semibold'}`}>
                                    {question.solution ? "Rồi" : 'Chưa'}
                                </td>

                                <td className="p-3 text-center">
                                    {new Date(question.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-center">
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
