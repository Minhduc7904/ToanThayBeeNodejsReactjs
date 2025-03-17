import ErrorsDisplay from "../error/ErrorsDisplay";

const AdminModal = ({ isOpen, onClose, children, headerText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            {/* <ErrorsDisplay/> */}
            <div className="bg-white shadow-lg relative flex flex-col rounded-[1.5rem] h-[80vh] w-[80vw]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 bg-[#253F61] rounded-t-[1.5rem]">
                    <div className="text-white text-xl font-medium font-['Be Vietnam Pro']">
                        {headerText}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white text-2xl font-bold hover:text-red-500 transition"
                    >
                        &times;
                    </button>
                </div>

                {/* Nội dung bên trong */}
                <div className="px-[2rem] pb-[2.25rem] pt-3 w-full h-full mb-5 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminModal;
