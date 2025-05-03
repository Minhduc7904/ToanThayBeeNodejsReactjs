// questionUtils.js
import { setErrorMessage } from "../../features/state/stateApiSlice";

// Hàm validateCorrectAnswer nhận vào:
// - question: đối tượng câu hỏi (chứa typeOfQuestion)
// - correctAnswer: giá trị của correctAnswer
// - dispatch: hàm dispatch từ Redux
// - setErrorMessage: action creator để thêm lỗi vào errorSlice
export const validateCorrectAnswer = (question, correctAnswer, dispatch, content) => {
    if (content.trim() === "") {
        dispatch(setErrorMessage("Nội dung câu hỏi không được để trống!"));
        return false;
    }
    if (question.typeOfQuestion === null) {
        dispatch(setErrorMessage("Loại câu hỏi không được để trống!"));
        return false;
    }
    if (correctAnswer.trim() === "") {
        dispatch(setErrorMessage("Đáp án không được để trống!"));
        return false;

    } else {
        if (question.typeOfQuestion === 'TLN' && !/^[-+]?\d+(\.\d+)?$/.test(correctAnswer.replace(",", "."))) {
            dispatch(setErrorMessage("Đáp án phải là một số!"));
            return false;
        }
    }

    if (question.class === null) {
        dispatch(setErrorMessage("Lớp không được để trống!"));
        return false;
    }

    if (question.class !== null && question.chapter !== null) {
        if (!question.chapter.startsWith(question.class)) {
            dispatch(setErrorMessage("Chương này không phải là chương của lớp!"));
            return false;
        }
    }

    if (question.typeOfQuestion === "TN") {
        if (!/^[A-D]$/.test(correctAnswer.trim())) {
            dispatch(setErrorMessage("Đáp án cho câu hỏi TN phải có dạng một ký tự A, B, C hoặc D!"));
            return false;
        }
    } else if (question.typeOfQuestion === "DS") {
        const tokens = correctAnswer.trim().split(/\s+/);
        if (tokens.length === 0 || !tokens.every((token) => token === "Đ" || token === "S")) {
            dispatch(setErrorMessage("Đáp án cho câu hỏi DS phải có dạng các ký tự 'Đ' hoặc 'S', ví dụ: 'Đ Đ S S'!"));
            return false;
        }
    }


    return true;
};

// Hàm processInput nhận vào:
// - question: đối tượng câu hỏi (chứa typeOfQuestion)
// - correctAnswer: đáp án đầu vào
// - content: chuỗi content chứa nội dung câu hỏi và đáp án
// Hàm trả về một object chứa:
// - questionContent: nội dung câu hỏi đã được xử lý (loại bỏ tiền tố "Câu X.")
// - newStatements: mảng đối tượng statement đã xử lý, trong đó có thuộc tính isCorrect dựa vào correctAnswer
export const processInput = (question, correctAnswer, content, dispatch) => {
    // Tách content thành các dòng, loại bỏ khoảng trắng thừa và dòng rỗng
    const lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

    let questionContent = "";
    const statementLines = [];
    let foundOption = false;

    if (question.typeOfQuestion === "TN") {
        // Với TN, đáp án có định dạng "A. ...", "B. ..." (chữ in hoa và dấu chấm)
        for (let line of lines) {
            if (/^[A-Z]\./.test(line)) {
                foundOption = true;
                statementLines.push(line.slice(2).trim());
            } else if (!foundOption) {
                questionContent += line + " ";
            } else {
                statementLines[statementLines.length - 1] += " " + line;
            }
        }
    } else if (question.typeOfQuestion === "DS") {
        // Với DS, đáp án có định dạng "a) ..." (chữ thường và dấu ngoặc đơn)
        for (let line of lines) {
            if (/^[a-z]\)/.test(line)) {
                foundOption = true;
                statementLines.push(line.slice(2).trim());
            } else if (!foundOption) {
                questionContent += line + " ";
            } else {
                statementLines[statementLines.length - 1] += " " + line;
            }
        }
    } else if (question.typeOfQuestion === "TLN") {
        questionContent = content;
    }

    // Loại bỏ tiền tố "Câu X." ở đầu nội dung câu hỏi nếu có
    questionContent = questionContent.trim().replace(/^Câu\s*\d+\.\s*/, "");

    if (question.typeOfQuestion === "DS" || question.typeOfQuestion === "TN") {
        if (statementLines.length < 2 || statementLines === null || statementLines === undefined) {
            dispatch(setErrorMessage("Mệnh đề không hợp lệ"));
            return false;
        }
    }

    // Tạo mảng các đối tượng statement từ statementLines
    const newStatements = statementLines.map((line) => ({
        content: line,
        isCorrect: false,
        needImage: false,
        difficulty: null,
    }));

    // Xử lý correctAnswer theo từng loại câu hỏi
    if (question.typeOfQuestion === "DS") {
        const correctTokens = correctAnswer.trim().split(/\s+/);
        correctTokens.forEach((answer, index) => {
            newStatements[index].isCorrect = answer === "Đ";
        });
    } else if (question.typeOfQuestion === "TN") {
        const letter = correctAnswer.trim();
        const correctIndex = letter.charCodeAt(0) - "A".charCodeAt(0);
        newStatements.forEach((statement, index) => {
            statement.isCorrect = index === correctIndex;
        });
    }

    return { questionContent, newStatements };
};


export const validateInput = (question, dispatch) => {
    if (question.class === null) {
        dispatch(setErrorMessage("Lớp không được để trống!"));
        return false;
    }
    if (question.correctAnswer) {
        if (!/^[-+]?\d+(\.\d+)?$/.test(question.correctAnswer)) {
            dispatch(setErrorMessage("Đáp án phải là một số!"));
            return false;
        }
    }

    if (question.class !== null && question.chapter !== null) {
        if (!question.chapter.startsWith(question.class)) {
            dispatch(setErrorMessage("Chương này không phải là chương của lớp!"));
            return false;
        }
    }

    if (question.typeOfQuestion === 'TN') {
        if (question.statements.filter(statement => statement.isCorrect === true).length !== 1) {
            dispatch(setErrorMessage("Câu hỏi TN có một đáp án đúng!"));
            return false;
        }
    }

    return true;
}

export const processInputForUpdate = (question) => {
    const newQuestion = {
        ...question,
        statements: question.statements?.map(statement => ({ ...statement }))
    };

    newQuestion.content = newQuestion.content?.trim().replace(/^Câu\s*\d+\.\s*/, "");
    newQuestion.correctAnswer = newQuestion.correctAnswer?.trim().replace(",", ".");
    newQuestion.solution = newQuestion.solution?.trim();
    newQuestion.solutionUrl = newQuestion.solutionUrl?.trim();
    newQuestion.description = newQuestion.description?.trim();

    newQuestion.statements?.forEach((statement) => {
        statement.content = statement.content?.trim();
    });

    return newQuestion;
};

export const splitContentTN = (content, correctAnswersText, dispatch) => {
    if (content.trim() === "" || correctAnswersText.trim() === "")
        return { questionsTN: [], countTN: 0 };

    const lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

    let questionsTN = [];
    let questionContent = "";
    let statementLines = [];
    let foundQuestion = false;
    let foundStatement = false;
    let index = 0;
    let countTN = 0;

    const correctAnswers = correctAnswersText.trim().split(" ");

    for (let line of lines) {
        // Nhận diện tiêu đề câu hỏi: Câu 1. hoặc Câu 1:
        if (/^([Cc]âu)\s*\d+[\.:]/.test(line)) {
            if (foundQuestion) {
                questionsTN.push({
                    questionData: {
                        typeOfQuestion: "TN",
                        content: questionContent.trim(),
                    },
                    statements: statementLines,
                });
                index++;
            }

            foundQuestion = true;
            questionContent = line.replace(/^([Cc]âu)\s*\d+[\.:]\s*/, "");
            statementLines = [];
            foundStatement = false;
        }

        // Nhận diện các định dạng đáp án: A. B. A) B) a) b) a. b.
        else if (/^[a-dA-D][\.\)]/.test(line)) {
            const match = line.match(/^([a-dA-D])[\.\)]\s*(.*)$/);
            if (match) {
                const [, option, text] = match;
                foundStatement = true;
                statementLines.push({
                    index: countTN,
                    content: text.trim(),
                    isCorrect:
                        correctAnswers[index] &&
                        correctAnswers[index].toUpperCase() === option.toUpperCase(),
                });
                countTN++;
            }
        }

        // Nội dung phụ của đáp án
        else if (foundStatement) {
            statementLines[statementLines.length - 1].content += " " + line;
        }

        // Nội dung phụ của câu hỏi
        else {
            questionContent += " " + line;
        }
    }

    // Thêm câu cuối
    if (foundQuestion) {
        questionsTN.push({
            questionData: {
                typeOfQuestion: "TN",
                content: questionContent.trim(),
            },
            statements: statementLines,
        });
    }

    if (questionsTN.length !== correctAnswers.length) {
        dispatch(
            setErrorMessage(
                "Số lượng đáp án không khớp với số lượng câu hỏi!"
            )
        );
        return false;
    }

    return { questionsTN, countTN };
};

export const splitContentDS = (content, correctAnswersText, count, dispatch) => {
    if (content.trim() === "" || correctAnswersText.trim() === "") return { questionsDS: [], count };

    const lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

    let questionsDS = [];
    let questionContent = "";
    let statementLines = [];
    let foundQuestion = false;
    let foundStatement = false;
    let index = 0;

    const correctAnswers = correctAnswersText.trim().split(" ").map(group => group.split("-"));

    for (let line of lines) {
        // Câu hỏi mới
        if (/^([Cc]âu)\s*\d+[\.:]/.test(line)) {
            if (foundQuestion) {
                if (!correctAnswers[index]) {
                    dispatch(setErrorMessage("Số lượng đáp án không khớp với số lượng câu hỏi!"));
                    return false;
                }
                if (statementLines.length !== correctAnswers[index].length) {
                    dispatch(setErrorMessage(`Số lượng đáp án không khớp với số lượng mệnh đề ở Câu ${index + 1}!`));
                    return false;
                }

                questionsDS.push({
                    questionData: {
                        typeOfQuestion: "DS",
                        content: questionContent.trim(),
                    },
                    statements: statementLines,
                });
                index++;
            }

            foundQuestion = true;
            questionContent = line.replace(/^([Cc]âu)\s*\d+[\.:]\s*/, "");
            statementLines = [];
            foundStatement = false;
        }

        // Dòng mệnh đề (a. b) A. A))
        else if (/^[a-dA-D][\.\)]/.test(line)) {
            const match = line.match(/^([a-dA-D])[\.\)]\s*(.*)$/);
            if (match) {
                const [, , text] = match;
                foundStatement = true;
                const currentAnswer = correctAnswers[index]?.[statementLines.length];

                statementLines.push({
                    index: count,
                    content: text.trim(),
                    isCorrect: currentAnswer === "Đ",
                });

                count++;
            }
        }

        // Nội dung bổ sung cho mệnh đề
        else if (foundStatement) {
            statementLines[statementLines.length - 1].content += " " + line;
        }

        // Nội dung phụ cho câu hỏi
        else {
            questionContent += " " + line;
        }
    }

    // Thêm câu cuối
    if (foundQuestion) {
        if (!correctAnswers[index]) {
            dispatch(setErrorMessage("Số lượng đáp án không khớp với số lượng câu hỏi!"));
            return false;
        }
        if (statementLines.length !== correctAnswers[index].length) {
            dispatch(setErrorMessage(`Số lượng đáp án không khớp với số lượng mệnh đề ở Câu ${index + 1}!`));
            return false;
        }

        questionsDS.push({
            questionData: {
                typeOfQuestion: "DS",
                content: questionContent.trim(),
            },
            statements: statementLines,
        });
    }

    return { questionsDS, count };
};

export const splitContentTLN = (content, correctAnswersText, dispatch) => {
    if (content.trim() === "" || correctAnswersText.trim() === "") return [];

    const lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

    let questionsTLN = [];
    let questionContent = "";
    let foundQuestion = false;
    let index = 0;
    const correctAnswers = correctAnswersText.trim().replace(/,/g, ".").split(" ");

    for (let line of lines) {
        // Bắt đầu câu hỏi mới
        if (/^([Cc]âu)\s*\d+[\.:]/.test(line)) {
            if (foundQuestion) {
                if (index >= correctAnswers.length) {
                    dispatch(setErrorMessage("Số lượng đáp án không khớp với số lượng câu hỏi!"));
                    return false;
                }

                questionsTLN.push({
                    questionData: {
                        typeOfQuestion: "TLN",
                        content: questionContent.trim(),
                        correctAnswer: correctAnswers[index],
                    },
                });

                index++;
            }

            foundQuestion = true;
            questionContent = line.replace(/^([Cc]âu)\s*\d+[\.:]\s*/, "");
        } else {
            // Nội dung bổ sung cho câu hỏi
            questionContent += " " + line;
        }
    }

    // Câu cuối cùng
    if (foundQuestion) {
        if (index >= correctAnswers.length) {
            dispatch(setErrorMessage("Số lượng đáp án không khớp với số lượng câu hỏi!"));
            return false;
        }

        questionsTLN.push({
            questionData: {
                typeOfQuestion: "TLN",
                content: questionContent.trim(),
                correctAnswer: correctAnswers[index],
            },
        });
    }

    return questionsTLN;
};



export const validateExamData = (examData, dispatch) => {
    if (examData.name.trim() === "") {
        dispatch(setErrorMessage("Tên đề thi không được để trống!"));
        return false;
    }
    if (examData.class === null) {
        dispatch(setErrorMessage("Lớp không được để trống!"));
        return false;
    }
    if (examData.typeOfExam === null) {
        dispatch(setErrorMessage("Kiểu đề thi không được để trống!"));
        return false;
    }

    if (examData.year === null) {
        dispatch(setErrorMessage("Năm không được để trống!"));
        return false;
    }

    if (examData.passRate < 0 || examData.passRate > 100) {
        dispatch(setErrorMessage("Tỷ lệ đạt không hợp lệ!"));
        return false;
    }

    return true;
}