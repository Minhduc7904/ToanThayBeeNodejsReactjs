import React from 'react';
import { Layers, ArrowLeftRight } from 'lucide-react';

/**
 * Component nút chuyển đổi chế độ hiển thị câu hỏi
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.singleQuestionMode - Chế độ hiển thị hiện tại (true: từng câu, false: tất cả)
 * @param {Function} props.setSingleQuestionMode - Hàm thay đổi chế độ hiển thị
 * @param {boolean} props.isDarkMode - Chế độ tối
 */
const ViewModeToggle = ({ singleQuestionMode, setSingleQuestionMode, isDarkMode }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <span className="font-semibold">Chế độ hiển thị:</span>
      <button
        onClick={() => setSingleQuestionMode(!singleQuestionMode)}
        className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
          isDarkMode
            ? (singleQuestionMode ? 'bg-sky-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600')
            : (singleQuestionMode ? 'bg-sky-500 text-white' : 'bg-blue-100 text-black hover:bg-blue-200')
        }`}
        title={singleQuestionMode ? "Hiển thị tất cả câu hỏi" : "Hiển thị từng câu một"}
      >
        {singleQuestionMode ? (
          <>
            <ArrowLeftRight size={18} />
            <span>Từng câu</span>
          </>
        ) : (
          <>
            <Layers size={18} />
            <span>Tất cả</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ViewModeToggle;
