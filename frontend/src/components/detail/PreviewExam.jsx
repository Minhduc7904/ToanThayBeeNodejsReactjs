import { fetchExamQuestions } from "../../features/question/questionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import LatexRenderer from "../latex/RenderLatex";
import LoadingSpinner from "../loading/LoadingSpinner";

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

    useEffect(() => {
        dispatch(fetchExamQuestions({ id: examId, search: '', currentPage: 1, limit: 100, sortOrder: 'asc' }));
    }, [examId, dispatch]);

    useEffect(() => {
        console.log(questions);
    }, [questions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <LoadingSpinner color="border-black" size="5rem" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 overflow-y-auto h-full">
            <div className="text-2xl font-bold text-center">{exam?.name}</div>
            <div className="text-lg text-end">
                Thời gian: {exam?.duration ? exam.duration + " phút" : "vô thời hạn"}
            </div>
            <div className="flex w-full flex-col h-auto">
                <div className="text-2xl font-bold">Phần I - Trắc nghiệm</div>
                <div className="flex flex-col gap-4 h-full">
                    {questions.map((question) => {
                        if (question.typeOfQuestion === "TN") {
                            return (
                                <div key={question._id} className="flex flex-col">
                                    <div className="text-lg font-bold">Câu {indexTN++}:</div>
                                    <LatexRenderer text={question.content} className="" />
                                    {question.imageUrl && (
                                        <div className="flex flex-col items-center justify-center w-full h-[16rem] p-5">
                                            <img
                                                src={question.imageUrl}
                                                alt="question"
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-row gap-4">
                                        {question.statements.map((statement, index) => (
                                            <div key={statement._id} className="flex flex-1 flex-col">
                                                <div className="flex flex-1 gap-2">
                                                    <p className="font-bold">{prefixStatementTN[index]}</p>
                                                    <LatexRenderer text={statement.content} className="break-words max-w-[16rem]" />
                                                </div>
                                                {statement.imageUrl && (
                                                    <div className="flex flex-col items-center justify-center w-full h-[12rem]">
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
            <div className="w-full h-[1px] border border-gray-100 my-5"></div>
            <div className="flex w-full flex-col h-auto">
                <div className="text-2xl font-bold">Phần II - Đúng sai</div>
                <div className="flex flex-col gap-4 h-full">
                    {questions.map((question) => {
                        if (question.typeOfQuestion === "DS") {
                            return (
                                <div key={question._id} className="flex flex-col">
                                    <div className="text-lg font-bold">Câu {indexDS++}:</div>
                                    <LatexRenderer text={question.content} />
                                    {question.imageUrl && (
                                        <div className="flex items-center justify-center w-full h-[16rem] p-5">
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
                                                <p className="font-bold">{prefixStatementDS[index]}</p>
                                                <LatexRenderer text={statement.content} className="" />
                                            </div>
                                            {statement.imageUrl && (
                                                <div className="flex justify-start h-[12rem]">
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
                <div className="w-full h-[1px] border border-gray-100 my-5"></div>
                <div className="flex w-full flex-col h-auto">
                    <div className="text-2xl font-bold">Phần III - Trả lời ngắn</div>
                    <div className="flex flex-col gap-4 h-full">
                        {questions.map((question) => {
                            if (question.typeOfQuestion === "TLN") {
                                return (
                                    <div key={question._id} className="flex flex-col">
                                        <div className="text-lg font-bold">Câu {indexTLN++}:</div>
                                        <LatexRenderer text={question.content} />
                                        {question.imageUrl &&
                                            <div className="flex justify-center w-full items-center p-5 h-auto">
                                                <img src={question.imageUrl} alt="question" className="w-[20rem]" />
                                            </div>
                                        }
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewExam;
