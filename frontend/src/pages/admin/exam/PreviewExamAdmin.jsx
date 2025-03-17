import AdminLayout from "../../../layouts/AdminLayout";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchExamQuestions } from "../../../features/question/questionSlice";
import { useNavigate } from "react-router-dom";
import AdminModal from "../../../components/modal/AdminModal";
import AddQuestionModal from "../../../components/modal/AddQuestionModal";
import { setIsAddView } from "../../../features/filter/filterSlice";
import PreviewExam from "../../../components/detail/PreviewExam";

const PreviewExamAdmin = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const handleClickedDetail = () => {
        navigate(`/admin/exam-management/${examId}`);
    }
    const handleClickedQuestions = () => {
        navigate(`/admin/exam-management/${examId}/questions`);
    }
    const dispatch = useDispatch();
    const { isAddView } = useSelector(state => state.filter);
    return (
        <AdminLayout>
            <AdminModal isOpen={isAddView} headerText={'Tạo câu hỏi mới'} onClose={() => dispatch(setIsAddView(false))} >
                <AddQuestionModal onClose={() => dispatch(setIsAddView(false))} examId={examId} fetchQuestions={fetchExamQuestions} />
            </AdminModal>
            <div className="flex flex-col gap-4 h-full w-full">
                <div className="flex gap-2 items-center border-b border-[#E7E7ED]">
                    <button onClick={() => navigate('/admin/exam-management')} className="flex items-center justify-center w-10 h-10 hover:bg-[#F6FAFD] rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M12.6667 8.66675L5.50292 15.8289C5.38989 15.94 5.33337 16.0856 5.33337 16.2312M12.6667 23.3334L5.50292 16.6335C5.38989 16.5224 5.33337 16.3768 5.33337 16.2312M5.33337 16.2312H26.6667" stroke="#131214" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose">Chi tiết đề thi - {examId}</div>
                </div>
                <div className="flex gap-2 items-center border-b border-[#E7E7ED]">
                    <div
                        onClick={handleClickedDetail}
                        className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose cursor-pointer`}>
                        Chi tiết
                    </div>
                    <div
                        className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                        -
                    </div>
                    <div
                        onClick={handleClickedQuestions}
                        className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose cursor-pointer`}>
                        Danh sách câu hỏi
                    </div>
                    <div
                        className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                        -
                    </div>
                    <div
                        className={`relative justify-center text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-gray-500 underline`}>
                        Xem đề thi
                    </div>

                </div>
                <PreviewExam examId={examId}/>
            </div>
        </AdminLayout>
    )
}

export default PreviewExamAdmin;
