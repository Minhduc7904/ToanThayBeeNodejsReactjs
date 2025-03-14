import { useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import FunctionBarAdmin from "../../components/bar/FunctionBarAdmin";
import QuestionTable from "../../components/table/QuestionTable";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddView, setIsFilterView } from "../../features/filter/filterSlice";
import QuestionDetail from "../../components/detail/QuestionDetail";
import AddQuestionModal from "../../components/modal/AddQuestionModal";
import AdminModal from "../../components/modal/AdminModal";
import { fetchQuestionById } from "../../features/question/questionSlice";

const StudentManagement = () => {
    const dispatch = useDispatch();
    const { isDetailView, question, selectedQuestionId } = useSelector(state => state.questions);
    const { isAddView, isFilterVIew } = useSelector(state => state.filter);

    useEffect(() => {
        if (selectedQuestionId && isDetailView) {
            dispatch(fetchQuestionById(selectedQuestionId))
            .unwrap()
        }
    }, [isDetailView]);



    return (
        <AdminLayout>
            <div className="flex w-full h-full py-[1.9375rem] px-[2.25rem] flex-col gap-[1.25rem] bg-white shadow-[0px_1px_8px_2px_rgba(20,20,20,0.08)] overflow-y-auto">
                <AdminModal isOpen={isAddView} headerText={'Tạo câu hỏi mới'} onClose={() => dispatch(setIsAddView(false))} >
                    <AddQuestionModal onClose={() => dispatch(setIsAddView(false))} />
                </AdminModal>
                {isDetailView ? (
                    <QuestionDetail question={question} selectedQuestionId={selectedQuestionId} />
                ) : (
                    <>
                        <div className="text-[#090a0a] text-[32px] font-bold font-['Be Vietnam Pro'] leading-9">
                            Danh sách câu hỏi
                        </div>
                        <FunctionBarAdmin />
                        <div className="w-full flex h-[2px] bg-[#E7E7ED]"></div>
                        <QuestionTable />
                    </>
                )}
            </div>
        </AdminLayout >
    );
}

export default StudentManagement;