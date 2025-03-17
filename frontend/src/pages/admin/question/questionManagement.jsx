import AdminLayout from "../../../layouts/AdminLayout";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
import QuestionTable from "../../../components/table/QuestionTable";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddView } from "../../../features/filter/filterSlice";
import AddQuestionModal from "../../../components/modal/AddQuestionModal";
import AdminModal from "../../../components/modal/AdminModal";
import { fetchQuestions } from "../../../features/question/questionSlice";

const QuestionManagement = () => {
    const dispatch = useDispatch();
    const { questions } = useSelector(state => state.questions);
    const { isAddView, isFilterVIew } = useSelector(state => state.filter);
    return (
        <AdminLayout>
                <AdminModal isOpen={isAddView} headerText={'Tạo câu hỏi mới'} onClose={() => dispatch(setIsAddView(false))} >
                    <AddQuestionModal onClose={() => dispatch(setIsAddView(false))} fetchQuestions={fetchQuestions} />
                </AdminModal>
                <div className="text-[#090a0a] text-[32px] font-bold font-['Be Vietnam Pro'] leading-9">
                    Danh sách câu hỏi
                </div>
                <FunctionBarAdmin />
                <QuestionTable fetchQuestions={fetchQuestions} />
        </AdminLayout >
    );
}

export default QuestionManagement;