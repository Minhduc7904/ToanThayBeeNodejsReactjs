import AdminLayout from "../../layouts/AdminLayout";
import FunctionBarAdmin from "../../components/bar/FunctionBarAdmin";
import QuestionTable from "../../components/table/QuestionTable";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddView, setIsFilterView } from "../../features/filter/filterSlice";
import UserDetail from "../../components/detail/UserDetail";
import AddQuestionModal from "../../components/modal/AddQuestionModal";
import AdminModal from "../../components/modal/AdminModal";

const StudentManagement = () => {
    const dispatch = useDispatch();
    const { isDetailView } = useSelector(state => state.users);
    const { isAddView, isFilterVIew } = useSelector(state => state.filter);

    return (
        <AdminLayout>
            <div className="flex w-full h-full py-[1.9375rem] px-[2.25rem] flex-col gap-[1.25rem] bg-white shadow-[0px_1px_8px_2px_rgba(20,20,20,0.08)]">
                <AdminModal isOpen={isAddView} headerText={'Tạo câu hỏi mới'} onClose={() => dispatch(setIsAddView(false))} >
                    <AddQuestionModal />
                </AdminModal>
                {/* {isDetailView ? (
                    <UserDetail />
                ) : (
                    <> */}
                        <div className="text-[#090a0a] text-[32px] font-bold font-['Be Vietnam Pro'] leading-9">
                            Danh sách câu hỏi
                        </div>
                        <FunctionBarAdmin />
                        <div className="w-full flex h-[2px] bg-[#E7E7ED]"></div>
                        <QuestionTable />
                    {/* </>
                )} */}

            </div>
        </AdminLayout >
    );
}

export default StudentManagement;