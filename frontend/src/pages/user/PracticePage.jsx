import UserLayout from "../../layouts/UserLayout";
import FilterExamSidebar from "../../components/sidebar/FilterExamSidebar";
import ShowTotalResult from "../../components/bar/ShowTotalResult";
import ExamCard from "../../components/card/ExamCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { setCurrentPage } from "../../features/filter/filterSlice";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/loading/LoadingSpinner";

const PracticePage = () => {
    const { exams } = useSelector((state) => state.exams);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.states);
    const [showSidebar, setShowSidebar] = useState(false);
    const sidebarRef = useRef();
    const {  limit, currentPage, sortOrder, totalItems } = useSelector((state) => state.filter);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setShowSidebar(false);
            }
        };

        if (showSidebar) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSidebar]);

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    return (
        <UserLayout>
            <div className="relative">
                {/* Nút mở sidebar cho mobile */}
                <div className="lg:hidden px-4 py-4">
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                    >
                        Bộ lọc đề
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row bg-[#F6FAFD] p-4 gap-4">
                    <div className="w-1/4">
                        <FilterExamSidebar />
                    </div>
                    {/* Main content */}
                    <div className="w-full">
                        <div className="bg-white w-full p-6 rounded-xl shadow-sm">
                            <h1 className="text-2xl font-bold text-zinc-800 mb-4">Danh sách đề</h1>
                            <div className="h-screen" >
                                {loading ? (
                                    <div className="flex justify-center items-center w-full h-40">
                                        <LoadingSpinner color="border-black" size="4rem" />
                                    </div>
                                ) : (
                                    <>
                                        <ShowTotalResult
                                            totalItems={totalItems}
                                            currentPage={currentPage}
                                            limit={limit}
                                            isDelete={false}
                                            IsSort={false}
                                        />

                                        <div className="border-b border-gray-200 my-4" />

                                        {/* Danh sách đề */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {exams.length === 0 ? (
                                                <p className="col-span-full text-center text-gray-500">Không có đề nào phù hợp.</p>
                                            ) : (
                                                exams.map((exam, index) => <ExamCard key={index} exam={exam} />)
                                            )}
                                        </div>

                                        {/* Pagination */}
                                        <div className="flex justify-center mt-8">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalItems={totalItems}
                                                limit={limit}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Sidebar mobile */}
                {showSidebar && (
                    <FilterExamSidebar ref={sidebarRef}  isMobile={true} onClose={() => setShowSidebar(false)} />
                )}
            </div>
        </UserLayout>

    );
};

export default PracticePage;
