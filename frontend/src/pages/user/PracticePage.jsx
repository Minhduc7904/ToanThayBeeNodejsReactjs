import UserLayout from "../../layouts/UserLayout";
import FilterExamSidebar from "../../components/sidebar/FilterExamSidebar";
import ShowTotalResult from "../../components/bar/ShowTotalResult";
import ExamCard from "../../components/card/ExamCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicExams } from "../../features/exam/examSlice";
import { useEffect } from "react";
import { setCurrentPage } from "../../features/filter/filterSlice";
import Pagination from "../../components/Pagination";

const PracticePage = () => {
    const { exams } = useSelector((state) => state.exams);
    const dispatch = useDispatch();
    const { search, limit, currentPage, sortOrder, totalItems } = useSelector((state) => state.filter);

    useEffect(() => {
        dispatch(fetchPublicExams({ search, currentPage, limit, sortOrder }));
    }, [dispatch, search, currentPage, limit, sortOrder]);

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };


    return (
        <UserLayout>
            <div className="flex h-full flex-row justify-center items-center">
                <FilterExamSidebar />
                <div className="w-4/5 h-full pl-[1rem] bg-[#F7F7F7]">
                    <div className="flex justify-start w-full h-full flex-col gap-2 bg-white p-[2rem]">
                        <div className="justify-start text-zinc-900 text-2xl font-semibold font-['Be_Vietnam_Pro']">Danh sách đề</div>
                        <ShowTotalResult totalItems={totalItems} currentPage={currentPage} limit={limit} isDelete={false} IsSort={false} />
                        <div className="h-[1px] w-full bg-neutral-200"></div>
                        <div className="w-full h-full overflow-y-auto" >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {exams.map((exam, index) => (
                                    <ExamCard key={index} exam={exam} />
                                ))}
                            </div>

                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            limit={limit}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default PracticePage;