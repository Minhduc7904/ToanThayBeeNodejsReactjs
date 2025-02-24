import React, { useState } from "react"
import { postQuestion } from "../services/api"
import { toast } from "react-toastify"
import { BlockMath, InlineMath } from "react-katex"
import "katex/dist/katex.min.css"  // ✅ Đúng
import "react-toastify/dist/ReactToastify.css"

const QuestionForm = () => {
    const [rawData, setRawData] = useState("") // Lưu dữ liệu nhập vào
    const [parsedData, setParsedData] = useState(null) // Lưu dữ liệu sau khi phân tích

    // Hàm phân tích dữ liệu rawData
    const parseQuestionData = (rawData) => {
        const lines = rawData.split("\n").map(line => line.trim()).filter(line => line !== "")

        if (lines.length < 2) {
            throw new Error("Dữ liệu không hợp lệ, cần ít nhất một câu hỏi và một phương án")
        }

        let questionContent = ""
        let answerOptions = []
        let correctAnswer = null
        let currentOption = null

        for (const line of lines) {
            // Kiểm tra nếu là một phương án trả lời mới (A., B., C., D.)
            const optionMatch = line.match(/^([A-D])\.\s*(.*)/)
            if (optionMatch) {
                if (currentOption) {
                    answerOptions.push(currentOption)
                }

                const optionText = optionMatch[2]
                const isCorrect = optionText.includes("✔") || optionText.includes("*")

                currentOption = {
                    option: optionMatch[1],
                    content: optionText.replace(/✔|\*/, "").trim(),
                    isCorrect
                }

                if (isCorrect) correctAnswer = optionMatch[1]
            } else {
                if (!currentOption) {
                    questionContent += (questionContent ? " " : "") + line
                } else {
                    currentOption.content += " " + line
                }
            }
        }

        if (currentOption) {
            answerOptions.push(currentOption)
        }

        return { 
            questionData: {
                class: "", // Để trống, có thể nhập sau
                content: questionContent,
                typeOfQuestion: "trắc nghiệm",
                correctAnswer: correctAnswer || "",
                difficulty: "",
                chapter: "",
                description: "",
                solutionUrl: "",
                imageUrl: ""
            },
            answerOptions 
        }
    }

    // Khi nhấn "Phân tích dữ liệu"
    const handleParse = () => {
        try {
            const result = parseQuestionData(rawData)
            setParsedData(result)
            toast.success("Dữ liệu đã được phân tích!")
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Khi nhấn "Gửi lên server"
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!parsedData) {
            toast.error("Vui lòng phân tích dữ liệu trước khi gửi!")
            return
        }

        try {
            const response = await postQuestion(parsedData.questionData, parsedData.answerOptions)
            toast.success("Thêm câu hỏi thành công!")
            setRawData("") // Reset dữ liệu nhập vào
            setParsedData(null)
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`)
        }
    }

    return (
        <div className="form-container">
            <h2>Nhập Câu Hỏi (Raw Data)</h2>
            <textarea
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                placeholder="Nhập dữ liệu câu hỏi và phương án..."
                rows="6"
                required
            />
            <button type="button" onClick={handleParse}>Phân Tích Dữ Liệu</button>

            {parsedData && (
                <div className="preview">
                    <h3>Xem Trước</h3>
                    <p><strong>Câu hỏi:</strong> <BlockMath math={parsedData.questionData.content} /></p>
                    <p><strong>Đáp án đúng:</strong> {parsedData.questionData.correctAnswer || "Chưa xác định"}</p>
                    <ul>
                        {parsedData.answerOptions.map((answer, index) => (
                            <li key={index}>
                                <strong>{answer.option}:</strong> <InlineMath math={answer.content} />
                                {answer.isCorrect && " ✔"}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button type="submit" onClick={handleSubmit}>Gửi Lên Server</button>
        </div>
    )
}

export default QuestionForm
