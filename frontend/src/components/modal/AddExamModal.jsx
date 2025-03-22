import { use, useEffect, useState } from "react";
import DropMenuBarAdmin from "../dropMenu/OptionBarAdmin";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import ImageUpload from "../image/UploadImage";
import SuggestInputBarAdmin from "../input/suggestInputBarAdmin";
import { postExam } from "../../features/exam/examSlice";
import LatexRenderer from "../latex/RenderLatex";
import { splitContentDS, splitContentTLN, splitContentTN, validateExamData } from "../../utils/question/questionUtils";
import { compose } from "@reduxjs/toolkit";

const AddExamModal = ({ onClose, fetchExams }) => {
    const dispatch = useDispatch();
    const { codes } = useSelector(state => state.codes);
    const [contentTN, setContentTN] = useState("");
    const [contentDS, setContentDS] = useState("");
    const [contentTLN, setContentTLN] = useState("");
    const [correctAnswerTN, setCorrectAnswerTN] = useState("");
    const [correctAnswerDS, setCorrectAnswerDS] = useState("");
    const [correctAnswerTLN, setCorrectAnswerTLN] = useState("");
    const [isStep1, setIsStep1] = useState(true);
    const [isStep2, setIsStep2] = useState(false);
    const [isStep3, setIsStep3] = useState(false);
    const [optionChapter, setOptionChapter] = useState("");
    const { search, currentPage, limit, totalItems, sortOrder } = useSelector(state => state.filter);
    const { loading } = useSelector(state => state.states);
    const [examImage, setExamImage] = useState(null);
    const [questionImages, setQuestionImages] = useState([]);
    const [statementImages, setStatementImages] = useState([]);
    const [i, setI] = useState(0);

    const [examData, setExamData] = useState({
        name: "",
        typeOfExam: null,
        class: null,
        chapter: null,
        year: null,
        description: "",
        testDuration: null,
        passRate: null,
        solutionUrl: "",
        imageUrl: "",
        public: false,
    })

    const [questions, setQuestions] = useState([]);

    const handleQuestionsChange = (e, index, name) => {
        const { value } = e.target;
        const list = [...questions];
        list[index].questionData[name] = value;
        setQuestions(list);
    }

    const handleUploadQuestionImage = (index, newImg) => {
        setQuestionImages((prev) => {
            const list = [...prev];
            list[index] = newImg;
            return list;
        });
        handleQuestionsChange({ target: { value: newImg !== null } }, index, "needImage");
    }

    useEffect(() => {
        console.log(questionImages);
    }, [questionImages])

    const handleStatementChange = (e, index, idxStatement, name) => {
        const { value } = e.target;
        const list = [...questions];
        list[index].statements[idxStatement][name] = value;
        setQuestions(list);
    }


    const handleUploadStatementImage = (index, newImg, idxStatement, idxQuestion) => {
        console.log(statementImages);
        setStatementImages((prev) => {
            const list = [...prev];
            list[index] = newImg;
            handleStatementChange({ target: { value: newImg !== null } }, idxQuestion, idxStatement, "needImage");
            return list;
        });
    }

    const handleSetStep1 = () => {
        setIsStep1(true);
        setIsStep2(false);
        setIsStep3(false);
    }

    const handleSetStep2 = () => {
        if (!validateExamData(examData, dispatch)) {
            return;
        }

        setIsStep1(false);
        setIsStep2(true);
        setIsStep3(false);
    }

    const handleSetStep3 = () => {
        let check = splitContentTN(contentTN, correctAnswerTN, dispatch);
        if (!check) return;
        const questionTN = check.questionsTN;
        const countTN = check.countTN;
        check = splitContentDS(contentDS, correctAnswerDS, countTN, dispatch);
        if (!check) return;
        const questionDS = check.questionsDS;
        const count = check.count;
        check = splitContentTLN(contentTLN, correctAnswerTLN, dispatch);
        if (!check) return;
        const questionTLN = check
        console.log(questionTN, questionDS, questionTLN);
        const questionFake = [...questionTN, ...questionDS, ...questionTLN];
        if (questionFake.length === 0) {
            setIsStep1(false);
            setIsStep2(false);
            setIsStep3(true);
            return;
        }
        setQuestions(questionFake.map((question) => {
            return {
                questionData: {
                    content: question.questionData.content,
                    correctAnswer: question.questionData.correctAnswer ? question.questionData.correctAnswer : null,
                    class: examData.class,
                    typeOfQuestion: question.questionData.typeOfQuestion,
                    needImage: false,
                },
                statements: question.statements?.map((statement) => {
                    return {
                        index: statement.index,
                        difficulty: null,
                        content: statement.content,
                        isCorrect: statement.isCorrect,
                        needImage: false,
                    }
                })
            }
        }));
        setQuestionImages(Array(questionFake.length).fill(null));
        setStatementImages(Array(count).fill(null));


        setIsStep1(false);
        setIsStep2(false);
        setIsStep3(true);
    }

    const handleSummit = (e) => {
        e.preventDefault();
        console.log({
            examData,
            examImage,
            questions,
            questionImages,
            statementImages
        });
        dispatch(postExam({
            examData,
            examImage,
            questions,
            questionImages,
            statementImages
        }))
            .unwrap()
            .then(() => {
                onClose();
                dispatch(fetchExams({ search, currentPage, limit, totalItems, sortOrder }));
            })
    }

    useEffect(() => {
        if (Array.isArray(codes["chapter"])) {
            if (examData.class && examData.class.trim() !== "") {
                setOptionChapter(
                    codes["chapter"].filter((code) => code.code.startsWith(examData.class))
                );
            } else {
                setOptionChapter(codes["chapter"]);
            }
        } else {
            setOptionChapter([]);
        }
    }, [codes, examData.class]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <LoadingSpinner color="border-black" size="5rem" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <div className=" flex flex-row justify-between items-center border-b border-[#e3e4e5]">
                <div className="flex flex-row gap-2 items-center">
                    <div
                        onClick={handleSetStep1}
                        className={`${isStep1 ? 'text-[#253f61] underline' : 'cursor-pointer'} font-bold font-['Be Vietnam Pro'] leading-9`}>
                        Bước 1
                    </div>
                    -
                    <div
                        onClick={handleSetStep2}
                        className={`${isStep2 ? 'text-[#253f61] underline' : 'cursor-pointer'} font-bold font-['Be Vietnam Pro'] leading-9`}>
                        Bước 2
                    </div>
                    -
                    <div
                        onClick={handleSetStep3}
                        className={`${isStep3 ? 'text-[#253f61] underline' : 'cursor-pointer'} font-bold font-['Be Vietnam Pro'] leading-9`}>
                        Bước 3
                    </div>
                </div>
                <div className="flex flex-row items-center text-[#253f61] font-bold font-['Be Vietnam Pro'] leading-9">
                    {isStep1 && "Thông tin đề thi"}
                    {isStep2 && "Câu hỏi"}
                    {isStep3 && "Xác nhận"}
                </div>
            </div>
            <div className="flex flex-col gap-[1.25rem] w-full h-full">
                {isStep1 && (
                    <>
                        <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                            <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                    Tên <span className="text-red-500"> *</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={examData.name}
                                    onChange={(e) => setExamData({ ...examData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] text-lg font-medium font-['Inter'] leading-normal"
                                    placeholder="Nhập tên đề thi"
                                />
                            </div>
                            <ImageUpload
                                key={'exam-image'}
                                image={examImage}
                                setImage={setExamImage}
                                inputId="questionImage-upload"
                            />
                        </div>
                        <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                            {/* Độ khó */}
                            <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                    Kiểu đề <span className="text-red-500"> *</span>
                                </div>
                                <DropMenuBarAdmin
                                    key={'exam-type'}
                                    selectedOption={examData.typeOfExam}
                                    onChange={(option) => {
                                        setExamData({ ...examData, typeOfExam: option, chapter: option === "OT" ? null : examData.chapter })
                                    }}
                                    options={Array.isArray(codes["exam type"]) ? codes["exam type"] : []}
                                />
                            </div>

                            {/* Lớp */}
                            <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                    Lớp <span className="text-red-500"> *</span>
                                </div>
                                <DropMenuBarAdmin
                                    key={'exam class'}
                                    selectedOption={examData.class}
                                    onChange={(option) => setExamData({ ...examData, class: option })}
                                    options={Array.isArray(codes["grade"]) ? codes["grade"] : []}
                                />
                            </div>
                            {examData.typeOfExam === "OT" ? (
                                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                        Chương
                                    </div>
                                    <SuggestInputBarAdmin
                                        selectedOption={examData.chapter}
                                        onChange={(option) => setExamData({ ...examData, chapter: option })}
                                        options={optionChapter}
                                    />
                                </div>
                            ) : (
                                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                </div>
                            )}
                        </div>
                        <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                            {/* Độ khó */}
                            <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                    Năm <span className="text-red-500"> *</span>
                                </div>
                                <DropMenuBarAdmin
                                    key={'exam-year'}
                                    selectedOption={examData.year}
                                    onChange={(option) => setExamData({ ...examData, year: option })}
                                    options={Array.isArray(codes["year"]) ? codes["year"] : []}
                                />
                            </div>

                            {/* Lớp */}
                            <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                    Công khai <span className="text-red-500"> *</span>
                                </div>
                                <DropMenuBarAdmin
                                    selectedOption={examData.public}
                                    onChange={(option) => setExamData({ ...examData, public: option })}
                                    options={[
                                        { code: true, description: "Công khai" },
                                        { code: false, description: "Không công khai" }
                                    ]}
                                />
                            </div>
                            <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                    Tỷ lệ đạt (%)
                                </div>
                                <input
                                    type="number"
                                    // key={'pass-rate'}
                                    required
                                    value={examData.passRate}
                                    onChange={(e) => setExamData({ ...examData, passRate: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] text-lg font-medium font-['Inter'] leading-normal"
                                    placeholder="Nhập tỷ lệ đạt"
                                />
                            </div>
                            <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                    Thời gian (phút)
                                </div>
                                <DropMenuBarAdmin
                                    selectedOption={examData.testDuration}
                                    onChange={(option) => setExamData({ ...examData, testDuration: option })}
                                    options={[
                                        { code: null, description: "Không giới hạn"},
                                        { code: 120, description: "120 phút" },
                                        { code: 90, description: "90 phút" },
                                        { code: 60, description: "60 phút" },
                                        { code: 30, description: "30 phút" },
                                        { code: 15, description: "15 phút" },
                                    ]}
                                />
                            </div>

                        </div>
                        <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                            <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                    Mô tả
                                </div>
                                <textarea
                                    value={examData.description}
                                    onChange={(e) => setExamData({ ...examData, description: e.target.value })}
                                    className="w-full h-full resize-none border-[1px] border-solid border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                    placeholder="Nhập mô tả đề thi"
                                />
                            </div>
                        </div>
                        <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                            <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                    Link lời giải
                                </div>
                                <textarea
                                    value={examData.solutionUrl}
                                    onChange={(e) => setExamData({ ...examData, solutionUrl: e.target.value })}
                                    className="w-full h-full resize-none border-[1px] border-solid border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                    placeholder="Nhập link lời giải"
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
                                onClick={handleSetStep2}
                                data-icon Position="None" data-mode="Light" data-size="Large" data-state="Default" data-type="Primary" className="h-12 px-8 py-4 bg-[#253f61] rounded-[48px] flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">Tiếp theo</div>
                            </button>
                        </div>
                    </>
                )}

                {isStep2 && (
                    <>
                        <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                            <div className="self-stretch px-1 inline-flex w-full items-start gap-10">
                                <div className="inline-flex flex-1 flex-col justify-start w-full items-start gap-2">
                                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                        Đáp án TN <span className="text-red-500"> *</span>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={correctAnswerTN}
                                        onChange={(e) => setCorrectAnswerTN(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] text-lg font-medium font-['Inter'] leading-normal"
                                        placeholder="Nhập đáp án"
                                    />
                                </div>
                                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                        Đáp án Đ/S <span className="text-red-500"> *</span>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={correctAnswerDS}
                                        onChange={(e) => setCorrectAnswerDS(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] text-lg font-medium font-['Inter'] leading-normal"
                                        placeholder="Nhập đáp án"
                                    />
                                </div>
                                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                        Đáp án TLN <span className="text-red-500"> *</span>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={correctAnswerTLN}
                                        onChange={(e) => setCorrectAnswerTLN(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] text-lg font-medium font-['Inter'] leading-normal"
                                        placeholder="Nhập đáp án"
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="flex w-full h-[12rem] gap-[1.25rem] items-stretch">
                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Câu hỏi và mệnh đề TN <span className="text-red-500"> *</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Nhập nội dung câu hỏi và mệnh đề"
                                    value={contentTN}
                                    onChange={(e) => setContentTN(e.target.value)}
                                    className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Xem trước Latex
                                </label>
                                <div className="w-full flex-1 border border-[#707070] rounded-[0.5rem] p-[0.5rem] overflow-y-auto break-all">
                                    <LatexRenderer text={contentTN} />
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full h-[12rem] gap-[1.25rem] items-stretch">
                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Câu hỏi và mệnh đề Đ/S <span className="text-red-500"> *</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Nhập nội dung câu hỏi và mệnh đề"
                                    value={contentDS}
                                    onChange={(e) => setContentDS(e.target.value)}
                                    className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Xem trước Latex
                                </label>
                                <div className="w-full flex-1 border border-[#707070] rounded-[0.5rem] p-[0.5rem] overflow-y-auto break-all">
                                    <LatexRenderer text={contentDS} />
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full h-[12rem] gap-[1.25rem] items-stretch">
                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Câu hỏi và mệnh đề TLN <span className="text-red-500"> *</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Nhập nội dung câu hỏi và mệnh đề"
                                    value={contentTLN}
                                    onChange={(e) => setContentTLN(e.target.value)}
                                    className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                    Xem trước Latex
                                </label>
                                <div className="w-full flex-1 border border-[#707070] rounded-[0.5rem] p-[0.5rem] overflow-y-auto break-all">
                                    <LatexRenderer text={contentTLN} />
                                </div>
                            </div>
                        </div>

                        <div className="h-12 inline-flex justify-end items-start gap-5">
                            <button
                                type="button"
                                onClick={handleSetStep1}
                                data-icon data-mode="Light" data-size="Large" data-state="Disabled" data-type="Outline" className="px-8 py-4 rounded-[48px] outline-1 outline-offset-[-1px] outline-[#253f61] flex justify-center items-center border border-[#253f61] bg-white gap-2.5">
                                <div className="text-center justify-center text-[#253f61] text-base font-medium font-['Inter'] leading-none">Quay Lại</div>
                            </button>
                            <button
                                type="button"
                                onClick={handleSetStep3}
                                data-icon data-mode="Light" data-size="Large" data-state="Default" data-type="Primary" className="h-12 px-8 py-4 bg-[#253f61] rounded-[48px] flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">Tiếp theo</div>
                            </button>
                        </div>
                    </>
                )}

                {(isStep3 && questions.length !== 0) && (
                    <>
                        <div className="flex flex-row gap-5 w-full overflow-x-auto min-h-max border-b border-[#e3e4e5] pb-2">
                            {questions.map((question, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setI(index);
                                    }}
                                    className={`cursor-pointer border border-[#e3e4e5] rounded-[1rem] flex justify-center  whitespace-nowrap items-center gap-2.5 ${i === index ? 'bg-[#253f61] text-white' : 'bg-white text-[#253f61]'} px-2 py-1`}>
                                    Câu hỏi {index + 1}
                                    {/* className="text-[#253f61] font-bold font-['Be Vietnam Pro'] leading-loose whitespace-nowrap">
                                    Câu hỏi {index + 1} */}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-[1.25rem] w-full">
                            <div className="flex w-full h-[12rem] gap-[1.25rem] items-stretch">
                                <div className="flex-1 flex flex-col gap-[0.25rem]">
                                    <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                        Câu hỏi <span className="text-red-500"> *</span>
                                    </label>
                                    <textarea
                                        value={questions[i].questionData.content}
                                        onChange={(e) => handleQuestionsChange(e, i, "content")}
                                        placeholder="Nhập nội dung câu hỏi"
                                        className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-[0.25rem]">
                                    <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                        Xem trước Latex
                                    </label>
                                    <div className="w-full flex-1 border border-[#707070] rounded-[0.5rem] p-[0.5rem] overflow-y-auto break-all">
                                        <LatexRenderer text={questions[i].questionData.content} />
                                    </div>

                                </div>
                                <ImageUpload
                                    key={`question-image ${i}`}
                                    image={questionImages[i]}
                                    setImage={(newImg) => handleUploadQuestionImage(i, newImg)}
                                    inputId={`question-upload-image-${i}`}
                                />
                            </div>
                            <div className="self-stretch px-1 inline-flex justify-start items-start gap-10">
                                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                        Lớp <span className="text-red-500"> *</span>
                                    </div>
                                    <DropMenuBarAdmin
                                        key={i + 'class'}
                                        selectedOption={questions[i].questionData.class}
                                        onChange={(option) => handleQuestionsChange({ target: { value: option } }, i, "class")}
                                        options={Array.isArray(codes["grade"]) ? codes["grade"] : []}
                                    />
                                </div>
                                {questions[i].questionData.typeOfQuestion === "TLN" ? (
                                    <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                        <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                            <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                                                Đáp án <span className="text-red-500"> *</span>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={questions[i].questionData.correctAnswer}
                                                onChange={(e) => handleQuestionsChange(e, i, "correctAnswer")}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-1 outline-[#e3e4e5] inline-flex justify-start items-center gap-2.5 text-[#303437] text-lg font-medium font-['Inter'] leading-normal"
                                                placeholder="Nhập đáp án"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                    </div>
                                )}
                                <div className="inline-flex flex-1 flex-col justify-start items-start gap-2">
                                </div>

                            </div>
                            {questions[i].questionData.typeOfQuestion !== "TLN" && (
                                <>
                                    <div className="flex w-full gap-[1.25rem] items-stretch">
                                        <div className="flex-1 flex flex-col gap-[0.25rem]">
                                            <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                                Mệnh đề <span className="text-red-500"> *</span>
                                            </label>

                                            {questions[i].statements.map((statement, index) => (
                                                <textarea
                                                    key={index}
                                                    placeholder="Nhập mệnh đề"
                                                    value={statement.content}
                                                    onChange={(e) => handleStatementChange(e, i, index, "content")}
                                                    className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                                />
                                            ))}
                                        </div>
                                        <div className="flex-1 flex flex-col gap-[0.25rem]">
                                            <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                                Xem trước Latex
                                            </label>
                                            {questions[i].statements.map((statement, index) => (
                                                <div className="w-full flex-1 border border-[#707070] rounded-[0.5rem] p-[0.5rem] overflow-y-auto break-all">
                                                    <LatexRenderer text={statement.content} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className=" flex flex-col gap-[0.25rem]">
                                            <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                                Đáp án
                                            </label>
                                            {questions[i].statements.map((statement, index) => (
                                                <div className={`flex flex-1 p-[0.5rem] overflow-y-auto break-all items-center justify-center ${statement.isCorrect ? "text-green-500" : "text-red-500"}`} >
                                                    {statement.isCorrect ? "Đúng" : "Sai"}
                                                </div>
                                            ))}
                                        </div>
                                        {questions[i].questionData.typeOfQuestion === "DS" && (
                                            <div className="flex-1 flex flex-col gap-[0.25rem]">
                                                <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                                    Độ khó
                                                </label>
                                                {questions[i].statements.map((statement, index) => (
                                                    <DropMenuBarAdmin
                                                        key={`${index}-${i}-difficulty`}
                                                        selectedOption={statement.difficulty}
                                                        onChange={(option) => handleStatementChange({ target: { value: option } }, i, index, "difficulty")}
                                                        options={Array.isArray(codes["difficulty"]) ? codes["difficulty"] : []}
                                                    />
                                                ))}

                                            </div>
                                        )}
                                        <div className=" flex flex-col gap-[0.25rem]">
                                            <label className="text-[#090a0a] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                                                Hình ảnh
                                            </label>
                                            {questions[i].statements.map((statement, index) => (
                                                <ImageUpload
                                                    key={`${index}-${i}-statement-image`}
                                                    image={statementImages[statement.index] || null}
                                                    setImage={(newImg) => handleUploadStatementImage(statement.index, newImg, index, i)}
                                                    inputId={`statement-upload-${statement.index}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                </>
                            )}
                        </div>

                        <div className="h-12 inline-flex justify-end items-start gap-5">
                            <button
                                type="button"
                                onClick={handleSetStep2}
                                data-icon data-mode="Light" data-size="Large" data-state="Disabled" data-type="Outline" className="px-8 py-4 rounded-[48px] outline-1 outline-offset-[-1px] outline-[#253f61] flex justify-center items-center border border-[#253f61] bg-white gap-2.5">
                                <div className="text-center justify-center text-[#253f61] text-base font-medium font-['Inter'] leading-none">Quay Lại</div>
                            </button>
                            <button
                                type="button"
                                onClick={handleSummit}
                                data-icon data-mode="Light" data-size="Large" data-state="Default" data-type="Primary" className="h-12 px-8 py-4 bg-[#253f61] rounded-[48px] flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">Tạo đề thi</div>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )


}

export default AddExamModal;