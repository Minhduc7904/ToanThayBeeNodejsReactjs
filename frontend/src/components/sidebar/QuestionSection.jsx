import React from 'react';
import MarkableQuestionButton from './MarkableQuestionButton';

/**
 * Component for a section of questions in the sidebar
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {Array} props.questions - Array of questions
 * @param {Function} props.scrollToQuestion - Function to scroll to a question
 * @param {string|number|null} props.selectedQuestion - ID of the currently selected question
 * @param {Set} props.saveQuestion - Set of saved question IDs
 * @param {Set} props.errorQuestion - Set of error question IDs
 * @param {Set} props.markedQuestions - Set of marked question IDs
 * @param {Function} props.toggleMarkQuestion - Function to toggle mark status
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 * @param {boolean} props.showMarkedOnly - Whether to show only marked questions
 */
const QuestionSection = ({
  title,
  questions,
  scrollToQuestion,
  selectedQuestion,
  saveQuestion,
  errorQuestion,
  markedQuestions = new Set(),
  toggleMarkQuestion = () => {},
  isDarkMode,
  showMarkedOnly = false
}) => {
  if (questions.length === 0) return null;

  // Filter questions if showMarkedOnly is true
  const displayedQuestions = showMarkedOnly
    ? questions.filter(question => markedQuestions.has(question.id))
    : questions;

  // If no questions to display after filtering
  if (displayedQuestions.length === 0) {
    return (
      <div>
        <div className="text-xl font-bold">{title}</div>
        <hr className="my-4" />
        <div className="text-sm text-gray-500 italic">Không có câu hỏi đã đánh dấu</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-xl font-bold">{title}</div>
      <hr className="my-4" />
      <div className="grid grid-cols-8 gap-2">
        {displayedQuestions.map((question, index) => (
          <MarkableQuestionButton
            key={index}
            questionId={question.id}
            index={questions.findIndex(q => q.id === question.id)} // Keep original index
            scrollToQuestion={scrollToQuestion}
            selectedQuestion={selectedQuestion}
            saveQuestion={saveQuestion}
            errorQuestion={errorQuestion}
            markedQuestions={markedQuestions}
            toggleMarkQuestion={toggleMarkQuestion}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionSection;
