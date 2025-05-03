import React from 'react';
import LoadingSpinner from '../loading/LoadingSpinner';

/**
 * Component to display remaining time
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether exam is loading
 * @param {Object} props.exam - Exam object
 * @param {number} props.remainingTime - Remaining time in seconds
 * @param {Function} props.formatTime - Function to format time
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 */
const TimeDisplay = ({
  isLoading,
  exam,
  remainingTime,
  formatTime,
  isDarkMode
}) => {
  return (
    <p className={`text-center font-bold text-lg
      ${isDarkMode ? "text-yellow-300" : "text-red-500"}`}>
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner
            type="border"
            size="1rem"
            color="border-red-500"
            thickness="border-2"
          />
          Đang tải...
        </span>
      ) : (exam?.testDuration ? (
        `${formatTime(remainingTime)} phút`
      ) : (
        'Vô thời hạn'
      )
      )}
    </p>
  );
};

export default TimeDisplay;
