import AdminLayout from "../../layouts/AdminLayout";
import FunctionBarAdmin from "../../components/bar/FunctionBarAdmin";
// import ExamTable from "../../components/table/QuestionTable";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddView, setIsFilterView } from "../../features/filter/filterSlice";
// import ExamDetail from "../../components/detail/ExamDetail";
// import AddExamModal from "../../components/modal/AddExamModal";
import AdminModal from "../../components/modal/AdminModal";


const ExamManagement = () => {
    const dispatch = useDispatch();
    // const { isDetailView } = useSelector(state => state.exams);
    const { isAddView, isFilterVIew } = useSelector(state => state.filter);

    return (
        <AdminLayout>
            <div className="flex w-full h-full py-[1.9375rem] px-[2.25rem] flex-col gap-[1.25rem] bg-white shadow-[0px_1px_8px_2px_rgba(20,20,20,0.08)] overflow-y-auto">
                {/* <AdminModal isOpen={isAddView} headerText={'Tạo câu hỏi mới'} onClose={() => dispatch(setIsAddView(false))} >
                    {/* <AddQuestionModal onClose={() => dispatch(setIsAddView(false))} /> */}
                {/* </AdminModal> */}
                {/* {isDetailView ? (
                    // <QuestionDetail />
                ) : ( */}
                    <>
                        <div className="text-[#090a0a] text-[32px] font-bold font-['Be Vietnam Pro'] leading-9">
                            Danh sách đề thi
                        </div>
                        <FunctionBarAdmin />
                        <div className="w-full flex h-[2px] bg-[#E7E7ED]"></div>
                        {/* <ExamTable /> */}
                    </>
                {/* )} */}
            </div>
        </AdminLayout >
    );
}

export default ExamManagement;