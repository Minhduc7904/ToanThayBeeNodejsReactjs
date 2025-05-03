import React from 'react';

/**
 * Slider component for adjusting font or image size
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the slider
 * @param {number} props.value - Current value
 * @param {Function} props.onChange - Function to handle value change
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 * @param {string} props.unit - Unit for the value (e.g., 'px', 'rem')
 */
const SizeSlider = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  isDarkMode, 
  unit = 'px' 
}) => {
  return (
    <>
      <p className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}>
        {label}
      </p>
      <div className="flex flex-row gap-2 justify-between items-center">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className={`w-full h-2 rounded-lg cursor-pointer appearance-none
            ${isDarkMode ? "bg-gray-700" : "slider"}`}
          aria-label={`Adjust ${label.toLowerCase()}`}
        />
        <div className={`text-sm font-bold font-bevietnam ${isDarkMode ? "text-white" : "text-black"}`}>
          {value}{unit}
        </div>
      </div>
    </>
  );
};

export default SizeSlider;
