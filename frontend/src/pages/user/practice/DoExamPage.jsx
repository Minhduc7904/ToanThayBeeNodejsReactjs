import HeaderDoExamPage from "../../../components/header/HeaderDoExamPage";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchPublicQuestionsByExamId } from "../../../features/question/questionSlice";
import { fetchPublicExamById, summitExam } from "../../../features/exam/examSlice";
import { useParams } from "react-router-dom";
import { socket } from "../../../services/socket";
import { setErrorMessage, setSuccessMessage } from "../../../features/state/stateApiSlice";
import { useNavigate } from "react-router-dom";
import { fetchAnswersByAttempt, setAnswers } from "../../../features/answer/answerSlice";
import ExamRegulationModal from "../../../components/modal/ExamRegulationModal";
import { AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import ExamSidebar from "../../../components/sidebar/ExamSidebar";
import ExamContent from "../../../components/questions/ExamContent";
import { requestFullscreen, exitFullscreen, isFullscreen } from "../../../utils/fullscreenUtils";

const DoExamPage = () => {
    const { examId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { exam } = useSelector(state => state.exams);
    const { questions } = useSelector(state => state.questions);
    const { answers } = useSelector(state => state.answers);
    const [fontSize, setFontSize] = useState(14); // 14px mặc định
    const [imageSize, setImageSize] = useState(12); // đơn vị: rem
    const questionRefs = useRef([]);
    const [isAgree, setIsAgree] = useState(false);
    const [attemptId, setAttemptId] = useState(null);
    const attemptRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [flag, setFlag] = useState(false);
    const [startTime1, setStartTime1] = useState(null);
    const hasSubmittedRef = useRef(false);
    const examRef = useRef(null);
    const examContentRef = useRef(null);

    useEffect(() => {
        examRef.current = exam;
        if (exam?.acceptDoExam === false){
            navigate(`/practice/exam/${examId}`)
        }
    }, [exam]);

    useEffect(() => {
        if (examId) {
            dispatch(fetchPublicExamById(examId));
        }
    }, [dispatch, examId]);


    const { user } = useSelector((state) => state.auth);
    const [remainingTime, setRemainingTime] = useState(null);
    const [saveQuestion, setSaveQuestion] = useState(new Set());
    const [errorQuestion, setErrorQuestion] = useState(new Set());
    const [markedQuestions, setMarkedQuestions] = useState(new Set());
    const [timeWarningShown, setTimeWarningShown] = useState({
        fiveMinutes: false,
        oneMinute: false
    });
    const [isTimeBlinking, setIsTimeBlinking] = useState(false);
    const [singleQuestionMode, setSingleQuestionMode] = useState(false);
    const prefixStatementTN = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.'];
    const prefixStatementDS = ['a)', 'b)', 'c)', 'd)', 'e)', 'f)', 'g)', 'h)', 'i)', 'j)'];
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("isDarkMode");
        return saved ? JSON.parse(saved) : false;
    });

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingLoadExam, setLoadingLoadExam] = useState(false);
    const [isTimeUp, setIsTimeUp] = useState(false);

    const [questionTN, setQuestionTN] = useState([]);
    const [questionDS, setQuestionDS] = useState([]);
    const [questionTLN, setQuestionTLN] = useState([]);

    const [answerTN, setAnswerTN] = useState([]);
    const [answerTLN, setAnswerTLN] = useState([]);
    const [dsAnswers, setDsAnswers] = useState({});

    document.addEventListener("copy", (e) => {
        e.preventDefault();
    });

    const addQuestion = (questionId) => {
        setSaveQuestion(prev => new Set(prev).add(questionId));
    };

    const addErrorQuestion = (questionId) => {
        setErrorQuestion(prev => new Set(prev).add(questionId));
    };

    const removeQuestion = (questionId) => {
        setSaveQuestion(prev => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
        });
    };

    const removeErrorQuestion = (questionId) => {
        setErrorQuestion(prev => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
        });
    };

    // Hàm đánh dấu câu hỏi để xem lại sau
    const toggleMarkQuestion = (questionId) => {
        setMarkedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };


    const handleExitFullscreen = () => {
        try {
            exitFullscreen();
        } catch (err) {
            // Chỉ ghi log lỗi, không bắt lỗi
            console.warn("Không thể thoát fullscreen:", err);
        }
    };

    const handleFontSizeChange = (e) => {
        setFontSize(Number(e.target.value));
    };

    const handleImageSizeChange = (e) => {
        setImageSize(Number(e.target.value));
    };

    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return `${min}:${sec}`;
    };

    const handleFullScreen = async () => {
        setLoadingLoadExam(true);

        const startExam = () => {
            socket.emit("join_exam", { studentId: user.id, examId });
            console.log("📨 Đã gửi yêu cầu vào thi");
        };

        if (!socket.connected) {
            console.log("⚠️ Socket chưa kết nối. Đang kết nối...");
            socket.connect();

            // Chờ socket connect xong mới gửi
            socket.once("connect", () => {
                console.log("✅ Socket đã kết nối!");
                startExam();
            });

            socket.once("exam_error", ({ message }) => {
                dispatch(setErrorMessage("Lỗi: " + message));
                setLoadingLoadExam(false);
                navigate(`/practice/exam/${examId}`);
                return;
            });

            // Trường hợp connect fail trong 5 giây → timeout
            setTimeout(() => {
                if (!socket.connected) {
                    setLoadingLoadExam(false);
                }
            }, 5000);

        } else {
            startExam();
        }

        // Lắng nghe lỗi
        socket.once("exam_error", ({ message }) => {
            dispatch(setErrorMessage("Lỗi: " + message));
            setLoadingLoadExam(false);
        });
    };

    useEffect(() => {
        socket.on("exam_started", async ({ attemptId, startTime }) => {
            console.log("Đã nhận được thông báo bắt đầu thi từ server:", attemptId);
            setIsAgree(true);

            attemptRef.current = attemptId;
            setAttemptId(attemptId);

            if (examId) {
                dispatch(fetchPublicQuestionsByExamId(examId));
            }
            setStartTime1(startTime)
            try {
                const success = await requestFullscreen();
                if (success) {
                    setTimeout(() => {
                        setLoadingLoadExam(false);
                    }, 800);
                } else {
                    // Nếu không thể vào fullscreen, vẫn cho phép làm bài
                    console.warn("Không thể vào fullscreen, nhưng vẫn cho phép làm bài");
                    setLoadingLoadExam(false);
                }
            } catch (err) {
                console.error("❌ Lỗi khi bật fullscreen:", err);
                // Vẫn cho phép làm bài ngay cả khi không thể vào fullscreen
                alert("Không thể vào fullscreen, nhưng bạn vẫn có thể làm bài.");
                setLoadingLoadExam(false);
            }
        });

        return () => {
            socket.off("exam_started");
        };
    }, [exam, socket]);

    useEffect(() => {
        if (exam?.testDuration && startTime1) {
            const start = new Date(startTime1);
            const now = new Date();
            const elapsedSeconds = Math.floor((now - start) / 1000);
            const totalSeconds = exam.testDuration * 60;
            const remaining = Math.max(totalSeconds - elapsedSeconds, 0);
            console.log(start, now, remaining)
            setRemainingTime(remaining);
        }
    }, [startTime1, exam]);

    useEffect(() => {
        if (flag) return
        if (!remainingTime) setFlag(true)
    }, [remainingTime])

    const handleAutoSubmit = async () => {
        if (hasSubmittedRef.current) {
            console.warn("⛔ Đã submit rồi, bỏ qua lần gọi lại.");
            return;
        }
        hasSubmittedRef.current = true; // Đánh dấu đã submit
        console.log("Kiểm tra attemptId:", attemptId);
        if (!attemptId) {
            console.log("Không thể nộp bài: attemptId không tồn tại hoặc đang trong quá trình nộp/tải");
            return;
        }

        console.log("Đang nộp bài với attemptId:", attemptId);
        setSaveQuestion(new Set());
        setLoadingSubmit(true);

        try {
            // Sử dụng API thay vì socket để nộp bài
            const result = await dispatch(summitExam(attemptId)).unwrap();
            console.log("Nộp bài thành công:", result);

            // Xử lý khi nộp bài thành công
            dispatch(setSuccessMessage("Nộp bài thành công!"));

            // Thoát fullscreen mà không bắt lỗi
            try {
                exitFullscreen();
            } catch (err) {
                // Chỉ ghi log lỗi, không ảnh hưởng đến luồng chính
                console.warn("Không thể thoát fullscreen khi nộp bài:", err);
            }

            const safeAttemptId = attemptRef.current;
            const currentExam = examRef.current;

            if (!safeAttemptId) {
                console.error("Không có attemptId khi navigate!");
                return;
            }

            // Log để debug
            console.log("Current exam state:", currentExam);
            console.log("Attempt ID:", safeAttemptId);

            if (!currentExam || !currentExam.seeCorrectAnswer) {
                console.log("Chuyển về trang danh sách do:", {
                    examNull: !currentExam,
                    cantSeeAnswer: currentExam && !currentExam.seeCorrectAnswer
                });
                navigate(`/practice/exam/${examId}`);
                return;
            }

            navigate(`/practice/exam/attempt/${safeAttemptId}/score`);
        } catch (error) {
            console.error("Lỗi khi nộp bài:", error);
            setLoadingSubmit(false);
            dispatch(setErrorMessage("Lỗi khi nộp bài. Vui lòng thử lại."));
            hasSubmittedRef.current = false; // Reset trạng thái để có thể thử lại

            // Thử nộp lại sau 3 giây nếu lỗi xảy ra
            setTimeout(() => {
                if (!loadingSubmit && attemptRef.current) {
                    console.log("Thử nộp bài lại sau lỗi...");
                    handleAutoSubmit();
                }
            }, 5000);
        }
    };

    // Hàm mới để xử lý việc chuyển đến câu hỏi dựa trên chế độ hiển thị
    const navigateToQuestion = useCallback((questionId) => {
        setSelectedQuestion(questionId);

        // Kiểm tra xem examContentRef có tồn tại và có phương thức goToQuestionById không
        if (examContentRef.current && examContentRef.current.isSingleQuestionMode()) {
            // Nếu đang ở chế độ hiển thị từng câu, sử dụng phương thức goToQuestionById
            examContentRef.current.goToQuestionById(questionId);
        } else {
            // Nếu đang ở chế độ hiển thị tất cả câu hỏi, sử dụng phương thức cuộn đến câu hỏi
            const element = questionRefs.current[questionId];
            if (element) {
                const offset = 80; // chiều cao của header sticky
                const y = element.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }
    }, []);

    // Giữ lại hàm cũ để tương thích ngược
    const scrollToQuestion = (index) => {
        navigateToQuestion(index);
    };

    const handleSelectAnswerTN = (questionId, statementId, type) => {
        // Không cho phép làm bài nếu đã hết thời gian
        if (isTimeUp) {
            dispatch(setErrorMessage("Đã hết thời gian làm bài. Không thể thay đổi câu trả lời!"));
            return;
        }

        const payload = {
            attemptId,
            questionId,
            answerContent: statementId,
            studentId: user.id, // nếu cần xác định user
            type,
            examId,
            name: user.lastName + " " + user.firstName,
        };
        const newAnswer = {
            questionId,
            answerContent: statementId,
            typeOfQuestion: type,
        };
        dispatch(setAnswers(newAnswer));

        socket.emit("select_answer", payload);
    };

    const handleSelectAnswerDS = (questionId, statementId, selectedAnswer) => {
        // Không cho phép làm bài nếu đã hết thời gian
        if (isTimeUp) {
            dispatch(setErrorMessage("Đã hết thời gian làm bài. Không thể thay đổi câu trả lời!"));
            return;
        }

        const currentAnswers = dsAnswers[questionId] || [];

        const existing = currentAnswers.find(ans => ans.statementId === statementId);

        // 🔁 Nếu đáp án đã giống thì không gửi lại
        if (existing && existing.answer === selectedAnswer) {
            return
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

        // ✨ Gửi toàn bộ lên server
        socket.emit("select_answer", {
            questionId,
            answerContent: updatedAnswers,
            studentId: user.id,
            attemptId,
            type: "DS",
            examId,
            name: user.lastName + " " + user.firstName,
        });
        dispatch(setAnswers({ questionId, answerContent: JSON.stringify(updatedAnswers), typeOfQuestion: "DS" }));
    };


    const handleSelectAnswerTLN = (questionId, answerContent, type) => {
        // Không cho phép làm bài nếu đã hết thời gian
        if (isTimeUp) {
            dispatch(setErrorMessage("Đã hết thời gian làm bài. Không thể thay đổi câu trả lời!"));
            return;
        }

        const payload = {
            attemptId,
            questionId,
            answerContent: answerContent.trim(),
            studentId: user.id,
            type,
            examId,
            name: user.lastName + " " + user.firstName,
        };

        dispatch(setAnswers({ questionId, answerContent, typeOfQuestion: type }));

        socket.emit("select_answer", payload);
    }

    const isTNSelected = (questionId, statementId) => {
        const isSelected = answerTN.some(
            (ans) =>
                ans.questionId === questionId &&
                ans.answerContent &&
                String(ans.answerContent) === String(statementId)
        );

        if (isSelected && !saveQuestion.has(questionId)) {
            addQuestion(questionId);
        }

        return isSelected;
    };

    const isDSChecked = (questionId, statementId, bool) => {
        const isSelected = dsAnswers[questionId]?.some(
            (a) => a.statementId === statementId && a.answer === bool
        ) || false;

        if (isSelected && !saveQuestion.has(questionId) && dsAnswers[questionId]?.length === 4) {
            addQuestion(questionId);
        }

        return isSelected;
    };

    const getTLNDefaultValue = (questionId) => {
        const matched = answerTLN.find((ans) => ans.questionId === questionId);
        const content = matched?.answerContent?.replace(/^"|"$/g, "") || "";

        if (content && !saveQuestion.has(questionId)) {
            addQuestion(questionId);
        }

        return content;
    };

    // useEffect(() => {
    //     if (examId) {
    //         dispatch(fetchPublicQuestionsByExamId(examId));
    //     }
    // }, [dispatch, examId]);

    useEffect(() => {
        if (questions) {
            setQuestionTN(questions.filter((question) => question.typeOfQuestion === "TN"));
            setQuestionDS(questions.filter((question) => question.typeOfQuestion === "DS"));
            setQuestionTLN(questions.filter((question) => question.typeOfQuestion === "TLN"));
        }
    }, [questions]);

    useEffect(() => {
        // Kiểm tra answers có phải là mảng không
        if (!Array.isArray(answers) || answers.length === 0) return;

        const tn = [];
        const tln = [];
        const dsMap = {};

        // Sử dụng for...of thay vì forEach để tránh lỗi
        for (const answer of answers) {
            if (answer.typeOfQuestion === "TN") {
                tn.push(answer);
            } else if (answer.typeOfQuestion === "TLN") {
                tln.push(answer);
            } else if (answer.typeOfQuestion === "DS" && answer.answerContent) {
                try {
                    const parsed = JSON.parse(answer.answerContent);
                    dsMap[answer.questionId] = parsed;
                } catch (err) {
                    console.error("Lỗi parse DS answerContent:", err);
                }
            }
        }

        setAnswerTN(tn);
        setAnswerTLN(tln);
        setDsAnswers(dsMap);
        if (!socket || !socket.connected || !attemptId || !examId) return;
        socket.emit("calculate_score", {
            attemptId,
            answers,
            examId,
            student: user,
        });
    }, [answers]);


    useEffect(() => {
        if (attemptId) {
            dispatch(fetchAnswersByAttempt(attemptId));
        }
    }, [dispatch, attemptId]);

    useEffect(() => {
        if (!exam?.testDuration || remainingTime === null || !isAgree ) return;

        // Kiểm tra và hiển thị cảnh báo thời gian
        const checkTimeWarnings = (time) => {
            // Cảnh báo khi còn 5 phút
            if (time === 300 && !timeWarningShown.fiveMinutes) {
                setTimeWarningShown(prev => ({ ...prev, fiveMinutes: true }));
                setIsTimeBlinking(true);
                dispatch(setErrorMessage("Còn 5 phút nữa là hết thời gian làm bài!"));

                // Tắt hiệu ứng nhấp nháy sau 10 giây
                setTimeout(() => {
                    setIsTimeBlinking(false);
                }, 10000);
            }

            // Cảnh báo khi còn 1 phút
            if (time === 60 && !timeWarningShown.oneMinute) {
                setTimeWarningShown(prev => ({ ...prev, oneMinute: true }));
                setIsTimeBlinking(true);
                dispatch(setErrorMessage("Còn 1 phút nữa là hết thời gian làm bài!"));

                // Giữ hiệu ứng nhấp nháy cho đến khi hết thời gian
            }
        };

        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) { // dùng <=1 để đảm bảo không bị âm
                    clearInterval(interval);
                    // Đánh dấu là đã hết thời gian
                    setIsTimeUp(true);
                    setIsTimeBlinking(false);
                    // Thử nộp bài
                    handleAutoSubmit();
                    return 0;
                }

                // Kiểm tra cảnh báo thời gian
                checkTimeWarnings(prev);

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [exam?.testDuration, isAgree, remainingTime, timeWarningShown, dispatch]);// Chỉ phụ thuộc vào các giá trị cần thiết

    useEffect(() => {
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
        if (!exam?.isCheatingCheckEnabled) return;
        console.log("Đã bật theo dõi hành vi gian lận");


        const recentLogs = new Set(); // chống log lặp
        const logOnce = (key, payload) => {

            if (!exam?.isCheatingCheckEnabled || recentLogs.has(key)) return;

            recentLogs.add(key);
            socket.emit("user_log", { ...payload, name: user.lastName + " " + user.firstName });

            setTimeout(() => recentLogs.delete(key), 5000);
        };

        // 📌 Thoát fullscreen
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement &&
                !document.webkitFullscreenElement &&
                !document.mozFullScreenElement &&
                !document.msFullscreenElement) {
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


    useEffect(() => {
        // Chỉ lắng nghe các sự kiện liên quan đến câu trả lời
        socket.on("answer_saved", ({ questionId }) => {
            addQuestion(questionId);
            removeErrorQuestion(questionId);
        });

        socket.on("answer_error", ({ questionId, message }) => {
            dispatch(setErrorMessage(message));
            removeQuestion(questionId);
            addErrorQuestion(questionId);
        });

        return () => {
            socket.off("answer_saved");
            socket.off("answer_error");
        };
    }, []);

    useEffect(() => {
        localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    return (
        <div className={`flex min-h-screen flex-col ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#F6FAFD] text-black'}`}>
            <HeaderDoExamPage nameExam={exam?.name} onExitFullscreen={handleExitFullscreen} />
            {isAgree ? (
                <div className="flex flex-col lg:flex-row flex-1 w-full gap-4 px-4 pb-4 mt-5">
                    {/* Main Content */}
                    <ExamContent
                        ref={examContentRef}
                        loading={loadingLoadExam}
                        isDarkMode={isDarkMode}
                        questionTN={questionTN}
                        questionDS={questionDS}
                        questionTLN={questionTLN}
                        handlers={{
                            handleSelectAnswerTN,
                            handleSelectAnswerDS,
                            handleSelectAnswerTLN,
                            isTNSelected,
                            isDSChecked,
                            getTLNDefaultValue,
                            setQuestionRef: (id, el) => (questionRefs.current[id] = el),
                            setSelectedQuestion: (id) => setSelectedQuestion(id)
                        }}
                        settings={{
                            selectedQuestion,
                            isDarkMode,
                            fontSize,
                            imageSize,
                            prefixStatementTN,
                            prefixStatementDS,
                            isTimeUp,
                            markedQuestions,
                            toggleMarkQuestion
                        }}
                        isTimeUp={isTimeUp}
                        // Để undefined để component tự quyết định dựa trên thiết bị
                        initialSingleMode={undefined}
                    />


                    {/* Button toggle cho mobile */}
                    <div className="fixed bottom-4 right-4 z-50 lg:hidden">
                        <button
                            className={`p-2 rounded-full shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                            onClick={() => setIsSidebarOpen(prev => !prev)}
                        >
                            <Menu />
                        </button>
                    </div>

                    {/* Sidebar chính */}
                    <AnimatePresence>
                        {(isSidebarOpen || window.innerWidth > 1024) && (
                            <ExamSidebar
                                isDarkMode={isDarkMode}
                                setIsDarkMode={setIsDarkMode}
                                fontSize={fontSize}
                                handleFontSizeChange={handleFontSizeChange}
                                imageSize={imageSize}
                                handleImageSizeChange={handleImageSizeChange}
                                questionTN={questionTN}
                                questionDS={questionDS}
                                questionTLN={questionTLN}
                                scrollToQuestion={navigateToQuestion}
                                selectedQuestion={selectedQuestion}
                                saveQuestion={saveQuestion}
                                errorQuestion={errorQuestion}
                                markedQuestions={markedQuestions}
                                toggleMarkQuestion={toggleMarkQuestion}
                                handleAutoSubmit={handleAutoSubmit}
                                loadingSubmit={loadingSubmit}
                                loadingLoadExam={loadingLoadExam}
                                exam={exam}
                                remainingTime={remainingTime}
                                formatTime={formatTime}
                                questions={questions}
                                singleQuestionMode={examContentRef.current?.isSingleQuestionMode() || false}
                                setSingleQuestionMode={(value) => {
                                    if (examContentRef.current) {
                                        // Khi chuyển sang chế độ hiển thị từng câu, đảm bảo câu hỏi đang được chọn sẽ được hiển thị
                                        examContentRef.current.setSingleQuestionMode(value);
                                    }
                                }}
                            />
                        )}
                    </AnimatePresence>

                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <ExamRegulationModal
                        onClose={() => {
                            if (socket.connected) {
                                socket.emit("leave_exam", { studentId: user?.id, examId });
                                socket.disconnect();
                            }
                            socket.removeAllListeners(); // Xóa hết listener để tránh lỗi khi component bị unmount
                            navigate(`/practice/exam/${examId}`);
                        }}
                        isOpen={!isAgree}
                        onStartExam={handleFullScreen}
                    />
                </div>
            )}

            {exam?.testDuration && isAgree && (
                <div className={`fixed bottom-2 rounded-md left-2 px-4 py-2
                    ${isTimeBlinking
                        ? 'bg-red-600 animate-pulse'
                        : 'bg-slate-700 bg-opacity-80'}
                    text-white z-50 transition-colors duration-300`}>
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-bold">{formatTime(remainingTime)} phút</div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DoExamPage;
