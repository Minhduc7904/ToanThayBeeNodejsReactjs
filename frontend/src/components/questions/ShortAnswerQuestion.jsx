import React from 'react';
import LatexRenderer from '../latex/RenderLatex';
import QuestionImage from './QuestionImage';
import { Bookmark } from 'lucide-react';

/**
 * Component hiển thị câu hỏi trả lời ngắn
 *
 * @param {Object} props - Component props
 * @param {Object} props.question - Dữ liệu câu hỏi
 * @param {number} props.index - Chỉ số của câu hỏi
 * @param {Function} props.handleSelectAnswer - Hàm xử lý khi nhập câu trả lời
 * @param {Function} props.getDefaultValue - Hàm lấy giá trị mặc định cho input
 * @param {string|number|null} props.selectedQuestion - ID của câu hỏi đang được chọn
 * @param {boolean} props.isDarkMode - Chế độ tối
 * @param {number} props.fontSize - Cỡ chữ
 * @param {number} props.imageSize - Kích thước hình ảnh
 * @param {Function} props.setRef - Hàm thiết lập ref cho câu hỏi
 * @param {boolean} props.isTimeUp - Đã hết thời gian làm bài
 * @param {Set} props.markedQuestions - Set các câu hỏi đã đánh dấu
 * @param {Function} props.toggleMarkQuestion - Hàm đánh dấu câu hỏi
 */
const ShortAnswerQuestion = ({
  question,
  index,
  handleSelectAnswer,
  getDefaultValue,
  selectedQuestion,
  isDarkMode,
  fontSize,
  imageSize,
  setRef,
  isTimeUp,
  markedQuestions = new Set(),
  toggleMarkQuestion = () => {}
}) => {
  const isMarked = markedQuestions.has(question.id);
  return (
    <div
      key={question.id + "TLN"}
      ref={(el) => setRef(question.id, el)}
      className={`flex flex-col avoid-page-break gap-2 rounded-md p-3 transition
        ${selectedQuestion === question.id
          ? isDarkMode
            ? "border-2 border-yellow-400 bg-gray-700"
            : "border-2 border-yellow-400 bg-yellow-50"
          : ""}`}
    >
      <div className="flex justify-between items-start">
        <p className="font-bold" style={{ fontSize: `${fontSize}px` }}>Câu {index + 1}:</p>

        {/* Nút đánh dấu câu hỏi */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMarkQuestion(question.id);
          }}
          className={`p-1 rounded-full transition-colors ${
            isMarked
              ? (isDarkMode ? 'text-sky-400 hover:bg-gray-700' : 'text-sky-600 hover:bg-gray-100')
              : (isDarkMode ? 'text-gray-500 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100')
          }`}
          title={isMarked ? "Bỏ đánh dấu" : "Đánh dấu để xem lại"}
        >
          <Bookmark size={20} fill={isMarked ? "currentColor" : "none"} />
        </button>
      </div>

      <LatexRenderer text={question.content} style={{ fontSize: `${fontSize}px` }} />

      <QuestionImage
        imageUrl={question.imageUrl}
        imageSize={imageSize}
      />

      <input
        placeholder="Nhập câu trả lời..."
        defaultValue={getDefaultValue(question.id)}
        style={{ fontSize: `${fontSize}px` }}
        className={`border rounded-md p-2 shadow resize-none w-[12rem]
          ${isDarkMode
            ? "bg-gray-700 text-white border-gray-500 placeholder-gray-300"
            : "bg-white text-black"}
          ${isTimeUp ? 'cursor-not-allowed opacity-60' : ''}`}
        onBlur={(e) => handleSelectAnswer(question.id, e.target.value, "TLN")}
        disabled={isTimeUp}
      />
    </div>
  );
};

export default ShortAnswerQuestion;
