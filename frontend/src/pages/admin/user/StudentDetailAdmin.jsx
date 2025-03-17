import AdminLayout from "../../../layouts/AdminLayout";
import { useParams } from "react-router-dom";
import UserDetail from "../../../components/detail/UserDetail";


const StudentDetailAdmin = () => {
    const { studentId } = useParams();

    return (
        <AdminLayout>
            <UserDetail userId={studentId} />
        </AdminLayout>
    )
}

export default StudentDetailAdmin;