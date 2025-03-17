import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuestionById, putImageQuestion, setQuestion, putImageSolution, putStatementImage, putQuestion } from "../../features/question/questionSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import PutImage from "../image/PutImgae";
import LatexRenderer from "../latex/RenderLatex";
import DropMenuBarAdmin from "../dropMenu/OptionBarAdmin";
import SuggestInputBarAdmin from "../input/suggestInputBarAdmin";
import { validateInput, processInputForUpdate } from "../../utils/question/questionUtils";
import { fetchCodesByType } from "../../features/code/codeSlice";
import { useNavigate } from "react-router-dom";

const QuestionDetail = ({ selectedQuestionId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { question } = useSelector((state) => state.questions);
    const { codes } = useSelector((state) => state.codes);
    const { loading } = useSelector((state) => state.states);
    const [editDescription, setEditDescription] = useState(false);
    const [editSolutionUrl, setEditSolutionUrl] = useState(false);
    const [editCorrectAnswer, setEditCorrectAnswer] = useState(false);
    const [editClass, setEditClass] = useState(false);
    const [editDifficulty, setEditDifficulty] = useState(false);
    const [editChapter, setEditChapter] = useState(false);
    const [optionChapter, setOptionChapter] = useState([]);

    useEffect(() => {
        dispatch(fetchQuestionById(selectedQuestionId))
            .unwrap()
    }, [dispatch, selectedQuestionId]);

    useEffect(() => {
        dispatch(fetchCodesByType(["chapter", "difficulty", "question type", "grade"]))
    }, [dispatch]);

    useEffect(() => {
        if (!question) return; // ✅ Kiểm tra tránh lỗi truy cập thuộc tính của null
        if (Array.isArray(codes["chapter"])) {
            if (question.class && question.class.trim() !== "") {
                setOptionChapter(
                    codes["chapter"].filter((code) => code.code.startsWith(question.class))
                );
            } else {
                setOptionChapter(codes["chapter"]);
            }
        } else {
            setOptionChapter([]);
        }
    }, [codes, question?.class]);

    const handlePutImage = (questionId, questionImage) => {
        dispatch(putImageQuestion({ questionId, questionImage }))
            .unwrap()
            .then((data) => dispatch(setQuestion({ ...question, imageUrl: data.newImageUrl ? data.newImageUrl : null })))
    };

    const handlePutImageSolution = (questionId, solutionImage) => {
        dispatch(putImageSolution({ questionId, solutionImage }))
            .unwrap()
            .then((data) => dispatch(setQuestion({ ...question, solutionImageUrl: data.newImageUrl ? data.newImageUrl : null })))
    };

    const handlePutImageStatement = (statementId, statementImage) => {
        dispatch(putStatementImage({ statementId, statementImage }))
            .unwrap()
            .then((data) => dispatch(setQuestion({
                ...question,
                statements: question.statements.map((statement) => statement.id === statementId ? { ...statement, imageUrl: data.newImageUrl ? data.newImageUrl : null } : statement)
            }))
            )
    };

    const handlePutQuestion = () => {
        const processQuestion = processInputForUpdate(question);
        const check = validateInput(processQuestion, dispatch);
        if (!check) return;
        const questionData = {
            content: processQuestion.content,
            difficulty: processQuestion.difficulty,
            chapter: processQuestion.chapter,
            class: processQuestion.class,
            description: processQuestion.description,
            solution: processQuestion.solution,
            solutionUrl: processQuestion.solutionUrl,
        };

        const statements = processQuestion.statements.map((statement) => ({
            id: statement.id,
            content: statement.content,
            isCorrect: statement.isCorrect,
            difficulty: statement.difficulty,
        }));

        dispatch(putQuestion({ questionId: processQuestion.id, questionData, statements }))
            .unwrap()
            .then(() => dispatch(fetchQuestionById(selectedQuestionId))
                .unwrap()
            )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner color="border-black" size="5rem" />
            </div>
        );
    }

    if (!question) {
        return (
            <>
                <p className="text-center text-gray-500">Không tìm thấy câu hỏi.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                >
                    ← Quay lại danh sách
                </button>
            </>

        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
                <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 hover:bg-[#F6FAFD] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M12.6667 8.66675L5.50292 15.8289C5.38989 15.94 5.33337 16.0856 5.33337 16.2312M12.6667 23.3334L5.50292 16.6335C5.38989 16.5224 5.33337 16.3768 5.33337 16.2312M5.33337 16.2312H26.6667" stroke="#131214" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
                <div className="relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose">Chi tiết câu hỏi - {question.id}</div>

            </div>
            <div className="flex w-full h-2 border-b border-[#E7E7ED]"></div>
            <div className="flex flex-col gap-[1.25rem] w-full">
                <div className="flex w-full h-[12rem] gap-[1.25rem] items-stretch">
                    <div className="flex-1 flex flex-col gap-[0.25rem]">
                        <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                            Câu hỏi <span className="text-red-500"> *</span>
                        </label>
                        <textarea
                            value={question.content}
                            onChange={(e) => dispatch(setQuestion({ ...question, content: e.target.value }))}
                            placeholder="Nhập nội dung câu hỏi"
                            className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-[0.25rem]">
                        <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                            Xem trước Latex
                        </label>
                        <div className="w-full flex-1 border border-[#707070] rounded-[0.5rem] p-[0.5rem] overflow-y-auto break-all">
                            <LatexRenderer text={question.content} />
                        </div>
                    </div>
                    <PutImage imageUrl={question.imageUrl} inputId={'content' + question.id} id={question.id}
                        putImageFunction={handlePutImage} />
                </div>


                {question.typeOfQuestion !== "TLN" && (
                    <>
                        <div className="flex w-full h-2 border-b border-[#E7E7ED]"></div>
                        <div className="flex w-full h-[40rem] gap-[1.25rem] items-stretch">
                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Mệnh đề <span className="text-red-500"> *</span>
                                </label>

                                {question.statements.map((statement, index) => (
                                    <textarea
                                        key={index}
                                        placeholder="Nhập mệnh đề"
                                        value={statement.content}
                                        onChange={(e) => dispatch(setQuestion({ ...question, statements: question.statements.map((st, idx) => idx === index ? { ...st, content: e.target.value } : st) }))}
                                        className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                    />
                                ))}
                            </div>
                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Xem trước Latex
                                </label>
                                {question.statements.map((statement, index) => (
                                    <div className="w-full flex-1 border border-[#707070] rounded-[0.5rem] p-[0.5rem] overflow-y-auto break-all">
                                        <LatexRenderer text={statement.content} />
                                    </div>
                                ))}
                            </div>
                            <div className=" flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Đáp án <span className="text-red-500"> *</span>
                                </label>
                                {question.statements.map((statement, index) => (
                                    <DropMenuBarAdmin
                                        selectedOption={statement.isCorrect}
                                        onChange={(value) => dispatch(setQuestion({ ...question, statements: question.statements.map((st, idx) => idx === index ? { ...st, isCorrect: value } : st) }))}
                                        options={[{ code: true, description: "Đúng" }, { code: false, description: "Sai" }]}
                                    />
                                ))}
                            </div>
                            {question.typeOfQuestion === "DS" && (
                                <div className="flex flex-col gap-[0.25rem]">
                                    <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                        Độ khó
                                    </label>
                                    {question.statements.map((statement, index) => (
                                        <DropMenuBarAdmin
                                            selectedOption={statement.difficulty}
                                            placeholder="Chưa phân loại"
                                            onChange={(value) => dispatch(setQuestion({ ...question, statements: question.statements.map((st, idx) => idx === index ? { ...st, difficulty: value } : st) }))}
                                            options={Array.isArray(codes["difficulty"]) ? codes["difficulty"] : []}
                                        />
                                    ))}

                                </div>
                            )}
                            <div className=" flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Hình ảnh
                                </label>
                                {question.statements.map((statement, index) => (
                                    <PutImage imageUrl={statement.imageUrl} inputId={"statement" + statement.id} id={statement.id}
                                        putImageFunction={handlePutImageStatement} />
                                ))}
                            </div>
                        </div>

                    </>
                )}
            </div>
            <div className="flex w-full h-2 border-b border-[#E7E7ED]"></div>

            <div className="flex w-full h-[12rem] gap-[1.25rem] items-stretch">
                <div className="flex-1 flex flex-col gap-[0.25rem]">
                    <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                        Lời giải
                    </label>
                    <textarea
                        value={question.solution}
                        onChange={(e) => dispatch(setQuestion({ ...question, solution: e.target.value }))}
                        placeholder="Nhập nội dung câu hỏi"
                        className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-[0.25rem]">
                    <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                        Xem trước Latex
                    </label>
                    <div className="w-full flex-1 border border-[#707070] rounded-[0.5rem] p-[0.5rem] overflow-y-auto break-all">
                        <LatexRenderer text={question.solution} />
                    </div>
                </div>
                <PutImage imageUrl={question.solutionImageUrl} inputId={'solution' + question.id} id={question.id}
                    putImageFunction={handlePutImageSolution} />
            </div>
            <div className="flex w-full h-2 border-b border-[#E7E7ED]"></div>

            <div className="flex-grow">
                <table className="w-full border-collapse border border-[#E7E7ED]">
                    <thead className="bg-[#F6FAFD]">
                        <tr className="border border-[#E7E7ED]">
                            <th className="p-3 text-[#202325] text-lg font-bold font-['Be_Vietnam_Pro'] leading-[18px] w-64">Thuộc tính</th>
                            <th className="p-3 text-[#202325] text-lg font-bold font-['Be_Vietnam_Pro'] leading-[18px]">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3  text-[#202325] text-lg font-bold">ID</td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {question.id}
                            </td>
                        </tr>

                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3  text-[#202325] text-lg font-bold">Loại câu hỏi <span className="text-red-500"> *</span></td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {codes["question type"].find((code) => code.code === question.typeOfQuestion)?.description}
                            </td>
                        </tr>
                        {question.typeOfQuestion === 'TLN' && (
                            <tr
                                className="border border-[#E7E7ED] ">
                                <td className="p-3 flex justify-between items-center">
                                    <label className="text-[#202325] text-lg font-bold">
                                        Đáp án <span className="text-red-500"> *</span>
                                    </label>

                                    <button onClick={() => setEditCorrectAnswer(!editCorrectAnswer)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </td>
                                <td className="p-3 text-[#72777a] text-lg">
                                    {!editCorrectAnswer ? (
                                        <>{question.correctAnswer ? question.correctAnswer : "Không có đáp án"}</>
                                    ) : (
                                        <input
                                            placeholder="Nhập đáp án"
                                            value={question.correctAnswer}
                                            onChange={(e) => dispatch(setQuestion({ ...question, correctAnswer: e.target.value }))}
                                            className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                        />
                                    )}
                                </td>
                            </tr>
                        )}
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Lớp<span className="text-red-500"> *</span>
                                </label>
                                <button onClick={() => setEditClass(!editClass)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {!editClass ? (
                                    <>{question.class ? question.class : "Chưa phân loại"}</>
                                ) : (
                                    <DropMenuBarAdmin
                                        selectedOption={question.class}
                                        onChange={(option) => dispatch(setQuestion({ ...question, class: option }))}
                                        options={Array.isArray(codes["grade"]) ? codes["grade"] : []}
                                    />
                                )}

                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Độ khó
                                </label>
                                <button onClick={() => setEditDifficulty(!editDifficulty)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {!editDifficulty ? (
                                    <>{question.difficulty ? codes['difficulty'].find((code) => code.code === question.difficulty)?.description : "Chưa phân loại"}</>
                                ) : (
                                    <DropMenuBarAdmin
                                        selectedOption={question.difficulty}
                                        onChange={(option) => dispatch(setQuestion({ ...question, difficulty: option }))}
                                        placeholder="Chưa phân loại"
                                        options={Array.isArray(codes["difficulty"]) ? codes["difficulty"] : []} />
                                )}

                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Chương
                                </label>
                                <button onClick={() => setEditChapter(!editChapter)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>

                            <td className="p-3 text-[#72777a] text-lg">
                                {!editChapter ? (
                                    <>{question.chapter ? codes['chapter'].find((code) => code.code === question.chapter)?.description : "Chưa phân loại"}</>
                                ) : (
                                    <SuggestInputBarAdmin
                                        selectedOption={question.chapter}
                                        onChange={(option) => dispatch(setQuestion({ ...question, chapter: option }))}
                                        options={optionChapter}
                                    />
                                )}

                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Mô tả
                                </label>
                                <button onClick={() => setEditDescription(!editDescription)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>

                            <td className="p-3 text-[#72777a] text-lg break-words max-w-10">
                                {!editDescription ? (
                                    <>{question.description ? question.description : "Không có mô tả"}</>
                                ) : (
                                    <textarea
                                        value={question.description}
                                        placeholder="Nhập mô tả"
                                        onChange={(e) => dispatch(setQuestion({ ...question, description: e.target.value }))}
                                        className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                    />
                                )}
                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3 flex justify-between items-center">
                                <label className="text-[#202325] text-lg font-bold">
                                    Link lời giải
                                </label>

                                <button onClick={() => setEditSolutionUrl(!editSolutionUrl)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {!editSolutionUrl ? (
                                    <>{question.solutionUrl ? question.solutionUrl : "Không có link lời giải"}</>
                                ) : (
                                    <input
                                        placeholder="Nhập link lời giải"
                                        value={question.solutionUrl}
                                        onChange={(e) => dispatch(setQuestion({ ...question, solutionUrl: e.target.value }))}
                                        className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                    />
                                )}
                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3  text-[#202325] text-lg font-bold">Thời gian tạo</td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {new Date(question?.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                        <tr
                            className="border border-[#E7E7ED] ">
                            <td className="p-3  text-[#202325] text-lg font-bold">Thời gian cập nhật</td>
                            <td className="p-3 text-[#72777a] text-lg">
                                {new Date(question?.updatedAt).toLocaleDateString()}
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <div className="flex w-full justify-end">
                <button
                    type="button"
                    onClick={handlePutQuestion}
                    data-icon Position="None" data-mode="Light" data-size="Large" data-state="Default" data-type="Primary"
                    className="h-12 px-8 py-4 bg-[#253f61] hover:bg-[#1b2e47] active:bg-[#16263a] transition-all duration-300 rounded-[48px] flex justify-center items-center gap-2.5"
                >
                    <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">
                        Lưu
                    </div>
                </button>
            </div>


        </div>

    );
};

export default QuestionDetail;
