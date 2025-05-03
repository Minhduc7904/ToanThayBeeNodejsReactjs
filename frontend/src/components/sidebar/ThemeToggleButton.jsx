import React from 'react';

/**
 * Button component for toggling between light and dark mode
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 * @param {Function} props.setIsDarkMode - Function to toggle dark mode
 */
const ThemeToggleButton = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <button
      onClick={() => setIsDarkMode(prev => !prev)}
      className={`text-sm font-semibold py-1 px-2 rounded transition-colors
        ${isDarkMode
          ? "bg-gray-700 hover:bg-gray-600 text-white"
          : "bg-gray-200 hover:bg-gray-300 text-black"}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggleButton;
