import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../loading/LoadingSpinner';
import { setErrorMessage } from '../../features/state/stateApiSlice';
import { useDispatch } from 'react-redux';

const JoinClassModal = ({ isOpen, setIsModalOpen }) => {
    const [joining, setJoining] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const inputRef = useRef();

    const handleJoinClass = async () => {
        const classCode = inputRef.current?.value?.trim();
        if (!classCode) return dispatch(setErrorMessage("Mã lớp không được để trống"));
        setJoining(true);

        // Simulate delay
        setTimeout(() => {
            setJoining(false);
            setIsModalOpen(false);
            navigate(`/class/${classCode}`);
        }, 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center overflow-y-auto z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: -10 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: -10 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-md mx-4 p-6 rounded shadow-lg"
                    >
                        <h2 className="text-xl font-bold text-center text-sky-700 mb-2">Tham gia lớp học</h2>
                        <p className="text-sm text-gray-500 text-center mb-4">
                            Vui lòng nhập mã lớp để tham gia. Nếu chưa có lớp học hãy liên hệ với giáo viên.
                        </p>

                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="VD: ABC12-34"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleJoinClass}
                                disabled={joining}
                                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-md flex items-center justify-center"
                            >
                                {joining ? (
                                    <LoadingSpinner size="1rem" color="border-white" />
                                ) : (
                                    "Xác nhận"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default JoinClassModal;
