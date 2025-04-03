import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
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
        navigate(`/class/${classCode}`);
        setIsModalOpen(false);
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
                <p className="text-lg font-semibold mb-4">Nhập mã lớp</p>
                <p className="text-sm text-gray-500 mb-4">
                    Vui lòng nhập mã lớp để tham gia vào lớp học. Nếu chưa có lớp học hãy liên hệ với giáo viên.
                </p>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="VD: ABC12-34"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleJoinClass}
                        disabled={joining}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {joining ?
                            <LoadingSpinner size="1rem" color="border-white" />
                            : "Xác nhận"}
                    </button>
                </div>
            </div>
        </div>
    )

}

export default JoinClassModal;