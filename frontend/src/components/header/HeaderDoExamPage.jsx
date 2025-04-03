import FullScreen from "../button/ScreenButton";
const HeaderDoExamPage = ({ nameExam }) => {
    return (
        <div className="sticky w-full top-0 z-20 bg-sky-800 shadow-md p-4">
            <div className="flex justify-between items-center">
                <div className="text-white text-xl">{nameExam}</div>

                <FullScreen />
            </div>
        </div>
    );
};

export default HeaderDoExamPage;
