// questionUtils.js
import { addError } from "../../features/state/stateApiSlice";

// Hàm validateCorrectAnswer nhận vào:
// - question: đối tượng câu hỏi (chứa typeOfQuestion)
// - correctAnswer: giá trị của correctAnswer
// - dispatch: hàm dispatch từ Redux
// - addError: action creator để thêm lỗi vào errorSlice
export const validateCorrectAnswer = (question, correctAnswer, dispatch, content) => {
    let check = true;
    if (content.trim() === "") {
        dispatch(addError("Nội dung câu hỏi không được để trống!"));
        check = false;
    }
    if (question.typeOfQuestion === null) {
        dispatch(addError("Loại câu hỏi không được để trống!"));
        check = false;
    }
    if (correctAnswer.trim() === "") {
        dispatch(addError("Đáp án không được để trống!"));
        check = false;
        
    } else {
        if (question.typeOfQuestion === 'TLN' && !/^[-+]?\d+(\.\d+)?$/.test(correctAnswer.replace(",", "."))) {
            dispatch(addError("Đáp án phải là một số!"));
            check = false;
        }
    }

    if (question.class === null) {
        dispatch(addError("Lớp không được để trống!"));
        check = false;
    }

    if (question.class !== null && question.chapter !== null) {
        if (!question.chapter.startsWith(question.class)) {
            dispatch(addError("Chương này không phải là chương của lớp!"));
            check = false;
        }
    }

    if (question.typeOfQuestion === "TN") {
        if (!/^[A-D]$/.test(correctAnswer.trim())) {
            dispatch(addError("Đáp án cho câu hỏi TN phải có dạng một ký tự A, B, C hoặc D!"));
            check = false;
        }
    } else if (question.typeOfQuestion === "DS") {
        const tokens = correctAnswer.trim().split(/\s+/);
        if (tokens.length === 0 || !tokens.every((token) => token === "Đ" || token === "S")) {
            dispatch(addError("Đáp án cho câu hỏi DS phải có dạng các ký tự 'Đ' hoặc 'S', ví dụ: 'Đ Đ S S'!"));
            check = false;
        }
    }


    return check;
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
            dispatch(addError("Mệnh đề không hợp lệ"));
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
    let check = true;
    if (question.class === null) {
        dispatch(addError("Lớp không được để trống!"));
        check = false;
    }
    if (question.correctAnswer) {
        if (!/^[-+]?\d+(\.\d+)?$/.test(question.correctAnswer)) {
            dispatch(addError("Đáp án phải là một số!"));
            check = false;
        }
    }

    if (question.class !== null && question.chapter !== null) {
        if (!question.chapter.startsWith(question.class)) {
            dispatch(addError("Chương này không phải là chương của lớp!"));
            check = false;
        }
    }

    if (question.typeOfQuestion === 'TN') {
        if (question.statements.filter(statement => statement.isCorrect === true).length !== 1) {
            dispatch(addError("Câu hỏi TN có một đáp án đúng!"));
            check = false;
        }
    }

    return check;
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
