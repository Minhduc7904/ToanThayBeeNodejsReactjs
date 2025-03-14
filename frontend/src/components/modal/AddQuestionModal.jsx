import LatexRenderer from "../latex/RenderLatex";
import { useEffect, useState } from "react";
import DropMenuBarAdmin from "../dropMenu/OptionBarAdmin";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import ImageUpload from "../image/UploadImage";
import { addError } from "../../features/state/stateApiSlice";
import { validateCorrectAnswer, processInput, processInputForUpdate } from "../../utils/question/questionUtils";
import SuggestInputBarAdmin from "../input/suggestInputBarAdmin";
import { postQuestion, fetchQuestions } from "../../features/question/questionSlice";

const AddQuestionModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const { codes } = useSelector((state) => state.codes);
    const [content, setContent] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [questionImage, setQuestionImage] = useState(null);
    const [solutionImage, setSolutionImage] = useState(null);
    const [isNext, setIsNext] = useState(false);
    const [optionChapter, setOptionChapter] = useState([]);
    const { search, currentPage, limit, sortOrder } = useSelector(state => state.filter);
    const { loading } = useSelector(state => state.states);

    const [question, setQuestion] = useState({
        content: "",
        description: "",
        typeOfQuestion: null,
        class: null,
        chapter: null,
        difficulty: null,
        solution: "",
        correctAnswer: null,
        solutionUrl: ""
    });

    const [statements, setStatements] = useState([]);

    const handleStatementChange = (e, index, name) => {
        const { value } = e.target;
        const list = [...statements];
        list[index][name] = value;
        setStatements(list);
    }
    const [statementImages, setStatementImages] = useState([]);

    const handleNextPage = () => {
        // Bước 1: Validate đáp án
        if (!validateCorrectAnswer(question, correctAnswer, dispatch, content)) {
            return;
        }

        // Bước 2: Xử lý input
        const check = processInput(question, correctAnswer, content, dispatch);
        if (!check) return;

        const { questionContent, newStatements } = check;

        // Cập nhật state cho question
        setQuestion((prev) => ({
            ...prev,
            content: questionContent,
            ...(question.typeOfQuestion === "TLN" && { correctAnswer: correctAnswer.trim().replace(",", ".") }),
        }));

        // Cập nhật state cho statements
        setStatements(newStatements);

        setStatementImages(Array(newStatements.length).fill(null));

        // Chuyển sang trang tiếp theo
        setIsNext(true);
    };

    const handleUploadImageStatement = (index, newImg) => {
        // Cập nhật statementImages
        setStatementImages((prev) => {
            const newImages = [...prev];
            newImages[index] = newImg;
            return newImages;
        });

    };

    const handleSummit = (e) => {
        e.preventDefault();
        const statementOptions = statements.map((statement, index) => {
            return {
                content: statement.content,
                isCorrect: statement.isCorrect,
                difficulty: statement.difficulty,
                needImage: statementImages[index] !== null,
            };
        });

        dispatch(postQuestion({
            questionData: question,
            statementOptions,
            questionImage,
            statementImages,
            solutionImage
        }))
            .unwrap()
            .then(() => {
                onClose();
                dispatch(fetchQuestions({ search, currentPage, limit, sortOrder }))
            });

    };

    useEffect(() => {
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
    }, [codes, question.class]);

    if (loading) return (
        <div className="flex items-center justify-center h-full w-full">
            <LoadingSpinner color="border-black" size="5rem" />
        </div>
    )

    return (
        <form
            onSubmit={handleSummit}
            className="flex flex-col gap-[1.25rem] w-full h-full">
            {!isNext ? (
                <>
                    <div className="flex w-full h-[12rem] gap-[1.25rem] items-stretch">
                        <div className="flex-1 flex flex-col gap-[0.25rem]">
                            <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                Câu hỏi và mệnh đề <span className="text-red-500"> *</span>
                            </label>
                            <textarea
                                required
                                placeholder="Nhập nội dung câu hỏi và mệnh đề"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-[0.25rem]">
                            <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                Xem trước Latex
                            </label>
                            <div className="w-full flex-1 border border-[#707070] rounded-[0.5rem] p-[0.5rem] overflow-y-auto break-all">
                                <LatexRenderer text={content} />
                            </div>

                        </div>
                        <ImageUpload
                            image={questionImage}
                            setImage={setQuestionImage}
                            inputId="questionImage-upload"
                        />
                    </div>

                    {/* Kiểu câu hỏi */}
                    <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                        <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                            <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                Kiểu câu hỏi <span className="text-red-500"> *</span>
                            </div>
                            <DropMenuBarAdmin
                                selectedOption={question.typeOfQuestion}
                                onChange={(option) => setQuestion({ ...question, typeOfQuestion: option })}
                                options={Array.isArray(codes["question type"]) ? codes["question type"] : []}
                            />
                        </div>

                        {/* Đáp án */}
                        <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                            <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                Đáp án <span className="text-red-500"> *</span>
                            </div>
                            <input
                                type="text"
                                required
                                value={correctAnswer}
                                onChange={(e) => setCorrectAnswer(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] text-lg font-medium font-['Inter'] leading-normal"
                                placeholder="Nhập đáp án"
                            />
                        </div>
                        <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                        </div>
                    </div>

                    {/* Độ khó & Lớp */}
                    <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                        {/* Độ khó */}
                        <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                            <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                Độ khó
                            </div>
                            <DropMenuBarAdmin
                                selectedOption={question.difficulty}
                                onChange={(option) => setQuestion({ ...question, difficulty: option })}
                                options={Array.isArray(codes["difficulty"]) ? codes["difficulty"] : []}
                            />
                        </div>

                        {/* Lớp */}
                        <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                            <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                Lớp <span className="text-red-500"> *</span>
                            </div>
                            <DropMenuBarAdmin
                                selectedOption={question.class}
                                onChange={(option) => setQuestion({ ...question, class: option })}
                                options={Array.isArray(codes["grade"]) ? codes["grade"] : []}
                            />
                        </div>
                        <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                            <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                Chương
                            </div>
                            <SuggestInputBarAdmin
                                selectedOption={question.chapter}
                                onChange={(option) => setQuestion({ ...question, chapter: option })}
                                options={optionChapter}
                            />
                        </div>
                    </div>
                    <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                        <div className="flex-1 flex flex-col gap-[0.25rem]">
                            <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                Mô tả
                            </label>
                            <textarea
                                placeholder="Nhập mô tả câu hỏi"
                                name="description"
                                value={question.description}
                                onChange={(e) => setQuestion({ ...question, description: e.target.value })}
                                className="w-full h-full resize-none border-[1px] border-solid border-[#707070] rounded-[0.5rem] p-[0.5rem]" />
                        </div>
                    </div>
                    <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                        <div className="flex-1 flex flex-col gap-[0.25rem]">
                            <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                Link lời giải
                            </label>
                            <textarea
                                placeholder="Nhập mô tả câu hỏi"
                                name="description"
                                value={question.solutionUrl}
                                onChange={(e) => setQuestion({ ...question, solutionUrl: e.target.value })}
                                className="w-full h-full resize-none border-[1px] border-solid border-[#707070] rounded-[0.5rem] p-[0.5rem]" />
                        </div>
                    </div>
                    <div className="flex w-full h-[12rem] gap-[1.25rem] items-stretch">
                        <div className="flex-1 flex flex-col gap-[0.25rem]">
                            <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                Lời giải
                            </label>
                            <textarea
                                placeholder="Nhập lời giải"
                                value={question.solution}
                                onChange={(e) => setQuestion({ ...question, solution: e.target.value })}
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
                        <ImageUpload
                            image={solutionImage}
                            setImage={setSolutionImage}
                            inputId="solutionImage-upload"
                        />
                    </div>
                    <div className="h-12 inline-flex justify-end items-start gap-5">
                        <button
                            type="button"
                            onClick={onClose}
                            data-icon data-mode="Light" data-size="Large" data-state="Disabled" data-type="Outline" className="px-8 py-4 rounded-[48px] outline-1 outline-offset-[-1px] outline-[#253f61] flex justify-center items-center border border-[#253f61] bg-white gap-2.5">
                            <div className="text-center justify-center text-[#253f61] text-base font-medium font-['Inter'] leading-none">Hủy bỏ</div>
                        </button>
                        <button
                            type="button"
                            onClick={handleNextPage}
                            data-icon data-mode="Light" data-size="Large" data-state="Default" data-type="Primary" className="h-12 px-8 py-4 bg-[#253f61] rounded-[48px] flex justify-center items-center gap-2.5">
                            <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">Tiếp theo</div>
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex w-full h-full flex-col justify-between ">
                    <div className="flex flex-col gap-[1.25rem] w-full">
                        <div className="flex w-full h-[12rem] gap-[1.25rem] items-stretch">
                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Câu hỏi <span className="text-red-500"> *</span>
                                </label>
                                <textarea
                                    value={question.content}
                                    onChange={(e) => setQuestion({ ...question, content: e.target.value })}
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
                            <ImageUpload
                                image={questionImage}
                                setImage={setQuestionImage}
                                inputId="questionImage-upload"
                            />
                        </div>
                        {question.typeOfQuestion !== "TLN" ? (
                            <>
                                <div className="flex w-full h-[20rem] gap-[1.25rem] items-stretch">
                                    <div className="flex-1 flex flex-col gap-[0.25rem]">
                                        <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                            Mệnh đề <span className="text-red-500"> *</span>
                                        </label>

                                        {statements.map((statement, index) => (
                                            <textarea
                                                key={index}
                                                placeholder="Nhập mệnh đề"
                                                value={statement.content}
                                                onChange={(e) => handleStatementChange(e, index, "content")}
                                                className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-[0.25rem]">
                                        <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                            Xem trước Latex
                                        </label>
                                        {statements.map((statement, index) => (
                                            <div className="w-full flex-1 border border-[#707070] rounded-[0.5rem] p-[0.5rem] overflow-y-auto break-all">
                                                <LatexRenderer text={statement.content} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className=" flex flex-col gap-[0.25rem]">
                                        <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                            Đáp án
                                        </label>
                                        {statements.map((statement, index) => (
                                            <div className={`flex flex-1 p-[0.5rem] overflow-y-auto break-all items-center justify-center ${statement.isCorrect ? "text-green-500" : "text-red-500"}`} >
                                                {statement.isCorrect ? "Đúng" : "Sai"}
                                            </div>
                                        ))}
                                    </div>
                                    {question.typeOfQuestion === "DS" && (
                                        <div className="flex-1 flex flex-col gap-[0.25rem]">
                                            <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                                Độ khó
                                            </label>
                                            {statements.map((statement, index) => (
                                                <DropMenuBarAdmin
                                                    selectedOption={statement.difficulty}
                                                    onChange={(option) => handleStatementChange({ target: { value: option } }, index, "difficulty")}
                                                    options={Array.isArray(codes["difficulty"]) ? codes["difficulty"] : []}
                                                />
                                            ))}

                                        </div>
                                    )}
                                    <div className=" flex flex-col gap-[0.25rem]">
                                        <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                            Hình ảnh
                                        </label>
                                        {statementImages.map((img, index) => (
                                            <ImageUpload
                                                key={index}
                                                question={false}
                                                image={img}
                                                setImage={(newImg) => handleUploadImageStatement(index, newImg)}
                                                inputId={`imageStatement-upload-${index}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                            </>
                        ) : (
                            <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                        Đáp án <span className="text-red-500"> *</span>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={correctAnswer}
                                        onChange={(e) => setCorrectAnswer(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] text-lg font-medium font-['Inter'] leading-normal"
                                        placeholder="Nhập đáp án"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex w-full h-[12rem] gap-[1.25rem] items-stretch">
                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Lời giải
                                </label>
                                <textarea
                                    value={question.solution}
                                    onChange={(e) => setQuestion({ ...question, solution: e.target.value })}
                                    placeholder="Nhập lời giải"
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
                            <ImageUpload
                                image={solutionImage}
                                setImage={solutionImage}
                                inputId="solutionImage-upload"
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
                            type="button"
                            onClick={() => setIsNext(false)}
                            data-icon Position="None" data-mode="Light" data-size="Large" data-state="Default" data-type="Primary" className="h-12 px-8 py-4 bg-[#253f61] rounded-[48px] flex justify-center items-center gap-2.5">
                            <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">Quay lại</div>
                        </button>
                        <button
                            type="submit"
                            data-icon Position="None" data-mode="Light" data-size="Large" data-state="Default" data-type="Primary" className="h-12 px-8 py-4 bg-[#253f61] rounded-[48px] flex justify-center items-center gap-2.5">
                            <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">Hoàn tất</div>
                        </button>
                    </div>

                </div>
            )}

        </form>
    );
};

export default AddQuestionModal;
