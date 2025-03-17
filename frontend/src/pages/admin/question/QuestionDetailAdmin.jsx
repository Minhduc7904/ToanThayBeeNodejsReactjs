import AdminLayout from "../../../layouts/AdminLayout";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import QuestionDetail from "../../../components/detail/QuestionDetail";

const QuestionDetailAdmin = () => {
    const { questionId } = useParams();

    return (
        <AdminLayout>
            <QuestionDetail selectedQuestionId={questionId} />
        </AdminLayout>
    )
}

export default QuestionDetailAdmin;
