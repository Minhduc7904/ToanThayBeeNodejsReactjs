// components/card/ExamCard.jsx
import ExamDefaultImage from "../../assets/images/defaultExamImage.jpg"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveExamForUser } from "../../features/exam/examSlice";

const ExamCard = ({ exam }) => {
    const { name, year, createdAt, imageUrl, id, isSave } = exam;
    const navigate = useNavigate();

    const handleClicked = () => {
        navigate(`/practice/exam/${id}`);
    }

    const dispatch = useDispatch();
    const handleSaveExam = () => {
        dispatch(saveExamForUser({ examId: id }));
    }

    return (
        <div
            className="w-full sm:w-auto flex flex-row bg-white overflow-hidden p-2 border-r border-black">
            {/* Ảnh */}
            <div
                onClick={handleClicked}
                className="w-1/2 aspect-[1/1.4142] border border-gray-300 max-w-[8rem] "
                title={name}
            >
                <img
                    src={imageUrl || ExamDefaultImage}
                    alt={name}
                    className="object-cover w-full h-full cursor-pointer transition duration-300 hover:brightness-75"
                />
            </div>

            {/* Nội dung */}
            <div className="w-2/3 flex flex-col justify-between">
                <div className="flex px-4 flex-col gap-1">
                    <p
                        onClick={handleClicked}
                        className="text-sm font-semibold text-zinc-900 hover:text-blue-500 cursor-pointer">{name}
                    </p>


                    <div className="flex flex-row items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 7V12H17M12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.3869 21 12 21Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p
                            onClick={handleClicked}
                            className="text-sm text-zinc-600 hover:text-blue-500 cursor-pointer">{new Date(createdAt).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            })}</p>
                    </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-1 px-4">
                    <button
                        onClick={handleSaveExam}
                        className={`rounded hover:bg-gray-100 transition duration-200 ${isSave ? "text-blue-600" : "text-gray-700"
                            }`}
                        title={isSave ? "Đã lưu đề thi" : "Lưu đề thi"}
                    >
                        {isSave ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="17" viewBox="0 0 16 22" fill="none" className="fill-blue-600">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H14C14.5304 20 15.0391 19.7893 15.4142 19.4142C15.7893 19.0391 16 18.5304 16 18V4.414C15.9999 3.88361 15.7891 3.37499 15.414 3L13 0.586C12.625 0.210901 12.1164 0.000113275 11.586 0H2ZM12.238 8.793C12.3335 8.70075 12.4097 8.59041 12.4621 8.4684C12.5145 8.3464 12.5421 8.21518 12.5433 8.0824C12.5444 7.94962 12.5191 7.81794 12.4688 7.69505C12.4185 7.57215 12.3443 7.4605 12.2504 7.3666C12.1565 7.27271 12.0449 7.19846 11.922 7.14818C11.7991 7.0979 11.6674 7.0726 11.5346 7.07375C11.4018 7.0749 11.2706 7.10249 11.1486 7.1549C11.0266 7.20731 10.9162 7.28349 10.824 7.379L6.582 11.622L5.167 10.207C4.9784 10.0248 4.7258 9.92405 4.4636 9.92633C4.2014 9.9286 3.95059 10.0338 3.76518 10.2192C3.57977 10.4046 3.4746 10.6554 3.47233 10.9176C3.47005 11.1798 3.57084 11.4324 3.753 11.621L5.803 13.672C5.90515 13.7742 6.02644 13.8553 6.15993 13.9106C6.29342 13.9659 6.4365 13.9944 6.581 13.9944C6.7255 13.9944 6.86858 13.9659 7.00207 13.9106C7.13556 13.8553 7.25685 13.7742 7.359 13.672L12.238 8.793Z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="17"
                                viewBox="0 0 16 22"
                                fill="none"
                                className={`transition duration-200 fill-gray-500`}
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M2 0C1.47 0 0.96 0.21 0.59 0.59C0.21 0.96 0 1.47 0 2V18C0 18.53 0.21 19.04 0.59 19.41C0.96 19.79 1.47 20 2 20H14C14.53 20 15.04 19.79 15.41 19.41C15.79 19.04 16 18.53 16 18V4.414C15.9999 3.88361 15.7891 3.37499 15.414 3L13 0.586C12.625 0.21 12.12 0 11.59 0H2ZM2 2H11.586L14 4.414V18H2V2ZM12.238 8.793C12.33 8.7 12.41 8.59 12.46 8.47C12.51 8.35 12.54 8.21 12.54 8.08C12.54 7.95 12.52 7.81 12.47 7.69C12.42 7.57 12.34 7.46 12.25 7.36C12.16 7.27 12.04 7.2 11.92 7.15C11.8 7.1 11.67 7.07 11.53 7.07C11.4 7.07 11.27 7.1 11.15 7.15C11.02 7.21 10.91 7.28 10.82 7.38L6.582 11.622L5.167 10.207C4.98 10.02 4.72 9.92 4.46 9.92C4.2 9.93 3.95 10.03 3.76 10.22C3.58 10.4 3.47 10.65 3.47 10.91C3.47 11.18 3.57 11.43 3.75 11.62L5.803 13.672C5.91 13.77 6.02 13.85 6.16 13.91C6.29 13.97 6.44 13.99 6.58 13.99C6.72 13.99 6.87 13.96 7 13.91C7.13 13.86 7.26 13.77 7.36 13.67L12.238 8.793Z"
                                />
                            </svg>
                        )}
                    </button>
                    <div title={exam.isDone ? "Đã làm" : "Chưa làm"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            className={`${exam.isDone ? "fill-green-500" : "fill-gray-500"}`}
                        >
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12C3 14.3869 3.94821 16.6761 5.63604 18.364C7.32387 20.0518 9.61305 21 12 21ZM11.768 15.64L16.768 9.64L15.232 8.36L10.932 13.519L8.707 11.293L7.293 12.707L10.293 15.707L11.067 16.481L11.768 15.64Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ExamCard;
