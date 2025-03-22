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
import DetailTr from "./DetailTr";

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
                            <th className="p-3 text-[#202325] text-md font-bold font-['Be_Vietnam_Pro'] leading-[18px] w-64">Thuộc tính</th>
                            <th className="p-3 text-[#202325] text-md font-bold font-['Be_Vietnam_Pro'] leading-[18px]">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>

                        <DetailTr
                            title={"ID"}
                            value={question.id}
                            type={0}
                            required={true}
                        />
                        <DetailTr
                            title={"Loại câu hỏi"}
                            value={codes["question type"]?.find((code) => code.code === question.typeOfQuestion)?.description}
                            type={0}
                            required={true}
                        />
                        {question.typeOfQuestion === 'TLN' && (
                            <DetailTr
                                title={"Đáp án"}
                                value={question.correctAnswer}
                                onChange={(e) => dispatch(setQuestion({ ...question, correctAnswer: e.target.value }))}
                                type={1}
                                placeholder={"Nhập đáp án"}
                                required={true}
                            />
                        )}
                        <DetailTr
                            title={"Lớp"}
                            value={question.class}
                            onChange={(option) => dispatch(setQuestion({ ...question, class: option }))}
                            type={3}
                            options={Array.isArray(codes["grade"]) ? codes["grade"] : []}
                            required={true}
                        />
                        <DetailTr
                            title={"Độ khó"}
                            value={question.difficulty}
                            valueText={question.difficulty ? codes['difficulty']?.find((code) => code.code === question.difficulty)?.description : "Chưa phân loại"}
                            onChange={(option) => dispatch(setQuestion({ ...question, difficulty: option }))}
                            type={3}
                            options={Array.isArray(codes["difficulty"]) ? codes["difficulty"] : []}
                        />
                        <DetailTr
                            title={"Chương"}
                            value={question.chapter}
                            valueText={question.chapter ? codes['chapter']?.find((code) => code.code === question.chapter)?.description : "Chưa phân loại"}
                            onChange={(option) => dispatch(setQuestion({ ...question, chapter: option }))}
                            type={5}
                            options={optionChapter}
                        />

                        <DetailTr
                            title={"Mô tả"}
                            value={question.description}
                            valueText={question.description ? question.description : "Không có mô tả"}
                            onChange={(e) => dispatch(setQuestion({ ...question, description: e.target.value }))}
                            type={2}
                            placeholder={"Nhập mô tả"}
                        />
                        <DetailTr 
                            title={"Link lời giải"}
                            value={question.solutionUrl}
                            valueText={question.solutionUrl ? question.solutionUrl : "Không có link lời giải"}
                            onChange={(e) => dispatch(setQuestion({ ...question, solutionUrl: e.target.value }))}
                            type={1}
                            placeholder={"Nhập link lời giải"}
                        />
                        <DetailTr
                            title={"Thời gian tạo"}
                            value={new Date(question?.createdAt).toLocaleDateString()}
                            type={0}
                        />
                        <DetailTr
                            title={"Thời gian cập nhật"}
                            value={new Date(question?.updatedAt).toLocaleDateString()}
                            type={0}
                        />
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
                    <div className="text-center justify-center text-white text-md font-medium font-['Inter'] leading-normal">
                        Lưu
                    </div>
                </button>
            </div>


        </div>

    );
};

export default QuestionDetail;
