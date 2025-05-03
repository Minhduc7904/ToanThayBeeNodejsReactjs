import React from 'react';

/**
 * Button component for navigating to a specific question
 * 
 * @param {Object} props - Component props
 * @param {string|number} props.questionId - ID of the question
 * @param {number} props.index - Index of the question (for display)
 * @param {Function} props.scrollToQuestion - Function to scroll to the question
 * @param {string|number|null} props.selectedQuestion - ID of the currently selected question
 * @param {Set} props.saveQuestion - Set of saved question IDs
 * @param {Set} props.errorQuestion - Set of error question IDs
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 */
const QuestionButton = ({
  questionId,
  index,
  scrollToQuestion,
  selectedQuestion,
  saveQuestion,
  errorQuestion,
  isDarkMode
}) => {
  // Determine button style based on question state
  const getButtonStyle = () => {
    if (selectedQuestion === questionId) {
      return isDarkMode
        ? "bg-yellow-600 text-white"
        : "bg-yellow-400 text-black";
    } else if (saveQuestion.has(questionId)) {
      return isDarkMode
        ? "bg-green-600 text-white"
        : "bg-green-500 text-white";
    } else if (errorQuestion.has(questionId)) {
      return isDarkMode
        ? "bg-red-600 text-white"
        : "bg-red-500 text-white";
    } else {
      return isDarkMode
        ? "bg-gray-700 hover:bg-gray-600 text-white"
        : "bg-blue-100 hover:bg-blue-300 text-black";
    }
  };

  return (
    <button
      onClick={() => scrollToQuestion(questionId)}
      className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center transition-colors ${getButtonStyle()}`}
      aria-label={`Go to question ${index + 1}`}
    >
      {index + 1}
    </button>
  );
};

export default QuestionButton;
