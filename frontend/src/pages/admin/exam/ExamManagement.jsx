import { useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import FunctionBarAdmin from "../../../components/bar/FunctionBarAdmin";
import ExamTable from "../../../components/table/ExamTable";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddView, setIsFilterView } from "../../../features/filter/filterSlice";
import ExamDetail from "../../../components/detail/ExamDetail";
import AddExamModal from "../../../components/modal/AddExamModal";
import AdminModal from "../../../components/modal/AdminModal";
import { fetchExams } from "../../../features/exam/examSlice";

import * as examApi from "../../../features/exam/examSlice";


const ExamManagement = () => {
    const dispatch = useDispatch();
    const { exam } = useSelector(state => state.exams);
    const { isAddView, isFilterVIew } = useSelector(state => state.filter);
    const { search, currentPage, limit, totalItems, sortOrder } = useSelector(state => state.filter);
    const { exams } = useSelector(state => state.exams);


    useEffect(() => {
        dispatch(examApi.fetchExams({ search, currentPage, limit, sortOrder }))
            .unwrap()
    }, [dispatch, search, currentPage, limit, sortOrder]);


    return (
        <AdminLayout>
            <AdminModal isOpen={isAddView} headerText={'Tạo câu hỏi mới'} onClose={() => dispatch(setIsAddView(false))} >
                <AddExamModal onClose={() => dispatch(setIsAddView(false))} fetchExams={fetchExams} />
            </AdminModal>
            <div className="text-[#090a0a] text-[32px] font-bold font-['Be Vietnam Pro'] leading-9">
                Danh sách đề thi
            </div>
            <FunctionBarAdmin />
            <ExamTable exams={exams} fetchExams={fetchExams} />
        </AdminLayout >
    );
}

export default ExamManagement;