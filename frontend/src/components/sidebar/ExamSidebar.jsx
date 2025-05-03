import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SettingsButton from './SettingsButton';
import ThemeToggleButton from './ThemeToggleButton';
import SizeSlider from './SizeSlider';
import QuestionSection from './QuestionSection';
import QuestionCounter from './QuestionCounter';
import SubmitButton from './SubmitButton';
import TimeDisplay from './TimeDisplay';
import ViewModeToggle from './ViewModeToggle';
import ProgressBar from './ProgressBar';
import NetworkSpeedTest from '../NetworkSpeedTest';
import { BookmarkCheck, List } from 'lucide-react';

/**
 * Main sidebar component for exam interface
 */
const ExamSidebar = ({
  isDarkMode,
  setIsDarkMode,
  fontSize,
  handleFontSizeChange,
  imageSize,
  handleImageSizeChange,
  questionTN,
  questionDS,
  questionTLN,
  scrollToQuestion,
  selectedQuestion,
  saveQuestion,
  errorQuestion,
  markedQuestions = new Set(),
  toggleMarkQuestion = () => {},
  handleAutoSubmit,
  loadingSubmit,
  loadingLoadExam,
  exam,
  remainingTime,
  formatTime,
  questions,
  singleQuestionMode = false,
  setSingleQuestionMode = () => {}
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 right-0 w-11/12 sm:w-2/3 md:w-1/3 h-full ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } p-4 z-40 shadow-lg overflow-y-auto hide-scrollbar lg:sticky lg:shadow-none lg:h-[90vh] lg:top-20 lg:right-0`}
    >
      {/* Header with settings button and network speed */}
      <div className="flex items-center justify-between w-full">
        <SettingsButton
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          isDarkMode={isDarkMode}
        />
        <NetworkSpeedTest />
      </div>

      {/* Settings panel */}
      <div className={`transition-all duration-500 overflow-hidden ${
        showSettings ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <hr className="my-4" />
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Chế độ:</span>
          <ThemeToggleButton
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        </div>

        <hr className="my-4" />
        <SizeSlider
          label="Chỉnh cỡ chữ"
          value={fontSize}
          onChange={handleFontSizeChange}
          min={12}
          max={24}
          isDarkMode={isDarkMode}
          unit="px"
        />

        <hr className="my-4" />
        <SizeSlider
          label="Chỉnh cỡ ảnh"
          value={imageSize}
          onChange={handleImageSizeChange}
          min={6}
          max={20}
          isDarkMode={isDarkMode}
          unit="rem"
        />

        <hr className="my-4" />
        <ViewModeToggle
          singleQuestionMode={singleQuestionMode}
          setSingleQuestionMode={setSingleQuestionMode}
          isDarkMode={isDarkMode}
        />
      </div>

      <hr className="my-4" />

      {/* Filter toggle */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">Hiển thị:</span>
        <button
          onClick={() => setShowMarkedOnly(!showMarkedOnly)}
          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
            isDarkMode
              ? (showMarkedOnly ? 'bg-sky-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600')
              : (showMarkedOnly ? 'bg-sky-500 text-white' : 'bg-sky-100 text-black hover:bg-sky-200')
          }`}
          title={showMarkedOnly ? "Hiển thị tất cả câu hỏi" : "Chỉ hiển thị câu hỏi đã đánh dấu"}
        >
          {showMarkedOnly ? (
            <>
              <BookmarkCheck size={18} />
              <span>Đã đánh dấu</span>
            </>
          ) : (
            <>
              <List size={18} />
              <span>Tất cả</span>
            </>
          )}
        </button>
      </div>

      <hr className="my-4" />

      {/* Progress bar */}
      <ProgressBar
        completed={saveQuestion.size}
        total={questions.length}
        isDarkMode={isDarkMode}
      />

      <hr className="my-4" />

      {/* Time display */}
      <TimeDisplay
        isLoading={loadingLoadExam}
        exam={exam}
        remainingTime={remainingTime}
        formatTime={formatTime}
        isDarkMode={isDarkMode}
      />

      <hr className="my-4" />

      {/* Multiple choice questions section */}
      <QuestionSection
        title="Phần I: Trắc nghiệm"
        questions={questionTN}
        scrollToQuestion={scrollToQuestion}
        selectedQuestion={selectedQuestion}
        saveQuestion={saveQuestion}
        errorQuestion={errorQuestion}
        markedQuestions={markedQuestions}
        toggleMarkQuestion={toggleMarkQuestion}
        isDarkMode={isDarkMode}
        showMarkedOnly={showMarkedOnly}
      />

      <hr className="my-4" />

      {/* True/False questions section */}
      <QuestionSection
        title="Phần II: Đúng sai"
        questions={questionDS}
        scrollToQuestion={scrollToQuestion}
        selectedQuestion={selectedQuestion}
        saveQuestion={saveQuestion}
        errorQuestion={errorQuestion}
        markedQuestions={markedQuestions}
        toggleMarkQuestion={toggleMarkQuestion}
        isDarkMode={isDarkMode}
        showMarkedOnly={showMarkedOnly}
      />

      <hr className="my-4" />

      {/* Short answer questions section */}
      <QuestionSection
        title="Phần III: Trả lời ngắn"
        questions={questionTLN}
        scrollToQuestion={scrollToQuestion}
        selectedQuestion={selectedQuestion}
        saveQuestion={saveQuestion}
        errorQuestion={errorQuestion}
        markedQuestions={markedQuestions}
        toggleMarkQuestion={toggleMarkQuestion}
        isDarkMode={isDarkMode}
        showMarkedOnly={showMarkedOnly}
      />

      <hr className="my-4" />

      {/* Question statistics */}
      <div className="flex flex-col gap-2">
        <QuestionCounter
          count={saveQuestion.size}
          label="Số câu đã làm"
          bgColor="bg-green-600"
          bgColorLight="bg-green-500"
          isDarkMode={isDarkMode}
        />

        <QuestionCounter
          count={selectedQuestion !== null ? 1 : 0}
          label="Số câu đang làm"
          bgColor="bg-yellow-600"
          bgColorLight="bg-yellow-400"
          textColorLight="text-black"
          isDarkMode={isDarkMode}
        />

        <QuestionCounter
          count={questions.length - saveQuestion.size}
          label="Số câu chưa làm"
          bgColor="bg-gray-700"
          bgColorLight="bg-gray-300"
          textColorLight="text-black"
          isDarkMode={isDarkMode}
        />

        <QuestionCounter
          count={errorQuestion.size}
          label="Số câu chưa lưu"
          bgColor="bg-red-600"
          bgColorLight="bg-red-400"
          isDarkMode={isDarkMode}
        />

        <QuestionCounter
          count={markedQuestions.size}
          label="Số câu đã đánh dấu"
          bgColor="bg-sky-600"
          bgColorLight="bg-sky-500"
          textColorLight="text-white"
          isDarkMode={isDarkMode}
        />
      </div>

      <hr className="my-4" />

      {/* Submit button */}
      <SubmitButton
        handleSubmit={handleAutoSubmit}
        isLoading={loadingSubmit || loadingLoadExam}
      />
    </motion.div>
  );
};

export default ExamSidebar;
