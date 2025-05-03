import React from 'react';

/**
 * Component to display question count with colored indicator
 * 
 * @param {Object} props - Component props
 * @param {number} props.count - Number to display
 * @param {string} props.label - Label for the counter
 * @param {string} props.bgColor - Background color class for dark mode
 * @param {string} props.bgColorLight - Background color class for light mode
 * @param {string} props.textColor - Text color class for dark mode
 * @param {string} props.textColorLight - Text color class for light mode
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 */
const QuestionCounter = ({
  count,
  label,
  bgColor,
  bgColorLight,
  textColor = "text-white",
  textColorLight = "text-white",
  isDarkMode
}) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center
        ${isDarkMode ? `${bgColor} ${textColor}` : `${bgColorLight} ${textColorLight}`}`}>
        {count}
      </div>
      <div>{label}</div>
    </div>
  );
};

export default QuestionCounter;
