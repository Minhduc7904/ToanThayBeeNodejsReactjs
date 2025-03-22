import { fetchExamQuestions } from "../../features/question/questionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import LatexRenderer from "../latex/RenderLatex";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useReactToPrint } from 'react-to-print';
import header from "../../assets/images/Screenshot 2025-03-18 010039.jpg";
import { BeeMathLogo } from "../logo/BeeMathLogo";
import QRCodeComponent from "../QrCode";

const PreviewExam = ({ examId }) => {
    const dispatch = useDispatch();
    const { questions } = useSelector(state => state.questions);
    const { exam } = useSelector(state => state.exams);
    const prefixStatementTN = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.'];
    const prefixStatementDS = ['a)', 'b)', 'c)', 'd)', 'e)', 'f)', 'g)', 'h)', 'i)', 'j)'];
    let indexTN = 1;
    let indexDS = 1;
    let indexTLN = 1;
    const { loading } = useSelector(state => state.states);
    const examRef = useRef(null);
    // const reactPrint = useReactToPrint();

    const handlePrint = useReactToPrint({
        contentRef: examRef,
        documentTitle: exam?.name || "De Thi",
    });

    useEffect(() => {
        dispatch(fetchExamQuestions({ id: examId, search: '', currentPage: 1, limit: 100, sortOrder: 'asc' }));
    }, [examId, dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <LoadingSpinner color="border-black" size="5rem" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 overflow-y-auto">
            <div className="flex w-full items-center">
                <button
                    onClick={handlePrint}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 15.575C11.8667 15.575 11.7417 15.5543 11.625 15.513C11.5083 15.4717 11.4 15.4007 11.3 15.3L7.7 11.7C7.5 11.5 7.404 11.2667 7.412 11C7.42 10.7333 7.516 10.5 7.7 10.3C7.9 10.1 8.13767 9.996 8.413 9.988C8.68833 9.98 8.92567 10.0757 9.125 10.275L11 12.15V5C11 4.71667 11.096 4.47934 11.288 4.288C11.48 4.09667 11.7173 4.00067 12 4C12.2827 3.99934 12.5203 4.09534 12.713 4.288C12.9057 4.48067 13.0013 4.718 13 5V12.15L14.875 10.275C15.075 10.075 15.3127 9.979 15.588 9.987C15.8633 9.995 16.1007 10.0993 16.3 10.3C16.4833 10.5 16.5793 10.7333 16.588 11C16.5967 11.2667 16.5007 11.5 16.3 11.7L12.7 15.3C12.6 15.4 12.4917 15.471 12.375 15.513C12.2583 15.555 12.1333 15.5757 12 15.575ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18V16C4 15.7167 4.096 15.4793 4.288 15.288C4.48 15.0967 4.71733 15.0007 5 15C5.28267 14.9993 5.52033 15.0953 5.713 15.288C5.90567 15.4807 6.00133 15.718 6 16V18H18V16C18 15.7167 18.096 15.4793 18.288 15.288C18.48 15.0967 18.7173 15.0007 19 15C19.2827 14.9993 19.5203 15.0953 19.713 15.288C19.9057 15.4807 20.0013 15.718 20 16V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6Z" fill="white" />
                    </svg>
                    <p className="text-sm font-bevietnam"> Xuất PDF </p>
                </button>
            </div>


            <div ref={examRef} className="flex flex-col gap-4 bg-white">
                <div className="flex h-[12rem] justify-center flex-col w-full border border-black">
                    <div className="flex h-full items-center border-b border-black">
                        {/* Cột trái */}
                        <div className="flex flex-col justify-center items-center w-[25%] border-r border-black p-5 h-full">
                            <div className="text-sm font-bold font-['Be Vietnam Pro'] text-center">Lớp toán thầy Bee</div>
                            <div className="text-[0.75rem] font-['Be Vietnam Pro'] text-center">GV. Ong Khắc Ngọc</div>
                            <BeeMathLogo className="w-10 h-10 mt-2" />
                        </div>

                        {/* Cột giữa */}
                        <div className="flex flex-col justify-center items-center text-center w-[50%] border-r border-black p-5 h-full">
                            <div className="text-sm italic">Thứ ..., Ngày ..., Tháng ... năm 2025</div>
                            <div className="text-sm font-bold break-words">Lớp {exam?.class} - {exam?.name}</div>
                            <div className="text-[0.75rem] font-bold">Thời gian: {exam?.duration ? exam?.duration + ' phút' : 'vô thời hạn'}</div>
                        </div>

                        {/* Cột phải */}
                        <div className="flex flex-col justify-center items-center w-[25%] gap-2 h-full">
                            {exam?.solutionUrl ? (
                                <>
                                    <QRCodeComponent url={exam?.solutionUrl} size={80} />
                                    <div className="text-[0.75rem] text-center">Scan để xem đáp án</div>
                                </>
                            ) : (
                                <div className="text-[0.75rem] text-center">Không có đáp án</div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex flex-col w-[75%] h-full border-r border-black p-2">
                            <div className="text-[0.75rem] ">Họ và tên: .............................................................................................................................</div>
                            <div className="text-[0.75rem]">Trường: ............................................................................................................................</div>
                        </div>
                        <div className="flex flex-col items-center w-[25%] h-full ">
                            ĐIỂM: .......
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-wrap flex-col h-auto">
                    <div className="text-xl font-bold">Phần I - Trắc nghiệm</div>
                    <div className="flex flex-col">
                        {questions.map((question) => {
                            if (question.typeOfQuestion === "TN") {
                                return (
                                    <div key={question.id} className="flex flex-col avoid-page-break">
                                        <p className="text-sm font-bold">Câu {indexTN++}:</p>
                                        <LatexRenderer text={question.content} className="text-sm" />
                                        {question.imageUrl && (
                                            <div className="flex flex-col items-center justify-center w-full h-[12rem] p-5">
                                                <img
                                                    src={question.imageUrl}
                                                    alt="question"
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>
                                        )}
                                        <div className={`grid ${question.statements.some(s => s.content.length > 50) ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
                                            {question.statements.map((statement, index) => (
                                                <div key={statement._id} className="flex flex-1 flex-col">
                                                    <div className="flex flex-1 gap-2 items-center">
                                                        <p className="text-sm font-bold">{prefixStatementTN[index]}</p>
                                                        <LatexRenderer text={statement.content} className="break-words max-w-[12rem] text-sm" />
                                                    </div>
                                                    {statement.imageUrl && (
                                                        <div className="flex flex-col items-center justify-center w-full h-[10rem]">
                                                            <img
                                                                src={statement.imageUrl}
                                                                alt="statement"
                                                                className="object-contain w-full h-full"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
                <div className="flex w-full flex-wrap flex-col h-auto page-break">
                    <div className="text-xl font-bold">Phần II - Đúng sai</div>
                    <div className="flex flex-col">
                        {questions.map((question) => {
                            if (question.typeOfQuestion === "DS") {
                                return (
                                    <div key={question._id} className="flex flex-col avoid-page-break">
                                        <div className="text-sm font-bold">Câu {indexDS++}:</div>
                                        <LatexRenderer text={question.content} className="text-sm" />
                                        {question.imageUrl && (
                                            <div className="flex items-center justify-center w-full h-[12rem] p-5">
                                                <img

                                                    src={question.imageUrl}
                                                    alt="question"
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-4">
                                            {question.statements.map((statement, index) => (
                                                <div key={statement._id} className="flex flex-1 flex-col">
                                                    <div className="flex flex-1 items-center gap-2">
                                                        <p className="text-sm font-bold">{prefixStatementDS[index]}</p>
                                                        <LatexRenderer text={statement.content} className="text-sm" />
                                                    </div>
                                                    {statement.imageUrl && (
                                                        <div className="flex justify-start h-[10rem]">
                                                            <img
                                                                src={statement.imageUrl}
                                                                alt="statement"
                                                                className="object-contain w-full h-full"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>

                </div>
                <div className="flex w-full flex-wrap flex-col h-auto page-break">
                    <div className="text-xl font-bold">Phần III - Trả lời ngắn</div>
                    <div className="flex flex-col">
                        {questions.map((question) => {
                            if (question.typeOfQuestion === "TLN") {
                                return (
                                    <div key={question._id} className="flex flex-col avoid-page-break">
                                        <div className="text-sm font-bold">Câu {indexTLN++}:</div>
                                        <LatexRenderer text={question.content} className="text-sm" />
                                        {question.imageUrl &&
                                            <div className="flex items-center justify-center w-full h-[12rem] p-5">
                                                <img

                                                    src={question.imageUrl}
                                                    alt="question"
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>
                                        }
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
                <div className="print-footer text-right">
                    Toán thầy Bee 0312345678 100 Bạch Mai, Hai Bà Trưng, Hà Nội
                </div>
            </div>

        </div>
    );
};

export default PreviewExam;
