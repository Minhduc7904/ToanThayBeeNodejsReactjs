import UserLayout from "../../../layouts/UserLayout";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestionAndAnswersByAttempt } from "../../../features/answer/answerSlice";
import { reExamination } from "../../../features/exam/examSlice";
import LatexRenderer from "../../../components/latex/RenderLatex";
import AnswerSummaryPieChart from "../../../components/bar/AnswerSummaryPieChart";
import { useMemo } from "react";
import ScoreSummaryTable from "../../../components/bar/ScoreSummaryTable";
import LoadingSpinner from "../../../components/loading/LoadingSpinner";
import PdfViewer from "../../../components/ViewPdf";

const calculateStatsFromAnswers = (answers, questions) => {
    const stats = {
        TN: { correct: 0, incorrect: 0, unanswered: 0, score: 0 },
        DS: { correct: 0, incorrect: 0, unanswered: 0, score: 0 },
        TLN: { correct: 0, incorrect: 0, unanswered: 0, score: 0 },
    };

    answers.forEach(answer => {
        const { typeOfQuestion, result } = answer;
        if (!stats[typeOfQuestion]) return;

        if (typeOfQuestion === "DS") {
            try {
                const parsed = JSON.parse(answer.answerContent);
                let count = 0;
                parsed.forEach(item => {
                    if (item.answer === questions.find(q => q.id === answer.questionId).statements.find(s => s.id === item.statementId).isCorrect) count += 1;
                })
                if (count === 1) stats[typeOfQuestion].score += 0.1;
                else if (count === 2) stats[typeOfQuestion].score += 0.25;
                else if (count === 3) stats[typeOfQuestion].score += 0.5;
                else if (count === 4) stats[typeOfQuestion].score += 1;
            } catch (err) {

            }
        }

        if (result === true) {
            stats[typeOfQuestion].correct += 1;
            if (typeOfQuestion === "TN") stats[typeOfQuestion].score += 0.25;
            else if (typeOfQuestion === "TLN") stats[typeOfQuestion].score += 0.5;


        } else if (result === false) {
            stats[typeOfQuestion].incorrect += 1;
        } else {
            stats[typeOfQuestion].unanswered += 1;
        }
    });

    return stats;
};



const ScorePage = () => {
    const { attemptId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { exam } = useSelector((state) => state.exams);
    const { questions } = useSelector((state) => state.questions);
    const { answers, score } = useSelector((state) => state.answers);
    const { loading } = useSelector((state) => state.states);
    const prefixStatementTN = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.'];
    const prefixStatementDS = ['a)', 'b)', 'c)', 'd)', 'e)', 'f)', 'g)', 'h)', 'i)', 'j)'];
    const [questionTN, setQuestionTN] = useState([]);
    const [questionDS, setQuestionDS] = useState([]);
    const [questionTLN, setQuestionTLN] = useState([]);
    const [answersDS, setAnswersDS] = useState({});
    const [answersTNTLN, setAnswersTNTLN] = useState({});
    const correctCount = answers.filter(a => a.result === true).length;
    const incorrectCount = answers.filter(a => a.result === false).length;
    const unansweredCount = answers.filter(a => a.result === null || a.answerContent === null).length;
    const [isPart1, setIsPart1] = useState(true);
    const [isPart2, setIsPart2] = useState(false);
    const [isPart3, setIsPart3] = useState(false);
    const stats = useMemo(() => calculateStatsFromAnswers(answers, questions), [answers, questions]);

    const [shownSolutions, setShownSolutions] = useState({});
    const [isReexamining, setIsReexamining] = useState(false);

    // Hàm xử lý chấm lại bài
    const handleReExamination = () => {
        setIsReexamining(true);
        dispatch(reExamination(attemptId))
            .unwrap()
            .then(() => {
                dispatch(fetchQuestionAndAnswersByAttempt({ attemptId }));
            })
            .finally(() => { setIsReexamining(false) });
    };

    useEffect(() => {
        if (questions) {
            setQuestionTN(questions.filter((question) => question.typeOfQuestion === "TN"));
            setQuestionDS(questions.filter((question) => question.typeOfQuestion === "DS"));
            setQuestionTLN(questions.filter((question) => question.typeOfQuestion === "TLN"));
        }
    }, [questions]);

    useEffect(() => {
        const dsAnswers = {};
        const dsAnswersTNTLN = {};
        answers.forEach((answer) => {
            if (answer.typeOfQuestion === "DS") {
                try {
                    if (!answer.answerContent) return;
                    const parsed = JSON.parse(answer.answerContent); // là mảng

                    parsed.forEach(item => {
                        dsAnswers[item.statementId] = item.answer; // ví dụ: { 225: false, 226: false, ... }
                    });
                } catch (err) {
                    console.error("Lỗi parse answerContent:", err);
                }
            } else {
                dsAnswersTNTLN[answer.questionId] = {
                    result: answer.result,
                    answer: answer.answerContent
                };
            }

        });
        setAnswersDS(dsAnswers);
        setAnswersTNTLN(dsAnswersTNTLN);
    }, [answers]);



    useEffect(() => {
        dispatch(fetchQuestionAndAnswersByAttempt({ attemptId }));
    }, [dispatch, attemptId]);

    const toggleSolution = (questionId) => {
        setShownSolutions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    return (
        <UserLayout>
            <div className="flex flex-col  items-center bg-[#F6FAFD] px-4 py-6">
                <div className="w-full max-w-7xl mx-auto overflow-y-auto hide-scrollbar">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-900 font-bevietnam mb-4">
                        <span
                            onClick={() => navigate("/")}
                            className="cursor-pointer"
                        >
                            Trang chủ
                        </span>

                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 15 16" fill="none">
                            <path d="M2.36002 0.940682C2.17719 0.84421 1.97253 0.796607 1.76588 0.802488C1.55924 0.808369 1.35762 0.867534 1.18057 0.974249C1.00352 1.08096 0.857033 1.23161 0.75532 1.41158C0.653607 1.59156 0.600113 1.79476 0.600024 2.00148V13.9975C0.60011 14.2054 0.654199 14.4097 0.756991 14.5903C0.859783 14.771 1.00775 14.9219 1.1864 15.0282C1.36505 15.1345 1.56824 15.1926 1.77608 15.1967C1.98392 15.2009 2.18928 15.151 2.37202 15.0519L13.572 8.97188C14.4152 8.51428 14.408 7.30388 13.5616 6.85588L2.36002 0.940682Z" fill="black" />
                        </svg>
                        <span
                            onClick={() => navigate("/practice")}
                            className="cursor-pointer"
                        >
                            Luyện đề
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 15 16" fill="none">
                            <path d="M2.36002 0.940682C2.17719 0.84421 1.97253 0.796607 1.76588 0.802488C1.55924 0.808369 1.35762 0.867534 1.18057 0.974249C1.00352 1.08096 0.857033 1.23161 0.75532 1.41158C0.653607 1.59156 0.600113 1.79476 0.600024 2.00148V13.9975C0.60011 14.2054 0.654199 14.4097 0.756991 14.5903C0.859783 14.771 1.00775 14.9219 1.1864 15.0282C1.36505 15.1345 1.56824 15.1926 1.77608 15.1967C1.98392 15.2009 2.18928 15.151 2.37202 15.0519L13.572 8.97188C14.4152 8.51428 14.408 7.30388 13.5616 6.85588L2.36002 0.940682Z" fill="black" />
                        </svg>
                        <span
                            onClick={() => navigate("/practice/exam/" + exam.id)}
                            className="cursor-pointer"
                        >
                            {exam?.name}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 15 16" fill="none">
                            <path d="M2.36002 0.940682C2.17719 0.84421 1.97253 0.796607 1.76588 0.802488C1.55924 0.808369 1.35762 0.867534 1.18057 0.974249C1.00352 1.08096 0.857033 1.23161 0.75532 1.41158C0.653607 1.59156 0.600113 1.79476 0.600024 2.00148V13.9975C0.60011 14.2054 0.654199 14.4097 0.756991 14.5903C0.859783 14.771 1.00775 14.9219 1.1864 15.0282C1.36505 15.1345 1.56824 15.1926 1.77608 15.1967C1.98392 15.2009 2.18928 15.151 2.37202 15.0519L13.572 8.97188C14.4152 8.51428 14.408 7.30388 13.5616 6.85588L2.36002 0.940682Z" fill="black" />
                        </svg>
                        <span
                            onClick={() => navigate("/practice/exam/" + exam.id + "/history")}
                            className="cursor-pointer"
                        >
                            Lịch sử làm bài
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 15 16" fill="none">
                            <path d="M2.36002 0.940682C2.17719 0.84421 1.97253 0.796607 1.76588 0.802488C1.55924 0.808369 1.35762 0.867534 1.18057 0.974249C1.00352 1.08096 0.857033 1.23161 0.75532 1.41158C0.653607 1.59156 0.600113 1.79476 0.600024 2.00148V13.9975C0.60011 14.2054 0.654199 14.4097 0.756991 14.5903C0.859783 14.771 1.00775 14.9219 1.1864 15.0282C1.36505 15.1345 1.56824 15.1926 1.77608 15.1967C1.98392 15.2009 2.18928 15.151 2.37202 15.0519L13.572 8.97188C14.4152 8.51428 14.408 7.30388 13.5616 6.85588L2.36002 0.940682Z" fill="black" />
                        </svg>
                        <span
                            className="cursor-pointer text-red-500"
                        >
                            Kết quả
                        </span>
                    </div>

                    {/* Card */}
                    {loading ? (
                        <div className="flex items-center justify-center bg-white rounded-lg shadow-lg p-6 h-screen">
                            <LoadingSpinner
                                type="dots"
                                color="border-blue-600"
                                size="4rem"
                                showText={true}
                                text="Đang tải kết quả bài thi..."
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 gap-3 sm:gap-4">
                            <div className="flex justify-center flex-col gap-3 sm:gap-4">
                                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900 font-inter text-center sm:text-left">
                                    {exam?.name}
                                </div>
                                <hr className="my-2 sm:my-4" />
                                <div className="w-full flex flex-col">
                                    {/* 🔹 Tiêu đề thống kê + điểm */}
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-800">📊 Thống kê kết quả</p>

                                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                                            {score !== undefined && (
                                                <div className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold text-base sm:text-lg rounded-lg shadow-md">
                                                    Điểm của bạn: <span className="text-white">{score}/10</span>
                                                </div>
                                            )}

                                            <button
                                                onClick={handleReExamination}
                                                disabled={isReexamining}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md text-white font-medium transition ${isReexamining ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                            >
                                                {isReexamining ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Đang chấm lại...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        Chấm lại bài
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <hr className="my-3 sm:my-4" />

                                    <div className="w-full flex flex-col md:flex-row justify-center items-center md:items-start gap-4 sm:gap-6">
                                        <ScoreSummaryTable stats={stats} />
                                        <AnswerSummaryPieChart
                                            correct={correctCount}
                                            incorrect={incorrectCount}
                                            unanswered={unansweredCount}
                                        />
                                    </div>

                                </div>
                                <hr className="my-3 sm:my-4" />
                                {exam?.solutionPdfUrl && (
                                    <div className="flex flex-col gap-3 sm:gap-4">
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-800">📄 Lời giải chi tiết</p>
                                        <PdfViewer url={exam?.solutionPdfUrl} />
                                    </div>
                                )}
                                <hr className="my-3 sm:my-4" />

                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-800">📝 Chi tiết bài làm</p>
                                <hr className="my-3 sm:my-4" />
                                <div className={`w-full min-h-full rounded-md flex flex-col gap-3 sm:gap-4 bg-white text-black`}>
                                    {/* Responsive tab navigation */}
                                    <div className="flex flex-col sm:flex-row justify-around text-sm sm:text-base md:text-lg font-bold gap-2 sm:gap-4">
                                        <button
                                            onClick={() => {
                                                setIsPart1(true);
                                                setIsPart2(false);
                                                setIsPart3(false);
                                            }}
                                            className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${isPart1 ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                        >Phần I - Trắc nghiệm</button>
                                        <button
                                            onClick={() => {
                                                setIsPart1(false);
                                                setIsPart2(true);
                                                setIsPart3(false);
                                            }}
                                            className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${isPart2 ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                        >Phần II - Đúng sai</button>
                                        <button
                                            onClick={() => {
                                                setIsPart1(false);
                                                setIsPart2(false);
                                                setIsPart3(true);
                                            }}
                                            className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${isPart3 ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                        >Phần III - Trả lời ngắn</button>
                                    </div>
                                    <hr className="my-4" />
                                    {
                                        isPart1 && (
                                            <div className="flex flex-col gap-4"                                >
                                                {questionTN.map((question, idx) => {
                                                    const userAnswerId = answersTNTLN[question.id]?.answer; // ID mệnh đề người dùng chọn
                                                    const isCorrect = answersTNTLN[question.id]?.result;

                                                    return (
                                                        <div
                                                            key={question.id + "TN"}
                                                            className="flex flex-col avoid-page-break gap-2 rounded-md p-3 transition bg-white shadow"
                                                        >
                                                            {/* Header câu hỏi */}
                                                            <div className="flex items-center gap-2">
                                                                <p className={`text-lg font-bold ${isCorrect === true ? 'text-green-600' : isCorrect === false ? 'text-red-600' : 'text-yellow-500'}`}>
                                                                    Câu {idx + 1}:
                                                                </p>
                                                                {isCorrect === true && (
                                                                    <span className="text-green-600 text-xl">✓</span>
                                                                )}
                                                            </div>

                                                            {/* Nội dung câu hỏi */}
                                                            <LatexRenderer text={question.content} />
                                                            {question.imageUrl && (
                                                                <div className="flex flex-col items-center justify-center w-full p-4">
                                                                    <img
                                                                        src={question.imageUrl}
                                                                        alt="question"
                                                                        className="object-contain w-full h-48 rounded"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Các phương án trả lời */}
                                                            <div className="flex flex-col gap-2">
                                                                {question.statements.map((statement, index) => {
                                                                    const isUserSelected = statement.id == userAnswerId;
                                                                    const isStatementCorrect = statement.isCorrect === true;

                                                                    // Gắn màu và biểu tượng theo trạng thái
                                                                    const colorClass = isStatementCorrect
                                                                        ? 'text-green-600'
                                                                        : isUserSelected
                                                                            ? 'text-red-500'
                                                                            : 'text-black';

                                                                    const icon = isStatementCorrect
                                                                        ? '✓'
                                                                        : isUserSelected
                                                                            ? '✗'
                                                                            : null;

                                                                    return (
                                                                        <div key={statement.id} className="flex items-center gap-2">
                                                                            <p className={`font-bold ${colorClass}`}>{prefixStatementTN[index]}</p>
                                                                            <LatexRenderer text={statement.content} className={`break-words ${colorClass}`} />
                                                                            {icon && (
                                                                                <span className={`ml-2 text-lg font-semibold ${isStatementCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                                                                    {icon}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            <button
                                                                onClick={() => toggleSolution(question.id)}
                                                                className="self-start mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition"
                                                            >
                                                                {shownSolutions[question.id] ? "Ẩn lời giải" : "Hiển thị lời giải"}
                                                            </button>

                                                            {/* Nội dung lời giải */}
                                                            {shownSolutions[question.id] && (
                                                                question.solution || question.solutionImageUrl || question.solutionUrl ? (
                                                                    <div className="mt-2 p-4 rounded bg-gray-200 text-white flex flex-col gap-3">
                                                                        <p className="text-sm font-semibold">Lời giải:</p>

                                                                        {/* Nội dung lời giải văn bản */}
                                                                        {question.solution && (
                                                                            <div className="whitespace-pre-line">
                                                                                <LatexRenderer text={question.solution} />
                                                                            </div>
                                                                        )}

                                                                        {/* Ảnh lời giải */}
                                                                        {question.solutionImageUrl && (
                                                                            <div className="w-full flex justify-center">
                                                                                <img
                                                                                    src={question.solutionImageUrl}
                                                                                    alt="Lời giải bằng hình ảnh"
                                                                                    className="object-contain max-h-80 rounded border"
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {/* Đường dẫn lời giải ngoài */}
                                                                        {question.solutionUrl && (
                                                                            <a
                                                                                href={question.solutionUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="underline text-blue-400 hover:text-blue-300 text-sm transition"
                                                                            >
                                                                                Xem lời giải chi tiết tại đây
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-2 p-4 rounded bg-gray-200 text-black">
                                                                        <p className="text-sm font-semibold mb-1">Lời giải:</p>
                                                                        <div className="whitespace-pre-line">Không có lời giải cho câu hỏi này.</div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    );
                                                })}


                                            </div>
                                        )
                                    }
                                    {
                                        isPart2 && (
                                            <div className="flex flex-col gap-4">
                                                {questionDS.map((question, idx) => (
                                                    <div
                                                        key={question.id + "DS"}
                                                        className={`flex flex-col avoid-page-break gap-2 rounded-md p-3 transition bg-white shadow`}
                                                    >
                                                        <p className=" font-bold">Câu {idx + 1}:</p>
                                                        <LatexRenderer text={question.content} className="" />
                                                        {question.imageUrl && (
                                                            <div className="flex flex-col items-center justify-center w-full p-5"
                                                                style={{ height: `12rem` }}
                                                            >
                                                                <img
                                                                    src={question.imageUrl}
                                                                    alt="question"
                                                                    className="object-contain w-full h-full"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col gap-2">
                                                            <div className="overflow-x-auto -mx-3 sm:mx-0">
                                                                <table className="table-auto w-full text-xs sm:text-sm border border-zinc-300 shadow-sm rounded-md overflow-hidden mb-4">
                                                                    <thead className="bg-zinc-100 text-zinc-700 uppercase text-xs font-semibold">
                                                                        <tr>
                                                                            <th className="border px-2 sm:px-3 py-2 text-left w-[50%] sm:w-[70%]">Mệnh đề</th>
                                                                            <th className="border px-2 sm:px-3 py-2 text-center w-[16%] sm:w-[10%]">Trả lời</th>
                                                                            <th className="border px-2 sm:px-3 py-2 text-center w-[16%] sm:w-[10%]">Đáp án</th>
                                                                            <th className="border px-2 sm:px-3 py-2 text-center w-[18%] sm:w-[10%]">Kết quả</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {question.statements.map((statement, index) => {
                                                                            const userAnswer = answersDS[statement.id];
                                                                            const isCorrect = userAnswer === statement.isCorrect;

                                                                            return (
                                                                                <tr key={statement.id} className={`border ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                                                                                    {/* Mệnh đề + hình ảnh */}
                                                                                    <td className="border px-2 sm:px-3 py-2">
                                                                                        <div className="flex items-start gap-1 sm:gap-2">
                                                                                            <span className="font-bold text-xs sm:text-sm">{prefixStatementDS[index]}</span>
                                                                                            <div className="flex flex-col gap-1 sm:gap-2">
                                                                                                <LatexRenderer text={statement.content} />
                                                                                                {statement.imageUrl && (
                                                                                                    <div className="w-full max-w-xs mx-auto">
                                                                                                        <img
                                                                                                            src={statement.imageUrl}
                                                                                                            alt="statement"
                                                                                                            className="object-contain w-full h-24 sm:h-40 rounded border"
                                                                                                        />
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>

                                                                                    {/* Trả lời */}
                                                                                    <td className="border px-2 sm:px-3 py-2 text-center text-xs sm:text-sm">
                                                                                        {userAnswer === true
                                                                                            ? 'Đúng'
                                                                                            : userAnswer === false
                                                                                                ? 'Sai'
                                                                                                : 'Không trả lời'}
                                                                                    </td>

                                                                                    {/* Đáp án */}
                                                                                    <td className="border px-2 sm:px-3 py-2 text-center text-xs sm:text-sm">
                                                                                        {statement.isCorrect === true ? 'Đúng' : 'Sai'}
                                                                                    </td>

                                                                                    {/* Kết quả */}
                                                                                    <td className="border px-2 sm:px-3 py-2 text-center font-semibold text-xs sm:text-sm">
                                                                                        {isCorrect ? (
                                                                                            <span className="text-green-600">✓ Đúng</span>
                                                                                        ) : (
                                                                                            <span className="text-red-600">✗ Sai</span>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>

                                                                            );

                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => toggleSolution(question.id)}
                                                            className="self-start mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition"
                                                        >
                                                            {shownSolutions[question.id] ? "Ẩn lời giải" : "Hiển thị lời giải"}
                                                        </button>

                                                        {/* Nội dung lời giải */}
                                                        {shownSolutions[question.id] && (
                                                            question.solution || question.solutionImageUrl || question.solutionUrl ? (
                                                                <div className="mt-2 p-4 rounded bg-gray-200 text-white flex flex-col gap-3">
                                                                    <p className="text-sm font-semibold">Lời giải:</p>

                                                                    {/* Nội dung lời giải văn bản */}
                                                                    {question.solution && (
                                                                        <div className="whitespace-pre-line">
                                                                            <LatexRenderer text={question.solution} />
                                                                        </div>
                                                                    )}

                                                                    {/* Ảnh lời giải */}
                                                                    {question.solutionImageUrl && (
                                                                        <div className="w-full flex justify-center">
                                                                            <img
                                                                                src={question.solutionImageUrl}
                                                                                alt="Lời giải bằng hình ảnh"
                                                                                className="object-contain max-h-80 rounded border"
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    {/* Đường dẫn lời giải ngoài */}
                                                                    {question.solutionUrl && (
                                                                        <a
                                                                            href={question.solutionUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="underline text-blue-400 hover:text-blue-300 text-sm transition"
                                                                        >
                                                                            Xem lời giải chi tiết tại đây
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="mt-2 p-4 rounded bg-gray-200 text-black">
                                                                    <p className="text-sm font-semibold mb-1">Lời giải:</p>
                                                                    <div className="whitespace-pre-line">Không có lời giải cho câu hỏi này.</div>
                                                                </div>
                                                            )
                                                        )}

                                                    </div>
                                                ))}
                                                <hr className="my-4" />

                                            </div>
                                        )
                                    }
                                    {
                                        isPart3 && (

                                            <div className="flex flex-col gap-4">
                                                {questionTLN.map((question, idx) => {
                                                    const userAnswer = answersTNTLN[question.id]?.answer || ""; // Trả lời người dùng
                                                    const isCorrect = answersTNTLN[question.id]?.result;
                                                    const correctAnswer = question.correctAnswer || ""; // ⬅️ Đáp án đúng (nếu có)

                                                    return (
                                                        <div
                                                            key={question.id + "TLN"}
                                                            className={`flex flex-col avoid-page-break gap-2 rounded-md p-3 transition bg-white shadow`}
                                                        >
                                                            {/* Header câu hỏi */}
                                                            <div className="flex items-center gap-2">
                                                                <p className={`text-lg font-bold ${isCorrect === true ? 'text-green-600' : isCorrect === false ? 'text-red-600' : 'text-yellow-500'}`}>
                                                                    Câu {idx + 1}:
                                                                </p>
                                                                {isCorrect === true && (
                                                                    <span className="text-green-600 text-xl">✓</span>
                                                                )}
                                                            </div>

                                                            {/* Nội dung câu hỏi */}
                                                            <LatexRenderer text={question.content} />
                                                            {question.imageUrl && (
                                                                <div
                                                                    className="flex flex-col items-center justify-center w-full p-5"
                                                                    style={{ height: `12rem` }}
                                                                >
                                                                    <img
                                                                        src={question.imageUrl}
                                                                        alt="question"
                                                                        className="object-contain w-full h-full"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Câu trả lời của bạn */}
                                                            <div className="mt-2 p-3 border rounded bg-gray-50">
                                                                <p className="text-sm text-gray-500 font-medium mb-1">Câu trả lời của bạn:</p>
                                                                <div className="whitespace-pre-line text-gray-800">
                                                                    {userAnswer.trim() !== "" ? userAnswer.trim() : "Chưa trả lời."}
                                                                </div>
                                                            </div>

                                                            {/* Đáp án đúng (nếu có) */}
                                                            {correctAnswer && (
                                                                <div className="mt-2 p-3 border rounded bg-green-50">
                                                                    <p className="text-sm text-green-600 font-medium mb-1">Đáp án đúng:</p>
                                                                    <div className="whitespace-pre-line text-green-700 font-semibold">
                                                                        <LatexRenderer text={correctAnswer} />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Nút hiển thị lời giải - màu xanh */}
                                                            <button
                                                                onClick={() => toggleSolution(question.id)}
                                                                className="self-start mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition"
                                                            >
                                                                {shownSolutions[question.id] ? "Ẩn lời giải" : "Hiển thị lời giải"}
                                                            </button>

                                                            {/* Nội dung lời giải */}
                                                            {shownSolutions[question.id] && (
                                                                question.solution || question.solutionImageUrl || question.solutionUrl ? (
                                                                    <div className="mt-2 p-4 rounded bg-gray-200 text-white flex flex-col gap-3">
                                                                        <p className="text-sm font-semibold">Lời giải:</p>

                                                                        {/* Nội dung lời giải văn bản */}
                                                                        {question.solution && (
                                                                            <div className="whitespace-pre-line">
                                                                                <LatexRenderer text={question.solution} />
                                                                            </div>
                                                                        )}

                                                                        {/* Ảnh lời giải */}
                                                                        {question.solutionImageUrl && (
                                                                            <div className="w-full flex justify-center">
                                                                                <img
                                                                                    src={question.solutionImageUrl}
                                                                                    alt="Lời giải bằng hình ảnh"
                                                                                    className="object-contain max-h-80 rounded border"
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {/* Đường dẫn lời giải ngoài */}
                                                                        {question.solutionUrl && (
                                                                            <a
                                                                                href={question.solutionUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="underline text-blue-400 hover:text-blue-300 text-sm transition"
                                                                            >
                                                                                Xem lời giải chi tiết tại đây
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-2 p-4 rounded bg-gray-200 text-black">
                                                                        <p className="text-sm font-semibold mb-1">Lời giải:</p>
                                                                        <div className="whitespace-pre-line">Không có lời giải cho câu hỏi này.</div>
                                                                    </div>
                                                                )
                                                            )}


                                                        </div>
                                                    );
                                                })}
                                            </div>

                                        )}

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout >
    )
}

export default ScorePage;
