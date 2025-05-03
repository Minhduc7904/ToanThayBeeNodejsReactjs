import React from 'react';

/**
 * Component hiển thị hình ảnh của câu hỏi hoặc câu trả lời
 * 
 * @param {Object} props - Component props
 * @param {string} props.imageUrl - URL của hình ảnh
 * @param {number} props.imageSize - Kích thước của hình ảnh (đơn vị: rem)
 * @param {boolean} props.isStatement - Có phải là hình ảnh của câu trả lời không
 * @param {string} props.altText - Văn bản thay thế cho hình ảnh
 */
const QuestionImage = ({ 
  imageUrl, 
  imageSize, 
  isStatement = false,
  altText = "question image" 
}) => {
  if (!imageUrl) return null;
  
  return (
    <div 
      className={`flex ${isStatement ? "flex-col" : "flex-col items-center justify-center w-full"} ${!isStatement ? "p-5" : ""}`}
      style={{ height: `${isStatement ? imageSize - 2 : imageSize}rem` }}
    >
      <img
        src={imageUrl}
        alt={altText}
        className="object-contain w-full h-full"
      />
    </div>
  );
};

export default QuestionImage;
