import React from 'react';
import { Bookmark } from 'lucide-react';

/**
 * Button component for navigating to a specific question with mark feature
 *
 * @param {Object} props - Component props
 * @param {string|number} props.questionId - ID of the question
 * @param {number} props.index - Index of the question (for display)
 * @param {Function} props.scrollToQuestion - Function to scroll to the question
 * @param {string|number|null} props.selectedQuestion - ID of the currently selected question
 * @param {Set} props.saveQuestion - Set of saved question IDs
 * @param {Set} props.errorQuestion - Set of error question IDs
 * @param {Set} props.markedQuestions - Set of marked question IDs
 * @param {Function} props.toggleMarkQuestion - Function to toggle mark status
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 */
const MarkableQuestionButton = ({
  questionId,
  index,
  scrollToQuestion,
  selectedQuestion,
  saveQuestion,
  errorQuestion,
  markedQuestions,
  toggleMarkQuestion,
  isDarkMode
}) => {
  // Determine button style based on question state
  const getButtonStyle = () => {
    if (selectedQuestion === questionId) {
      return isDarkMode
        ? "bg-yellow-600 text-white"
        : "bg-yellow-400 text-black";
    } else if (errorQuestion.has(questionId)) {
      return isDarkMode
        ? "bg-red-600 text-white"
        : "bg-red-500 text-white";
    } else if (saveQuestion.has(questionId)) {
      return isDarkMode
        ? "bg-green-600 text-white"
        : "bg-green-500 text-white";
    } else {
      return isDarkMode
        ? "bg-gray-700 hover:bg-gray-600 text-white"
        : "bg-blue-100 hover:bg-blue-300 text-black";
    }
  };

  const isMarked = markedQuestions.has(questionId);

  return (
    <div className="relative">
      <button
        onClick={() => scrollToQuestion(questionId)}
        className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center transition-colors ${getButtonStyle()}`}
        aria-label={`Go to question ${index + 1}`}
      >
        {index + 1}
      </button>

      {/* Bookmark icon for marking questions */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMarkQuestion(questionId);
        }}
        className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full
          ${isMarked
            ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
            : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}
        title={isMarked ? "Bỏ đánh dấu" : "Đánh dấu để xem lại"}
      >
        <Bookmark size={14} fill={isMarked ? "currentColor" : "none"} />
      </button>
    </div>
  );
};

export default MarkableQuestionButton;
