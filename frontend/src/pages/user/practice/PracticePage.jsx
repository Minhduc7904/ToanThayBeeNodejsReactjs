import UserLayout from "../../../layouts/UserLayout";
import ShowTotalResult from "../../../components/bar/ShowTotalResult";
import ExamCard from "../../../components/card/ExamCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setCurrentPage, resetFilters } from "../../../features/filter/filterSlice";
import Pagination from "../../../components/Pagination";
import LoadingSpinner from "../../../components/loading/LoadingSpinner";
import NoDataFound from "../../../assets/images/error-file.png";
import FilterExamTopbar from "../../../components/filter/FilterExamTopbar";

const PracticePage = () => {
    const { exams } = useSelector((state) => state.exams);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.states);
    const { limit, currentPage, sortOrder, totalItems } = useSelector((state) => state.filter);
    const { codes } = useSelector((state) => state.codes);

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    return (
        <UserLayout>
            <div className="bg-white">
                {/* Filter topbar */}
                <FilterExamTopbar />

                {/* Main content */}
                <div className="bg-white w-full rounded-xl shadow-sm  px-4">
                    <div className="max-w-[70rem] mx-auto">
                        <h1 className="text-2xl font-bold text-zinc-800 mb-4">Danh sách đề</h1>
                        <div className="min-h-screen">
                            {loading ? (
                                <div className="flex justify-center items-center w-full h-40">
                                    <LoadingSpinner
                                        type="dots"
                                        color="border-blue-600"
                                        size="4rem"
                                        showText={true}
                                        text="Đang tải danh sách đề thi..."
                                    />
                                </div>
                            ) : (
                                <>
                                    <ShowTotalResult />

                                    <div className="border-b border-gray-200 my-4" />

                                    {/* Danh sách đề */}
                                    {(exams.length === 0 || !exams[0]) && (
                                        <div className="flex items-center flex-col justify-center p-4 w-full">
                                            <img src={NoDataFound} alt="No Data Found" className="w-[8rem]" />
                                            <p className="text-gray-500 text-sm sm:text-base md:text-lg">Không có đề nào phù hợp</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-3 gap-4">
                                        {(exams.length > 0 && exams[0]) && (
                                            exams.map((exam, index) => <ExamCard key={index} exam={exam} codes={codes} />)
                                        )}
                                    </div>

                                    {/* Pagination */}
                                    {(exams.length > 0 && exams[0]) && (
                                        <div className="flex justify-center mt-8">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalItems={totalItems}
                                                limit={10}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default PracticePage;
