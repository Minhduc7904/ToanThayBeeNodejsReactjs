import React from 'react';

/**
 * Component hiển thị thanh tiến độ làm bài với phần trăm và số câu đã làm
 * 
 * @param {Object} props - Component props
 * @param {number} props.completed - Số câu đã hoàn thành
 * @param {number} props.total - Tổng số câu hỏi
 * @param {boolean} props.isDarkMode - Trạng thái dark mode
 */
const ProgressBar = ({ completed, total, isDarkMode }) => {
  // Tính phần trăm hoàn thành
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Tiến độ làm bài:</span>
        <span className="font-medium">{completed}/{total} câu</span>
      </div>
      
      <div className={`w-full h-4 rounded-full relative ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        {/* Thanh tiến độ */}
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            isDarkMode ? 'bg-sky-600' : 'bg-sky-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
        
        {/* Phần trăm ở giữa */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold text-xs ${
            isDarkMode 
              ? (percentage > 50 ? 'text-white' : 'text-white') 
              : (percentage > 50 ? 'text-white' : 'text-gray-700')
          }`}>
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
