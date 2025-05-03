import React from 'react';
import LoadingSpinner from '../loading/LoadingSpinner';

/**
 * Button component for submitting the exam
 *
 * @param {Object} props - Component props
 * @param {Function} props.handleSubmit - Function to handle submission
 * @param {boolean} props.isLoading - Whether submission is in progress
 */
const SubmitButton = ({ handleSubmit, isLoading }) => {
  return (
    <button
      onClick={handleSubmit}
      className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded w-full transition"
      disabled={isLoading}
      aria-label="Submit exam"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner
            type="border"
            size="1.5rem"
            color="border-white"
            thickness="border-2"
          />
        </div>
      ) : (
        "Nộp bài"
      )}
    </button>
  );
};

export default SubmitButton;
