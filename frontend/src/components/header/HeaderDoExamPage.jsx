const HeaderDoExamPage = ({ nameExam, onExitFullscreen }) => {
    return (
        <div className="fixed w-full top-0 z-20 bg-sky-800 shadow-md p-4">
            <div className="flex justify-between items-center">
                <div className="text-white text-xl">{nameExam}</div>
                <button
                    onClick={onExitFullscreen}
                    className="text-white hover:underline"
                >
                    Thoát chế độ toàn màn hình
                </button>
            </div>
        </div>
    );
};

export default HeaderDoExamPage;
