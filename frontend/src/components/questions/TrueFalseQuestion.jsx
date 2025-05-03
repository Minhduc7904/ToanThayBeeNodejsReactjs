import React from 'react';
import LatexRenderer from '../latex/RenderLatex';
import QuestionImage from './QuestionImage';
import { Bookmark } from 'lucide-react';

/**
 * Component hiển thị câu hỏi đúng/sai
 *
 * @param {Object} props - Component props
 * @param {Object} props.question - Dữ liệu câu hỏi
 * @param {number} props.index - Chỉ số của câu hỏi
 * @param {Function} props.handleSelectAnswer - Hàm xử lý khi chọn câu trả lời
 * @param {Function} props.isChecked - Hàm kiểm tra xem câu trả lời có được chọn không
 * @param {string|number|null} props.selectedQuestion - ID của câu hỏi đang được chọn
 * @param {boolean} props.isDarkMode - Chế độ tối
 * @param {number} props.fontSize - Cỡ chữ
 * @param {number} props.imageSize - Kích thước hình ảnh
 * @param {Array} props.prefixStatements - Mảng các tiền tố cho câu trả lời (1, 2, 3...)
 * @param {Function} props.setRef - Hàm thiết lập ref cho câu hỏi
 * @param {boolean} props.isTimeUp - Đã hết thời gian làm bài
 * @param {Set} props.markedQuestions - Set các câu hỏi đã đánh dấu
 * @param {Function} props.toggleMarkQuestion - Hàm đánh dấu câu hỏi
 */
const TrueFalseQuestion = ({
  question,
  index,
  handleSelectAnswer,
  isChecked,
  selectedQuestion,
  isDarkMode,
  fontSize,
  imageSize,
  prefixStatements,
  setRef,
  isTimeUp,
  markedQuestions = new Set(),
  toggleMarkQuestion = () => {}
}) => {
  const isMarked = markedQuestions.has(question.id);
  return (
    <div
      key={question.id + "DS"}
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

      <LatexRenderer text={question.content} className="" style={{ fontSize: `${fontSize}px` }} />

      <QuestionImage
        imageUrl={question.imageUrl}
        imageSize={imageSize}
      />

      <div className="flex flex-col gap-2">
        {question.statements.map((statement, statementIndex) => (
          <div key={statement.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="font-bold" style={{ fontSize: `${fontSize}px` }}>{prefixStatements[statementIndex]}</p>
                <LatexRenderer text={statement.content} className="break-words" style={{ fontSize: `${fontSize}px` }} />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`ds-${statement.id}`}
                    checked={isChecked(question.id, statement.id, true)}
                    value="true"
                    className={`w-4 h-4 accent-sky-600 ${isTimeUp ? 'cursor-not-allowed opacity-60' : ''}`}
                    onChange={() => handleSelectAnswer(question.id, statement.id, true)}
                    disabled={isTimeUp}
                  />
                  <span className="text-ge" style={{ fontSize: `${fontSize}px` }}>Đúng</span>
                </label>

                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`ds-${statement.id}`}
                    checked={isChecked(question.id, statement.id, false)}
                    value="false"
                    className={`w-4 h-4 accent-sky-600 ${isTimeUp ? 'cursor-not-allowed opacity-60' : ''}`}
                    onChange={() => handleSelectAnswer(question.id, statement.id, false)}
                    disabled={isTimeUp}
                  />
                  <span style={{ fontSize: `${fontSize}px` }}>Sai</span>
                </label>
              </div>
            </div>

            <QuestionImage
              imageUrl={statement.imageUrl}
              imageSize={imageSize}
              isStatement={true}
              altText="statement image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrueFalseQuestion;
