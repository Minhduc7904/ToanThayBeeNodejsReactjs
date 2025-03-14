const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                <h2 className="text-xl font-semibold text-gray-800">Xác nhận xóa</h2>
                <p className="text-gray-600 mt-2">Bạn có chắc chắn muốn xóa câu hỏi này?</p>

                <div className="flex justify-end mt-4 space-x-3">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        onClick={onConfirm}
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;