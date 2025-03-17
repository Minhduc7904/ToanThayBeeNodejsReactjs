import AdminLayout from "../../../layouts/AdminLayout";
import { useParams } from "react-router-dom";
import ExamDetail from "../../../components/detail/ExamDetail";

const ExamDetailAdmin = () => {
    const { examId } = useParams();

    return (
        <AdminLayout>
            <ExamDetail selectedExamId={examId} />
        </AdminLayout>
    )
}

export default ExamDetailAdmin;
