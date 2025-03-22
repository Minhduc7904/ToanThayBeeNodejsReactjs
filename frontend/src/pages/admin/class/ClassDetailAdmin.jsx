import AdminLayout from "../../../layouts/AdminLayout";
import { useParams } from "react-router-dom";
import ClassDetail from "../../../components/detail/ClassDetail";

const ClassDetailAdmin = () => {
    const { classId } = useParams();

    return (
        <AdminLayout>
            <ClassDetail classId={classId} />
        </AdminLayout>
    )
}

export default ClassDetailAdmin;
