import HeaderDoExamPage from "../../components/header/HeaderDoExamPage";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, use } from "react";
import { fetchPublicQuestionsByExamId } from "../../features/question/questionSlice";
import { useParams } from "react-router-dom";
import LatexRenderer from "../../components/latex/RenderLatex";
import { useRef } from "react";
import { socket } from "../../services/socket";
import { setErrorMessage, setSuccessMessage } from "../../features/state/stateApiSlice";
import { useNavigate } from "react-router-dom";
import { fetchAnswersByAttempt } from "../../features/answer/answerSlice";
import ExamRegulationModal from "../../components/modal/ExamRegulationModal";

const DoExamPage = () => {
    const { examId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { exam } = useSelector(state => state.exams);
    const { questions } = useSelector(state => state.questions);
    const { answers } = useSelector(state => state.answers);
    const [fontSize, setFontSize] = useState(14); // 14px mặc định
    const [imageSize, setImageSize] = useState(12); // đơn vị: rem
    const [showSettings, setShowSettings] = useState(false);
    const questionRefs = useRef([]);
    const [isAgree, setIsAgree] = useState(false);
    const [attemptId, setAttemptId] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const [remainingTime, setRemainingTime] = useState(0);
    const [saveQuestion, setSaveQuestion] = useState([]);
    const [errorQuestion, setErrorQuestion] = useState([]);
    const prefixStatementTN = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.'];
    const prefixStatementDS = ['a)', 'b)', 'c)', 'd)', 'e)', 'f)', 'g)', 'h)', 'i)', 'j)'];
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("isDarkMode");
        return saved ? JSON.parse(saved) : false;
    });

    const [questionTN, setQuestionTN] = useState([]);
    const [questionDS, setQuestionDS] = useState([]);
    const [questionTLN, setQuestionTLN] = useState([]);
    const [answerTN, setAnswerTN] = useState([]);
    const [answerDS, setAnswerDS] = useState([]);
    const [answerTLN, setAnswerTLN] = useState([]);

    const [dsAnswers, setDsAnswers] = useState({});



    const handleFontSizeChange = (e) => {
        setFontSize(Number(e.target.value));
    };

    const handleImageSizeChange = (e) => {
        setImageSize(Number(e.target.value));
    };

    useEffect(() => {
        if (examId) {
            dispatch(fetchPublicQuestionsByExamId(examId));
        }
    }, [dispatch, examId]);

    useEffect(() => {
        if (questions) {
            setQuestionTN(questions.filter((question) => question.typeOfQuestion === "TN"));
            setQuestionDS(questions.filter((question) => question.typeOfQuestion === "DS"));
            setQuestionTLN(questions.filter((question) => question.typeOfQuestion === "TLN"));
        }
    }, [questions]);

    useEffect(() => {
        if (answers) {
            setAnswerTN(answers.filter((answer) => answer.typeOfQuestion === "TN"));
            setAnswerTLN(answers.filter((answer) => answer.typeOfQuestion === "TLN"));

            // Tạo lại dsAnswers từ answers
            const dsAnswers = {};
            answers.forEach((answer) => {
                if (answer.typeOfQuestion === "DS" && answer.answerContent) {
                    try {
                        if (!answer.answerContent) return;
                        const parsed = JSON.parse(answer.answerContent);
                        dsAnswers[answer.questionId] = parsed;
                    } catch (err) {
                        console.error("Lỗi parse DS answerContent:", err);
                    }
                }
            });

            setDsAnswers(dsAnswers);
        }
    }, [answers]);

    useEffect(() => {
        console.log("Câu trả lời DS:", dsAnswers);
        console.log("Câu trả lời TN:", answerTN);
        console.log("Câu trả lời TLN:", answerTLN);
    }, [dsAnswers, answerTN, answerTLN]);


    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return `${min}:${sec}`;
    };

    const handleFullScreen = async () => {
        await document.documentElement.requestFullscreen();
        setIsAgree(true);
        socket.emit("join_exam", { studentId: user.id, examId });



        socket.on("exam_error", ({ message }) => {
            alert("Lỗi: " + message);
        });
    };
    const handleAutoSubmit = () => {
        if (!attemptId) return;
        console.log("Tự động nộp bài", attemptId);
        socket.emit("submit_exam", { attemptId });
    };

    useEffect(() => {
        if (attemptId) {
            dispatch(fetchAnswersByAttempt(attemptId));
        }
    }, [attemptId]);

    useEffect(() => {
        if (remainingTime <= 0) return handleAutoSubmit();;

        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    // ⏱️ Hết giờ: xử lý tự động nộp bài
                    handleAutoSubmit(); // bạn định nghĩa hàm này
                    return 0;
                }
                return prev - 1;
            });
        }, 1000); // mỗi giây

        return () => clearInterval(interval);
    }, [remainingTime]);

    useEffect(() => {
        // 👉 chỉ kết nối khi cần (sau khi user bấm bắt đầu thi)
        if (isAgree && !socket.connected) {
            socket.connect();
        }
        return () => {
            socket.disconnect();
        };
    }, [isAgree]);

    // frontend
    useEffect(() => {
        if (!attemptId || !user?.id || !examId || attemptId === null || attemptId === undefined) return;
        console.log("luợt làm bài", attemptId)

        const recentLogs = new Set(); // chống log lặp
        const logOnce = (key, payload) => {
            if (recentLogs.has(key)) return;
            recentLogs.add(key);
            socket.emit("user_log", payload);

            // Xoá sau 5s để cho phép log lại
            setTimeout(() => recentLogs.delete(key), 5000);
        };

        // 📌 Thoát fullscreen
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                logOnce("exit_fullscreen", {
                    studentId: user.id,
                    attemptId,
                    examId,
                    code: "EF",
                    action: "exit_fullscreen",
                    detail: JSON.stringify({ reason: "User exited fullscreen mode" }),
                });
            }
        };

        // 📌 Chuyển tab hoặc thu nhỏ trình duyệt
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                logOnce("tab_blur", {
                    studentId: user.id,
                    attemptId,
                    examId,
                    code: "TB",
                    action: "tab_blur",
                    detail: JSON.stringify({ message: "User switched tab or minimized window" }),
                });
            }
        };

        // 📌 Copy nội dung
        const handleCopy = () => {
            logOnce("copy_detected", {
                studentId: user.id,
                attemptId,
                examId,
                code: "COP",
                action: "copy_detected",
                detail: JSON.stringify({ message: "User copied content" }),
            });
        };

        // 📌 Phím đáng ngờ
        const handleSuspiciousKey = (e) => {
            const suspiciousKeys = [
                "F12", "PrintScreen", "Alt", "Tab", "Meta", "Control", "Shift"
            ];
            const combo = `${e.ctrlKey ? "Ctrl+" : ""}${e.shiftKey ? "Shift+" : ""}${e.altKey ? "Alt+" : ""}${e.metaKey ? "Meta+" : ""}${e.key}`;

            if (
                suspiciousKeys.includes(e.key) ||
                combo === "Ctrl+Shift+I" ||
                combo === "Ctrl+Shift+C"
            ) {
                logOnce(`key_${combo}`, {
                    studentId: user.id,
                    attemptId,
                    examId,
                    code: "SK",
                    action: "suspicious_key",
                    detail: JSON.stringify({ key: e.key, code: e.code, combo }),
                });
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("copy", handleCopy);
        document.addEventListener("keydown", handleSuspiciousKey);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("copy", handleCopy);
            document.removeEventListener("keydown", handleSuspiciousKey);
        };
    }, [socket, user.id, examId, attemptId]);



    document.addEventListener("copy", (e) => {
        e.preventDefault();
    });

    const handleExitFullscreen = () => {
        document.exitFullscreen().catch(err => {
            console.warn("Không thể thoát fullscreen:", err);
        });
    };

    useEffect(() => {
        socket.on("exam_started", ({ attemptId, startTime }) => {
            setAttemptId(attemptId);
            if (exam?.testDuration && startTime) {
                const start = new Date(startTime); // Thời gian từ server
                const now = new Date();            // Thời gian hiện tại
                const elapsedSeconds = Math.floor((now - start) / 1000); // Đã trôi qua bao lâu

                const totalSeconds = exam.testDuration * 60;
                const remaining = Math.max(totalSeconds - elapsedSeconds, 0); // Trừ đi thời gian đã trôi
                console.log("Còn lại:", remaining, "giây");
                setRemainingTime(remaining);
            }
        });
        return () => {
            socket.off("exam_started");
        }
    }, [exam, socket]);

    useEffect(() => {
        socket.on("exam_submitted", ({ message }) => {
            dispatch(setSuccessMessage(message));
            setAttemptId(null);
            handleExitFullscreen()
            navigate(`/practice/exam/${examId}`);
        });

        socket.on("submit_error", ({ message }) => {
            dispatch(setErrorMessage(message));

        });

        socket.on("answer_saved", ({ questionId }) => {
            setSaveQuestion((prev) => [...prev, questionId]);
        });

        socket.on("answer_error", ({ questionId, message }) => {
            dispatch(setErrorMessage(message));
            setErrorQuestion((prev) => [...prev, questionId]);
        });

        return () => {
            socket.off("answer_saved");
            socket.off("answer_error");
            socket.off("exam_submitted");
            socket.off("submit_error");
        };
    }, []);

    useEffect(() => {
        localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const scrollToQuestion = (index) => {
        setSelectedQuestion(index);
        const element = questionRefs.current[index];
        if (element) {
            const offset = 80; // chiều cao của header sticky (tuỳ bạn)
            const y = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const handleSelectAnswerTN = (questionId, statementId, type) => {
        const payload = {
            attemptId,
            questionId,
            answerContent: statementId,
            studentId: user.id, // nếu cần xác định user
            type,
        };
        const newAnswer = {
            questionId,
            answerContent: statementId,
            typeOfQuestion: type,
        };
        setAnswerTN((prev) => {
            const filtered = prev.filter((a) => a.questionId !== questionId);
            return [...filtered, newAnswer];
        });

        socket.emit("select_answer", payload);
    };

    const handleSelectAnswerDS = (questionId, statementId, selectedAnswer) => {

        setDsAnswers(prev => {
            const currentAnswers = prev[questionId] || [];

            const existing = currentAnswers.find(ans => ans.statementId === statementId);

            // 🔁 Nếu đáp án đã giống thì không gửi lại
            if (existing && existing.answer === selectedAnswer) {
                return prev;
            }

            const updatedAnswers = currentAnswers.map(ans =>
                ans.statementId === statementId
                    ? { ...ans, answer: selectedAnswer }
                    : ans
            );

            // Nếu chưa có statement này
            if (!existing) {
                updatedAnswers.push({ statementId, answer: selectedAnswer });
            }

            const newState = {
                ...prev,
                [questionId]: updatedAnswers
            };

            // ✨ Gửi toàn bộ lên server
            socket.emit("select_answer", {
                questionId,
                answerContent: newState[questionId],
                studentId: user.id,
                attemptId,
                type: "DS"
            });

            return newState;
        });
    };


    const handleSelectAnswerTLN = (questionId, answerContent, type) => {
        if (!answerContent.trim()) return;
        const payload = {
            attemptId,
            questionId,
            answerContent: answerContent.trim(),
            studentId: user.id,
            type,
        };

        socket.emit("select_answer", payload);
    }

    const isTNSelected = (questionId, statementId) => {
        const isSelected = answerTN.some(
            (ans) =>
                ans.questionId === questionId &&
                ans.answerContent &&
                String(ans.answerContent) === String(statementId)
        );

        if (isSelected && !saveQuestion.includes(questionId)) {
            setSaveQuestion((prev) => [...prev, questionId]);
        }

        return isSelected;
    };

    const isDSChecked = (questionId, statementId, bool) => {
        const isSelected = dsAnswers[questionId]?.some(
            (a) => a.statementId === statementId && a.answer === bool
        ) || false;

        if (isSelected && !saveQuestion.includes(questionId) && dsAnswers[questionId]?.length === 4) {
            setSaveQuestion((prev) => [...prev, questionId]);
        }

        return isSelected;
    };

    const getTLNDefaultValue = (questionId) => {
        const matched = answerTLN.find((ans) => ans.questionId === questionId);
        const content = matched?.answerContent?.replace(/^"|"$/g, "") || "";

        if (content && !saveQuestion.includes(questionId)) {
            setSaveQuestion((prev) => [...prev, questionId]);
        }

        return content;
    };



    return (
        <div className={`flex flex-col w-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#F6FAFD] text-black'}`}>
            <HeaderDoExamPage nameExam={exam?.name} onExitFullscreen={handleExitFullscreen} />
            {isAgree ? (
                <div className="flex flex-1 w-full gap-4 px-4 pb-4 mt-20 ">
                    {/* Main Content */}
                    <div className={`w-full min-h-full rounded-md flex flex-col shadow-md p-4 gap-4 pr-[22rem] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}>

                        <div className="text-2xl font-bold">Phần I - Trắc nghiệm</div>
                        <div className="flex flex-col gap-4"
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            {questionTN.map((question, idx) => (
                                <div
                                    key={question.id + "TN"}
                                    ref={(el) => (questionRefs.current[question.id] = el)}
                                    className={`flex flex-col avoid-page-break gap-2 rounded-md p-3 transition 
                                  ${selectedQuestion === question.id
                                            ? isDarkMode
                                                ? "border-2 border-yellow-400 bg-gray-700"
                                                : "border-2 border-yellow-400 bg-yellow-50"
                                            : ""}`}
                                >
                                    <p className=" font-bold">Câu {idx + 1}:</p>
                                    <LatexRenderer text={question.content} className="" />
                                    {question.imageUrl && (
                                        <div className="flex flex-col items-center justify-center w-full p-5"
                                            style={{ height: `${imageSize}rem` }}
                                        >
                                            <img
                                                src={question.imageUrl}
                                                alt="question"
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        {question.statements.map((statement, index) => (
                                            <div key={statement.id} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`question-${question.id}`}
                                                    value={statement.id}
                                                    checked={isTNSelected(question.id, statement.id)}
                                                    onChange={() =>
                                                        handleSelectAnswerTN(question.id, statement.id, question.typeOfQuestion)
                                                    }
                                                    className="w-4 h-4 accent-blue-600"
                                                />


                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold">{prefixStatementTN[index]}</p>
                                                        <LatexRenderer text={statement.content} className="break-words" />
                                                    </div>
                                                    {statement.imageUrl && (
                                                        <div
                                                            className="flex items-center justify-center w-full"
                                                            style={{ height: `${imageSize - 2}rem` }}
                                                        >
                                                            <img
                                                                src={statement.imageUrl}
                                                                alt="statement"
                                                                className="object-contain w-full h-full"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                    </div>

                                </div>
                            ))}

                        </div>
                        <hr className="my-4" />
                        <div className="text-2xl font-bold">Phần II - Đúng sai</div>
                        <div className="flex flex-col gap-4"
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            {questionDS.map((question, idx) => (
                                <div
                                    key={question.id + "DS"}
                                    ref={(el) => (questionRefs.current[question.id] = el)}
                                    className={`flex flex-col avoid-page-break gap-2 rounded-md p-3 transition 
                             ${selectedQuestion === question.id
                                            ? isDarkMode
                                                ? "border-2 border-yellow-400 bg-gray-700"
                                                : "border-2 border-yellow-400 bg-yellow-50"
                                            : ""}`}
                                >
                                    <p className=" font-bold">Câu {idx + 1}:</p>
                                    <LatexRenderer text={question.content} className="" />
                                    {question.imageUrl && (
                                        <div className="flex flex-col items-center justify-center w-full p-5"
                                            style={{ height: `${imageSize}rem` }}
                                        >
                                            <img
                                                src={question.imageUrl}
                                                alt="question"
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        {question.statements.map((statement, index) => (
                                            <div key={statement.id} className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between gap-2">

                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold">{prefixStatementDS[index]}</p>
                                                        <LatexRenderer text={statement.content} className="break-words" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="flex items-center gap-1">
                                                            <input
                                                                type="radio"
                                                                name={`ds-${statement.id}`}
                                                                checked={
                                                                    isDSChecked(question.id, statement.id, true)
                                                                }
                                                                value="false"
                                                                className="w-4 h-4 accent-blue-600"
                                                                onChange={() => handleSelectAnswerDS(question.id, statement.id, true)}
                                                            />

                                                            <span className="text-ge">Đúng</span>
                                                        </label>
                                                        <label className="flex items-center gap-1">
                                                            <input
                                                                type="radio"
                                                                name={`ds-${statement.id}`}
                                                                checked={
                                                                    isDSChecked(question.id, statement.id, false)
                                                                }
                                                                value="false"
                                                                className="w-4 h-4 accent-blue-600"
                                                                onChange={() => handleSelectAnswerDS(question.id, statement.id, false)}
                                                            />
                                                            <span>Sai</span>
                                                        </label>
                                                    </div>
                                                    {/* Tích chọn Đúng / Sai */}

                                                </div>

                                                {statement.imageUrl && (
                                                    <div
                                                        className="flex flex-col items-center justify-center w-full"
                                                        style={{ height: `${imageSize - 2}rem` }}
                                                    >
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
                            ))}
                            <hr className="my-4" />

                        </div>
                        <div className="text-2xl font-bold">Phần III - Trả lời ngắn</div>
                        <div className="flex flex-col gap-4" style={{ fontSize: `${fontSize}px` }}>
                            {questionTLN.map((question, idx) => (
                                <div
                                    key={question.id + "TN"}
                                    ref={(el) => (questionRefs.current[question.id] = el)}
                                    className={`flex flex-col avoid-page-break gap-2 rounded-md p-3 transition 
                              ${selectedQuestion === question.id
                                            ? isDarkMode
                                                ? "border-2 border-yellow-400 bg-gray-700"
                                                : "border-2 border-yellow-400 bg-yellow-50"
                                            : ""}`}
                                >
                                    <p className="font-bold">Câu {idx + 1}:</p>
                                    <LatexRenderer text={question.content} />
                                    {question.imageUrl && (
                                        <div
                                            className="flex flex-col items-center justify-center w-full p-5"
                                            style={{ height: `${imageSize}rem` }}
                                        >
                                            <img
                                                src={question.imageUrl}
                                                alt="question"
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    )}
                                    {/* Input trả lời */}
                                    <input
                                        placeholder="Nhập câu trả lời..."
                                        defaultValue={getTLNDefaultValue(question.id)}
                                        className={`border rounded-md p-2 shadow resize-none w-[12rem] text-sm 
    ${isDarkMode ? "bg-gray-700 text-white border-gray-500 placeholder-gray-300" : "bg-white text-black"}`}
                                        onBlur={(e) => handleSelectAnswerTLN(question.id, e.target.value, "TLN")}
                                    />

                                </div>
                            ))}
                        </div>

                    </div>
                    
                    <div className={`w-[20rem] h-[90vh] fixed lg:top-20 lg:right-0 sm:bottom-0 flex flex-col gap-4 items-center justify-start mr-2 overflow-y-auto hide-scrollbar`}>
                        <div className={`w-full items-center justify-center p-4 border border-gray-200 drop-shadow-md rounded-md
    ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <button onClick={() => setShowSettings(prev => !prev)} className="transition-transform duration-500 w-full">
                                <svg
                                    className={`transform transition-transform duration-500 ${showSettings ? "rotate-180" : "rotate-0"} ${isDarkMode ? 'fill-white' : 'fill-black'}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                                >
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.208 4.83C14.6613 4.97 15.0947 5.15 15.508 5.37L17.341 4.27C17.5321 4.15536 17.7561 4.10786 17.9773 4.13504C18.1985 4.16221 18.4043 4.26251 18.562 4.42L19.58 5.438C19.7375 5.5957 19.8378 5.80149 19.865 6.02271C19.8921 6.24392 19.8446 6.46787 19.73 6.659L18.63 8.492C18.85 8.90533 19.03 9.33867 19.17 9.792L21.243 10.311C21.4592 10.3652 21.6512 10.49 21.7883 10.6658C21.9255 10.8415 22 11.0581 22 11.281V12.719C22 12.9419 21.9255 13.1585 21.7883 13.3342C21.6512 13.51 21.4592 13.6348 21.243 13.689L19.17 14.208C19.03 14.6613 18.85 15.0947 18.63 15.508L19.73 17.341C19.8446 17.5321 19.8921 17.7561 19.865 17.9773C19.8378 18.1985 19.7375 18.4043 19.58 18.562L18.562 19.58C18.4043 19.7375 18.1985 19.8378 17.9773 19.865C17.7561 19.8921 17.5321 19.8446 17.341 19.73L15.508 18.63C15.0947 18.85 14.6613 19.03 14.208 19.17L13.689 21.243C13.6348 21.4592 13.51 21.6512 13.3342 21.7883C13.1585 21.9255 12.9419 22 12.719 22H11.281C11.0581 22 10.8415 21.9255 10.6658 21.7883C10.49 21.6512 10.3652 21.4592 10.311 21.243L9.792 19.17C9.3427 19.0312 8.90744 18.8504 8.492 18.63L6.659 19.73C6.46787 19.8446 6.24392 19.8921 6.02271 19.865C5.80149 19.8378 5.5957 19.7375 5.438 19.58L4.42 18.562C4.26251 18.4043 4.16221 18.1985 4.13504 17.9773C4.10786 17.7561 4.15536 17.5321 4.27 17.341L5.37 15.508C5.14964 15.0926 4.96885 14.6573 4.83 14.208L2.757 13.689C2.54092 13.6349 2.3491 13.5101 2.21196 13.3346C2.07483 13.1591 2.00023 12.9428 2 12.72V11.282C2.00001 11.0591 2.0745 10.8425 2.21166 10.6668C2.34881 10.491 2.54075 10.3662 2.757 10.312L4.83 9.793C4.97 9.33967 5.15 8.90633 5.37 8.493L4.27 6.66C4.15536 6.46887 4.10786 6.24492 4.13504 6.02371C4.16221 5.80249 4.26251 5.5967 4.42 5.439L5.438 4.42C5.5957 4.26251 5.80149 4.16221 6.02271 4.13504C6.24392 4.10786 6.46787 4.15536 6.659 4.27L8.492 5.37C8.90533 5.15 9.33867 4.97 9.792 4.83L10.311 2.757C10.3651 2.54092 10.4899 2.3491 10.6654 2.21196C10.8409 2.07483 11.0572 2.00023 11.28 2H12.718C12.9409 2.00001 13.1575 2.0745 13.3332 2.21166C13.509 2.34881 13.6338 2.54075 13.688 2.757L14.208 4.83ZM12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17157C14.0783 8.42143 13.0609 8 12 8C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16Z" />
                                </svg>
                            </button>
                            <div className={`transition-all duration-500 overflow-hidden ${showSettings ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                <hr className="my-4" />
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-semibold">Chế độ:</span>
                                    <button
                                        onClick={() => setIsDarkMode(prev => !prev)}
                                        className={`text-sm font-semibold py-1 px-2 rounded transition-colors
        ${isDarkMode
                                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                                : "bg-gray-200 hover:bg-gray-300 text-black"}`}
                                    >
                                        {isDarkMode ? "🌙 Dark" : "☀️ Light"}
                                    </button>


                                </div>
                                <hr className="my-4" />
                                <p className="font-semibold mb-2">Chỉnh cỡ chữ
                                </p>
                                <div className="flex flex-row gap-2 justify-between items-center">
                                    <input
                                        type="range"
                                        min={12}
                                        max={24}
                                        value={fontSize}
                                        onChange={handleFontSizeChange}
                                        className={`w-full h-2 rounded-lg cursor-pointer appearance-none
            ${isDarkMode ? "bg-gray-700" : "slider"}`}
                                    />
                                    <div className={`text-sm font-bold font-bevietnam ${isDarkMode ? "text-white" : "text-black"}`}>
                                        {fontSize}px
                                    </div>
                                </div>

                                <hr className="my-4" />
                                <p className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}>Chỉnh cỡ ảnh</p>

                                <div className="flex flex-row gap-2 justify-between items-center">
                                    <input
                                        type="range"
                                        min={6}
                                        max={20}
                                        value={imageSize}
                                        onChange={handleImageSizeChange}
                                        className={`w-full h-2 rounded-lg cursor-pointer appearance-none
            ${isDarkMode ? "bg-gray-700" : "slider"}`}
                                    />
                                    <div className={`text-sm font-bold font-bevietnam ${isDarkMode ? "text-white" : "text-black"}`}>
                                        {imageSize}rem
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className={`w-full items-center justify-center p-4 border border-gray-200 shadow-sm rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <p className={`text-center font-bold text-lg 
  ${isDarkMode ? "text-yellow-300" : "text-red-500"}`}>
                                {formatTime(remainingTime)} phút
                            </p>

                            <hr className="my-4" />
                            <div className="text-xl font-bold">Phần I: Trắc nghiệm</div>
                            <hr className="my-4" />
                            <div className="grid grid-cols-8 gap-2">
                                {questionTN.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => scrollToQuestion(q.id)}
                                        className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center transition-colors
                                        ${selectedQuestion === q.id
                                                ? isDarkMode
                                                    ? "bg-yellow-600 text-white"
                                                    : "bg-yellow-400 text-black"
                                                : saveQuestion.includes(q.id)
                                                    ? isDarkMode
                                                        ? "bg-green-600 text-white"
                                                        : "bg-green-500 text-white"
                                                    : errorQuestion.includes(q.id)
                                                        ? isDarkMode
                                                            ? "bg-red-600 text-white"
                                                            : "bg-red-500 text-white"
                                                        : isDarkMode
                                                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                                                            : "bg-blue-100 hover:bg-blue-300 text-black"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <hr className="my-4" />
                            <div>
                                <div className="text-xl font-bold">Phần II: Đúng sai</div>
                                <hr className="my-4" />
                                <div className="grid grid-cols-8 gap-2">
                                    {questionDS.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => scrollToQuestion(q.id)}
                                            className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center transition-colors
                                        ${selectedQuestion === q.id
                                                    ? isDarkMode
                                                        ? "bg-yellow-600 text-white"
                                                        : "bg-yellow-400 text-black"
                                                    : saveQuestion.includes(q.id)
                                                        ? isDarkMode
                                                            ? "bg-green-600 text-white"
                                                            : "bg-green-500 text-white"
                                                        : errorQuestion.includes(q.id)
                                                            ? isDarkMode
                                                                ? "bg-red-600 text-white"
                                                                : "bg-red-500 text-white"
                                                            : isDarkMode
                                                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                                                : "bg-blue-100 hover:bg-blue-300 text-black"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>

                                    ))}
                                </div>
                            </div>
                            <hr className="my-4" />
                            <div>
                                <div className="text-xl font-bold">Phần III: Trả lời ngắn</div>
                                <hr className="my-4" />
                                <div className="grid grid-cols-8 gap-2">
                                    {questionTLN.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => scrollToQuestion(q.id)}
                                            className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center transition-colors
                                        ${selectedQuestion === q.id
                                                    ? isDarkMode
                                                        ? "bg-yellow-600 text-white"
                                                        : "bg-yellow-400 text-black"
                                                    : saveQuestion.includes(q.id)
                                                        ? isDarkMode
                                                            ? "bg-green-600 text-white"
                                                            : "bg-green-500 text-white"
                                                        : errorQuestion.includes(q.id)
                                                            ? isDarkMode
                                                                ? "bg-red-600 text-white"
                                                                : "bg-red-500 text-white"
                                                            : isDarkMode
                                                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                                                : "bg-blue-100 hover:bg-blue-300 text-black"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>

                                    ))}
                                </div>
                            </div>
                            <hr className="my-4" />
                            <div className="flex flex-col gap-2">
                                {/* Số câu đã làm */}
                                <div className="flex flex-row items-center gap-2">
                                    <div className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center
            ${isDarkMode ? "bg-green-600 text-white" : "bg-green-500 text-white"}`}>
                                        {saveQuestion.length}
                                    </div>
                                    <div>Số câu đã làm</div>
                                </div>

                                {/* Số câu đang làm */}
                                <div className="flex flex-row items-center gap-2">
                                    <div className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center
            ${isDarkMode ? "bg-yellow-600 text-white" : "bg-yellow-400 text-black"}`}>
                                        {selectedQuestion !== null ? 1 : 0}
                                    </div>
                                    <div>Số câu đang làm</div>
                                </div>

                                {/* Số câu chưa làm */}
                                <div className="flex flex-row items-center gap-2">
                                    <div className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center
            ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}>
                                        {questions.length - saveQuestion.length}
                                    </div>
                                    <div>Số câu chưa làm</div>
                                </div>

                                {/* Số câu chưa lưu */}
                                <div className="flex flex-row items-center gap-2">
                                    <div className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center
            ${isDarkMode ? "bg-red-600 text-white" : "bg-red-400 text-white"}`}>
                                        {errorQuestion.length}
                                    </div>
                                    <div>Số câu chưa lưu</div>
                                </div>
                            </div>

                            <hr className="my-4" />
                            <button
                                onClick={handleAutoSubmit}
                                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded w-full transition"
                            >
                                Nộp bài
                            </button>
                        </div>

                    </div>
                </div>
            ) : (
                <div className="flex h-screen w-screen items-center justify-center">
                    <ExamRegulationModal
                        onClose={() => navigate('/practice')}
                        isOpen={!isAgree}
                        onStartExam={handleFullScreen}
                    />
                </div>
            )}

        </div>
    );
};

export default DoExamPage;
