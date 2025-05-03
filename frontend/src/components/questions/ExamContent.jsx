import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import LoadingSpinner from '../loading/LoadingSpinner';
import QuestionSection from './QuestionSection';
import SingleQuestionView from './SingleQuestionView';

/**
 * Component hiển thị nội dung bài thi
 *
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Đang tải dữ liệu
 * @param {boolean} props.isDarkMode - Chế độ tối
 * @param {Array} props.questionTN - Danh sách câu hỏi trắc nghiệm
 * @param {Array} props.questionDS - Danh sách câu hỏi đúng/sai
 * @param {Array} props.questionTLN - Danh sách câu hỏi trả lời ngắn
 * @param {Object} props.handlers - Các hàm xử lý
 * @param {Object} props.settings - Các thiết lập
 * @param {boolean} props.isTimeUp - Đã hết thời gian làm bài
 * @param {boolean} props.initialSingleMode - Chế độ hiển thị ban đầu (true: từng câu, false: tất cả)
 */
const ExamContent = forwardRef(({
  loading,
  isDarkMode,
  questionTN,
  questionDS,
  questionTLN,
  handlers,
  settings,
  isTimeUp,
  initialSingleMode
}, ref) => {
  // Kiểm tra thiết bị di động
  const [isMobile, setIsMobile] = useState(false);

  // State cho chế độ hiển thị từng câu
  const [singleQuestionMode, setSingleQuestionMode] = useState(false);

  // State cho câu hỏi hiện tại và loại câu hỏi
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionType, setCurrentQuestionType] = useState('TN');

  // Tạo danh sách tất cả câu hỏi
  const allQuestions = [
    ...questionTN.map(q => ({ ...q, type: 'TN' })),
    ...questionDS.map(q => ({ ...q, type: 'DS' })),
    ...questionTLN.map(q => ({ ...q, type: 'TLN' }))
  ];

  // Kiểm tra thiết bị và thiết lập chế độ mặc định khi component được tải lần đầu
  useEffect(() => {
    // Kiểm tra thiết bị di động
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    // Thiết lập chế độ mặc định dựa trên thiết bị
    // Nếu initialSingleMode được cung cấp, sử dụng nó
    // Nếu không, sử dụng chế độ mặc định dựa trên thiết bị
    if (initialSingleMode !== undefined) {
      setSingleQuestionMode(initialSingleMode);
    } else {
      setSingleQuestionMode(mobile);
    }
  }, [initialSingleMode]);

  // Chỉ cập nhật trạng thái isMobile khi resize, không thay đổi chế độ hiển thị
  useEffect(() => {
    const updateMobileState = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', updateMobileState);

    return () => {
      window.removeEventListener('resize', updateMobileState);
    };
  }, []);

  // Hàm điều hướng câu hỏi
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setCurrentQuestionType(allQuestions[newIndex].type);

      // Đồng bộ với selectedQuestion
      if (settings && settings.selectedQuestion !== allQuestions[newIndex].id) {
        const newSelectedQuestion = allQuestions[newIndex].id;
        // Cập nhật selectedQuestion trong settings nếu có hàm cập nhật
        if (handlers && handlers.setSelectedQuestion) {
          handlers.setSelectedQuestion(newSelectedQuestion);
        }
      }
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setCurrentQuestionType(allQuestions[newIndex].type);

      // Đồng bộ với selectedQuestion
      if (settings && settings.selectedQuestion !== allQuestions[newIndex].id) {
        const newSelectedQuestion = allQuestions[newIndex].id;
        // Cập nhật selectedQuestion trong settings nếu có hàm cập nhật
        if (handlers && handlers.setSelectedQuestion) {
          handlers.setSelectedQuestion(newSelectedQuestion);
        }
      }
    }
  };

  // Hàm tìm và chuyển đến câu hỏi theo ID
  const goToQuestionById = (questionId) => {
    // Tìm index của câu hỏi trong danh sách tất cả câu hỏi
    const questionIndex = allQuestions.findIndex(q => q.id === questionId);

    // Nếu tìm thấy câu hỏi
    if (questionIndex !== -1) {
      // Chuyển đến câu hỏi đó trong chế độ xem từng câu
      setCurrentQuestionIndex(questionIndex);
      setCurrentQuestionType(allQuestions[questionIndex].type);

      // Đảm bảo chuyển sang chế độ xem từng câu nếu chưa ở chế độ đó
      if (!singleQuestionMode) {
        setSingleQuestionMode(true);
      }

      // Đồng bộ với selectedQuestion nếu cần
      if (settings && settings.selectedQuestion !== questionId) {
        // Cập nhật selectedQuestion trong settings nếu có hàm cập nhật
        if (handlers && handlers.setSelectedQuestion) {
          handlers.setSelectedQuestion(questionId);
        }
      }

      return true;
    }

    return false;
  };

  // Đồng bộ câu hỏi hiện tại với selectedQuestion khi chuyển chế độ hiển thị
  useEffect(() => {
    if (singleQuestionMode && allQuestions.length > 0) {
      // Nếu đã có selectedQuestion, tìm và hiển thị câu hỏi đó
      if (settings && settings.selectedQuestion) {
        const questionIndex = allQuestions.findIndex(q => q.id === settings.selectedQuestion);
        if (questionIndex !== -1) {
          setCurrentQuestionIndex(questionIndex);
          setCurrentQuestionType(allQuestions[questionIndex].type);
        }
      }
    }
  }, [singleQuestionMode, allQuestions, settings]);

  // Hàm cập nhật chế độ hiển thị với xử lý đặc biệt
  const updateSingleQuestionMode = (newMode) => {
    setSingleQuestionMode(newMode);

    // Khi chuyển sang chế độ hiển thị từng câu, đảm bảo câu hỏi hiện tại là câu hỏi được chọn
    if (newMode && allQuestions.length > 0) {
      // Nếu đã có selectedQuestion, tìm và hiển thị câu hỏi đó
      if (settings && settings.selectedQuestion) {
        const questionIndex = allQuestions.findIndex(q => q.id === settings.selectedQuestion);
        if (questionIndex !== -1) {
          setCurrentQuestionIndex(questionIndex);
          setCurrentQuestionType(allQuestions[questionIndex].type);
        }
      }
    }
  };

  // Export các hàm thông qua ref
  useImperativeHandle(ref, () => ({
    goToQuestionById,
    isSingleQuestionMode: () => singleQuestionMode,
    setSingleQuestionMode: updateSingleQuestionMode
  }));
  if (loading) {
    return (
      <div className="flex w-full h-screen shadow-md p-4 items-center justify-center">
        <LoadingSpinner
          type="dots"
          size="4rem"
          color="border-blue-600"
          showText={true}
          text="Đang tải câu hỏi..."
        />
      </div>
    );
  }

  // Hiển thị thông báo khi hết thời gian
  const timeUpMessage = isTimeUp && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p className="font-bold">Đã hết thời gian làm bài!</p>
      <p>Bạn không thể thay đổi câu trả lời. Hệ thống đang cố gắng nộp bài của bạn.</p>
    </div>
  );

  // Hiển thị nút chuyển đổi chế độ đã được chuyển sang sidebar

  // Hiển thị chế độ từng câu một
  const renderSingleQuestionMode = () => {
    if (allQuestions.length === 0) return <div>Không có câu hỏi nào.</div>;

    const currentQuestion = allQuestions[currentQuestionIndex];

    return (
      <SingleQuestionView
        question={currentQuestion}
        type={currentQuestion.type}
        index={currentQuestionIndex}
        totalQuestions={allQuestions.length}
        onPrevious={goToPreviousQuestion}
        onNext={goToNextQuestion}
        handlers={handlers}
        settings={{...settings, isTimeUp}}
      />
    );
  };

  // Hiển thị chế độ tất cả câu hỏi
  const renderAllQuestionsMode = () => (
    <>
      {questionTN.length > 0 && (
        <QuestionSection
          title="Phần I - Trắc nghiệm"
          questions={questionTN}
          type="TN"
          handlers={handlers}
          settings={{...settings, isTimeUp}}
        />
      )}

      {questionDS.length > 0 && (
        <QuestionSection
          title="Phần II - Đúng sai"
          questions={questionDS}
          type="DS"
          handlers={handlers}
          settings={{...settings, isTimeUp}}
        />
      )}

      {questionTLN.length > 0 && (
        <QuestionSection
          title="Phần III - Trả lời ngắn"
          questions={questionTLN}
          type="TLN"
          handlers={handlers}
          settings={{...settings, isTimeUp}}
        />
      )}
    </>
  );

  return (
    <div className={`w-full rounded-md h-fit flex flex-col shadow-md p-4 gap-4 ${
      isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'
    }`}>
      {timeUpMessage}

      {singleQuestionMode ? renderSingleQuestionMode() : renderAllQuestionsMode()}
    </div>
  );
});

export default ExamContent;
