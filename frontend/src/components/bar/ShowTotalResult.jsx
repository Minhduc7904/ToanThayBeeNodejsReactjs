import { useDispatch, useSelector } from "react-redux";
import {
    setSelectedGrade,
    setSelectedChapters,
    setSelectedExamTypes,
} from "../../features/filter/filterSlice";

const ShowTotalResult = () => {
    const dispatch = useDispatch();
    const {
        totalItems,
        currentPage,
        limit,
        selectedGrade,
        selectedChapters,
        selectedExamTypes,
        isSearch
    } = useSelector((state) => state.filter);

    // Không còn sử dụng debouncedFetch và fetchExams nữa vì chúng ta muốn người dùng
    // phải nhấn nút "Tìm kiếm" để áp dụng các thay đổi bộ lọc

    const handleRemoveGrade = () => {
        dispatch(setSelectedGrade(null));
        // Không gọi fetchExams() ở đây để tránh áp dụng bộ lọc ngay lập tức
    };

    const handleRemoveChapter = (code) => {
        const newChapters = selectedChapters.filter((c) => c !== code);
        dispatch(setSelectedChapters(newChapters));
        // Không gọi fetchExams() ở đây để tránh áp dụng bộ lọc ngay lập tức
    };

    const handleRemoveExamType = (code) => {
        const newTypes = selectedExamTypes.filter((c) => c !== code);
        dispatch(setSelectedExamTypes(newTypes));
        // Không gọi fetchExams() ở đây để tránh áp dụng bộ lọc ngay lập tức
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {/* Phần tổng số kết quả */}
            {totalItems > 0 ? (
                <div className="flex justify-between items-center w-full">
                    <p className="text-gray-500 text-sm">
                        Hiển thị {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalItems)} trong tổng số {totalItems} kết quả
                    </p>
                </div>
            ) : (
                <p className="text-gray-500">Không tìm thấy kết quả nào</p>
            )}

            {/* Phần hiển thị filter đã chọn */}
            <div className="flex flex-wrap gap-2 items-center">
                {isSearch && (
                    <>
                        {selectedGrade && (
                            <FilterTag label={`Lớp ${selectedGrade}`} onRemove={handleRemoveGrade} />
                        )}

                        {selectedChapters.map((code) => (
                            <FilterTag key={code} label={`Chương ${code}`} onRemove={() => handleRemoveChapter(code)} />
                        ))}

                        {selectedExamTypes.map((code) => (
                            <FilterTag key={code} label={`Loại đề ${code}`} onRemove={() => handleRemoveExamType(code)} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

// Component nhỏ để hiển thị từng tag
const FilterTag = ({ label, onRemove }) => (
    <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
        <span>{label}</span>
        <button
            onClick={onRemove}
            className="text-blue-500 hover:text-red-500 transition-colors text-base leading-none"
        >
            ×
        </button>
    </div>
);

export default ShowTotalResult;
