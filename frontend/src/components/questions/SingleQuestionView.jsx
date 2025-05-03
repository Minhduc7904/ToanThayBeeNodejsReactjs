import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';

/**
 * Component hiển thị một câu hỏi duy nhất với các nút điều hướng
 *
 * @param {Object} props - Component props
 * @param {Object} props.question - Câu hỏi hiện tại
 * @param {string} props.type - Loại câu hỏi (TN, DS, TLN)
 * @param {number} props.index - Chỉ số của câu hỏi
 * @param {number} props.totalQuestions - Tổng số câu hỏi
 * @param {Function} props.onPrevious - Hàm xử lý khi nhấn nút trước
 * @param {Function} props.onNext - Hàm xử lý khi nhấn nút tiếp theo
 * @param {Object} props.handlers - Các hàm xử lý
 * @param {Object} props.settings - Các thiết lập
 */
const SingleQuestionView = ({
  question,
  type,
  index,
  totalQuestions,
  onPrevious,
  onNext,
  handlers,
  settings
}) => {
  const {
    handleSelectAnswerTN,
    handleSelectAnswerDS,
    handleSelectAnswerTLN,
    isTNSelected,
    isDSChecked,
    getTLNDefaultValue,
    setQuestionRef
  } = handlers;

  const {
    selectedQuestion,
    isDarkMode,
    fontSize,
    imageSize,
    prefixStatementTN,
    prefixStatementDS,
    isTimeUp,
    markedQuestions,
    toggleMarkQuestion
  } = settings;

  // Đảm bảo câu hỏi hiện tại được đánh dấu là câu hỏi được chọn
  useEffect(() => {
    if (question && handlers.setSelectedQuestion && selectedQuestion !== question.id) {
      handlers.setSelectedQuestion(question.id);
    }
  }, [question, selectedQuestion, handlers]);

  // Render câu hỏi dựa trên loại
  const renderQuestion = () => {
    if (!question) return null;

    switch (type) {
      case 'TN':
        return (
          <MultipleChoiceQuestion
            key={question.id}
            question={question}
            index={index}
            handleSelectAnswer={handleSelectAnswerTN}
            isSelected={isTNSelected}
            selectedQuestion={selectedQuestion}
            isDarkMode={isDarkMode}
            fontSize={fontSize}
            imageSize={imageSize}
            prefixStatements={prefixStatementTN}
            setRef={setQuestionRef}
            isTimeUp={isTimeUp}
            markedQuestions={markedQuestions}
            toggleMarkQuestion={toggleMarkQuestion}
          />
        );
      case 'DS':
        return (
          <TrueFalseQuestion
            key={question.id}
            question={question}
            index={index}
            handleSelectAnswer={handleSelectAnswerDS}
            isChecked={isDSChecked}
            selectedQuestion={selectedQuestion}
            isDarkMode={isDarkMode}
            fontSize={fontSize}
            imageSize={imageSize}
            prefixStatements={prefixStatementDS}
            setRef={setQuestionRef}
            isTimeUp={isTimeUp}
            markedQuestions={markedQuestions}
            toggleMarkQuestion={toggleMarkQuestion}
          />
        );
      case 'TLN':
        return (
          <ShortAnswerQuestion
            key={question.id}
            question={question}
            index={index}
            handleSelectAnswer={handleSelectAnswerTLN}
            getDefaultValue={getTLNDefaultValue}
            selectedQuestion={selectedQuestion}
            isDarkMode={isDarkMode}
            fontSize={fontSize}
            imageSize={imageSize}
            setRef={setQuestionRef}
            isTimeUp={isTimeUp}
            markedQuestions={markedQuestions}
            toggleMarkQuestion={toggleMarkQuestion}
          />
        );
      default:
        return null;
    }
  };

  return (

    <div className="flex flex-col gap-6 w-full">
      {/* Hiển thị tiến trình */}
      <div className="flex justify-between items-center">
        <div className="text-xl font-medium">
          Câu hỏi {index + 1} / {totalQuestions}
        </div>
        <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-sky-600 h-2.5 rounded-full"
            style={{ width: `${((index + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Hiển thị câu hỏi */}
      <div className="flex-1 bg-opacity-50 rounded-lg p-4">
        {renderQuestion()}
      </div>

      {/* Nút điều hướng */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onPrevious}
          disabled={index === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            isDarkMode
              ? (index === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-sky-600 text-white hover:bg-sky-700')
              : (index === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-sky-500 text-white hover:bg-sky-600')
          }`}
        >
          <ChevronLeft size={20} />
          <span>Câu trước</span>
        </button>

        <button
          onClick={onNext}
          disabled={index === totalQuestions - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            isDarkMode
              ? (index === totalQuestions - 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-sky-600 text-white hover:bg-sky-700')
              : (index === totalQuestions - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-sky-500 text-white hover:bg-sky-600')
          }`}
        >
          <span>Câu tiếp</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SingleQuestionView;
