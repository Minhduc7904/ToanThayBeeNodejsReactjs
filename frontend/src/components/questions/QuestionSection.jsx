import React from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';

/**
 * Component hiển thị một phần câu hỏi (trắc nghiệm, đúng/sai, trả lời ngắn)
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Tiêu đề phần
 * @param {Array} props.questions - Danh sách câu hỏi
 * @param {string} props.type - Loại câu hỏi (TN, DS, TLN)
 * @param {Object} props.handlers - Các hàm xử lý
 * @param {Object} props.settings - Các thiết lập
 */
const QuestionSection = ({
  title,
  questions,
  type,
  handlers,
  settings
}) => {
  if (!questions || questions.length === 0) return null;

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

  return (
    <>
      <div className="text-2xl font-bold">{title}</div>
      <div
        className="flex flex-col gap-4"
        style={{ fontSize: `${fontSize}px` }}
      >
        {type === 'TN' && questions.map((question, idx) => (
          <MultipleChoiceQuestion
            key={question.id}
            question={question}
            index={idx}
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
        ))}

        {type === 'DS' && questions.map((question, idx) => (
          <TrueFalseQuestion
            key={question.id}
            question={question}
            index={idx}
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
        ))}

        {type === 'TLN' && questions.map((question, idx) => (
          <ShortAnswerQuestion
            key={question.id}
            question={question}
            index={idx}
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
        ))}
      </div>
      <hr className="my-4" />
    </>
  );
};

export default QuestionSection;
