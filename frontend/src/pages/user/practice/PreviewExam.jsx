import UserLayout from "../../../layouts/UserLayout";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPublicQuestionsByExamId } from "../../../features/question/questionSlice";
import { fetchRelatedExamsIfNeeded, fetchPublicExamById } from "../../../features/exam/examSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PreviewExam from "../../../components/detail/PreviewExam";
import RelatedExamCard from "../../../components/card/RelatedExamCard";
import { ChevronRight } from "lucide-react";

const PreviewExamPage = () => {
    const { examId } = useParams();
    const { exam, exams } = useSelector((state) => state.exams);
    const { questions } = useSelector((state) => state.questions);
    const { loading } = useSelector((state) => state.states);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPublicQuestionsByExamId(examId));
    }, [dispatch, examId]);

    useEffect(() => {
        dispatch(fetchPublicExamById(examId));
    }, [dispatch, examId]);

    useEffect(() => {
        dispatch(fetchRelatedExamsIfNeeded(examId));
    }, [dispatch, examId]);

    useEffect(() => {
        if (exam?.seeCorrectAnswer === false) {
            navigate(`/practice/exam/${examId}`);
        }
    }, [exam])

    return (
        <UserLayout>
            <div className="flex flex-col  items-center bg-[#F6FAFD] px-4 py-6">
                <div className="w-full max-w-7xl mx-auto overflow-y-auto hide-scrollbar">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-900 font-bevietnam mb-4">
                        <span
                            onClick={() => navigate("/")}
                            className="cursor-pointer"
                        >
                            Trang chủ
                        </span>

                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 15 16" fill="none">
                            <path d="M2.36002 0.940682C2.17719 0.84421 1.97253 0.796607 1.76588 0.802488C1.55924 0.808369 1.35762 0.867534 1.18057 0.974249C1.00352 1.08096 0.857033 1.23161 0.75532 1.41158C0.653607 1.59156 0.600113 1.79476 0.600024 2.00148V13.9975C0.60011 14.2054 0.654199 14.4097 0.756991 14.5903C0.859783 14.771 1.00775 14.9219 1.1864 15.0282C1.36505 15.1345 1.56824 15.1926 1.77608 15.1967C1.98392 15.2009 2.18928 15.151 2.37202 15.0519L13.572 8.97188C14.4152 8.51428 14.408 7.30388 13.5616 6.85588L2.36002 0.940682Z" fill="black" />
                        </svg>
                        <span
                            onClick={() => navigate("/practice")}
                            className="cursor-pointer"
                        >
                            Luyện đề
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 15 16" fill="none">
                            <path d="M2.36002 0.940682C2.17719 0.84421 1.97253 0.796607 1.76588 0.802488C1.55924 0.808369 1.35762 0.867534 1.18057 0.974249C1.00352 1.08096 0.857033 1.23161 0.75532 1.41158C0.653607 1.59156 0.600113 1.79476 0.600024 2.00148V13.9975C0.60011 14.2054 0.654199 14.4097 0.756991 14.5903C0.859783 14.771 1.00775 14.9219 1.1864 15.0282C1.36505 15.1345 1.56824 15.1926 1.77608 15.1967C1.98392 15.2009 2.18928 15.151 2.37202 15.0519L13.572 8.97188C14.4152 8.51428 14.408 7.30388 13.5616 6.85588L2.36002 0.940682Z" fill="black" />
                        </svg>
                        <span
                            onClick={() => navigate("/practice/exam/" + examId)}
                            className="cursor-pointer"
                        >
                            {exam?.name}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 15 16" fill="none">
                            <path d="M2.36002 0.940682C2.17719 0.84421 1.97253 0.796607 1.76588 0.802488C1.55924 0.808369 1.35762 0.867534 1.18057 0.974249C1.00352 1.08096 0.857033 1.23161 0.75532 1.41158C0.653607 1.59156 0.600113 1.79476 0.600024 2.00148V13.9975C0.60011 14.2054 0.654199 14.4097 0.756991 14.5903C0.859783 14.771 1.00775 14.9219 1.1864 15.0282C1.36505 15.1345 1.56824 15.1926 1.77608 15.1967C1.98392 15.2009 2.18928 15.151 2.37202 15.0519L13.572 8.97188C14.4152 8.51428 14.408 7.30388 13.5616 6.85588L2.36002 0.940682Z" fill="black" />
                        </svg>
                        <span
                            className="cursor-pointer text-red-500"
                        >
                            Xem đề thi
                        </span>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Card */}
                        <div className="flex flex-col bg-white rounded-lg shadow-lg p-3 sm:p-4 lg:p-6 gap-2 sm:gap-3 lg:gap-4 lg:w-3/4">
                            <div className="flex justify-center flex-col gap-4">
                                <div className="text-2xl font-semibold text-zinc-900 font-inter">
                                    {exam?.name}
                                </div>
                                <PreviewExam exam={exam} questions={questions} />
                            </div>
                        </div>

                        {/* Đề thi liên quan */}
                        {!loading && exams && exams.length > 0 && (
                            <div className="bg-white rounded shadow-lg p-3 sm:p-4 lg:p-6 lg:w-1/4 h-fit sticky top-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Đề thi liên quan</h2>
                                    <button
                                        onClick={() => navigate('/practice')}
                                        className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Xem tất cả
                                        <ChevronRight className="w-3 h-3 ml-1" />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {exams.map((relatedExam) => (
                                        <RelatedExamCard
                                            key={relatedExam.id}
                                            exam={relatedExam}
                                            onClick={() => navigate(`/practice/exam/${relatedExam.id}`)}
                                            compact={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default PreviewExamPage;
