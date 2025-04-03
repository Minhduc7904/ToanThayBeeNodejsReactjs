import React, { useState } from 'react';

const ExamRegulationModal = ({ isOpen, onClose, onStartExam, time }) => {
    const [agreed, setAgreed] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white text-black  w-[90%] max-w-2xl p-6 rounded-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-center">Quy chế thi môn Toán năm 2025</h2>

                <div className="overflow-y-auto hide-scrollbar pr-2 space-y-4 bg-gray-200 p-2">
                    <p><strong>🕒 Thời gian làm bài:</strong> {time} phút</p>
                    <p><strong>📝 Hình thức thi:</strong> Thi trắc nghiệm <span className="text-red-500 font-semibold">trực tuyến</span></p>

                    <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded text-sm border border-yellow-400 dark:border-yellow-600">
                        ⚠️ <strong>Lưu ý quan trọng:</strong><br />
                        - Khi bắt đầu thi, hệ thống sẽ <strong>bật chế độ toàn màn hình</strong>.<br />
                        - Mọi hành vi nghi vấn như chuyển tab, thoát toàn màn hình, sao chép nội dung đều sẽ bị <strong>ghi log</strong> và theo dõi.<br />
                        - Yêu cầu học sinh <span className="font-semibold text-red-500">tập trung trong toàn bộ thời gian làm bài</span>.
                    </div>

                    <p className="font-semibold">📚 Cấu trúc đề thi:</p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li><strong>Phần I:</strong> 12 câu trắc nghiệm nhiều lựa chọn (mỗi câu 0.25 điểm)</li>
                        <li><strong>Phần II:</strong> 4 câu trắc nghiệm Đúng/Sai (mỗi câu có 4 ý):
                            <ul className="list-[circle] ml-5 mt-1 space-y-1 text-sm">
                                <li>Chọn đúng 1 ý: 0.1 điểm</li>
                                <li>Chọn đúng 2 ý: 0.25 điểm</li>
                                <li>Chọn đúng 3 ý: 0.5 điểm</li>
                                <li>Chọn đúng cả 4 ý: 1 điểm</li>
                            </ul>
                        </li>
                        <li><strong>Phần III:</strong> 6 câu trả lời ngắn (mỗi câu 0.5 điểm)</li>
                    </ul>
                </div>

                <div className="mt-6">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm">Tôi đã đọc và đồng ý với quy chế thi</span>
                    </label>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-sm dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400"
                    >
                        Đóng
                    </button>
                    <button
                        disabled={!agreed}
                        onClick={onStartExam}
                        className={`px-4 py-2 rounded text-white text-sm transition font-b
                            ${agreed ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                    >
                        Làm bài
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamRegulationModal;
