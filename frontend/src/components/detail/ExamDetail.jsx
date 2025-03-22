import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import PutImage from "../image/PutImgae";
import LatexRenderer from "../latex/RenderLatex";
import DropMenuBarAdmin from "../dropMenu/OptionBarAdmin";
import SuggestInputBarAdmin from "../input/suggestInputBarAdmin";
import { fetchExamById, putExam, putImageExam, setExam } from "../../features/exam/examSlice";
import { useNavigate } from "react-router-dom";
import { fetchCodesByType } from "../../features/code/codeSlice";
import DetailTr from "./DetailTr";

const ExamDetail = ({ selectedExamId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { exam } = useSelector(state => state.exams);
    const { codes } = useSelector((state) => state.codes);
    const { loading } = useSelector(state => state.states);
    const [optionChapter, setOptionChapter] = useState([]);

    useEffect(() => {
        dispatch(fetchExamById(selectedExamId))
            .unwrap()
    }, [dispatch, selectedExamId]);

    useEffect(() => {
        dispatch(fetchCodesByType(["chapter", "exam type", "year", "grade"]))
            .unwrap()
    }, [dispatch]);

    useEffect(() => {
        if (!exam) return; // ✅ Kiểm tra tránh lỗi truy cập thuộc tính của null
        if (Array.isArray(codes["chapter"])) {
            if (exam?.class && exam?.class.trim() !== "") {
                setOptionChapter(
                    codes["chapter"].filter((code) => code.code.startsWith(exam?.class))
                );
            } else {
                setOptionChapter(codes["chapter"]);
            }
        } else {
            setOptionChapter([]);
        }
    }, [codes, exam?.class]);

    const handlePutImage = (examId, image) => {
        dispatch(putImageExam({ examId, examImage: image }))
            .unwrap()
            .then((data) => dispatch(setExam({ ...exam, imageUrl: data.newImageUrl }))) // ✅ Cập nhật lại exam sau khi thay đổi ảnh)
    }

    const handlePutExam = () => {
        dispatch(putExam({ examId: selectedExamId, examData: exam }))
            .unwrap()
            .then(() => dispatch(fetchExamById(selectedExamId)).unwrap())
    }

    const handleClickedQuestions = () => {
        navigate(`/admin/exam-management/${exam.id}/questions`);
    }

    const handleClickedPreviewExam = () => {
        navigate(`/admin/exam-management/${exam.id}/preview`);
    }

    if (!exam && !loading) {
        return (
            <>
                <p className="text-center text-gray-500">Không tìm thấy đề thi.</p>
                <button
                    onClick={() => navigate('/admin/exam-management')}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                >
                    ← Quay lại danh sách
                </button>
            </>

        );
    }

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex gap-2 items-center border-b border-[#E7E7ED]">
                <button onClick={() => navigate('/admin/exam-management')} className="flex items-center justify-center w-10 h-10 hover:bg-[#F6FAFD] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M12.6667 8.66675L5.50292 15.8289C5.38989 15.94 5.33337 16.0856 5.33337 16.2312M12.6667 23.3334L5.50292 16.6335C5.38989 16.5224 5.33337 16.3768 5.33337 16.2312M5.33337 16.2312H26.6667" stroke="#131214" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
                <div className="relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose">Chi tiết đề thi - {selectedExamId}</div>
            </div>
            <div className="flex gap-2 items-center border-b border-[#E7E7ED]">
                <div
                    className={`relative justify-center text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-gray-500 underline`}>
                    Chi tiết
                </div>
                <div
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                    -
                </div>
                <div
                    onClick={handleClickedQuestions}
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose "text-[#090a0a] cursor-pointer`}>
                    Danh sách câu hỏi
                </div>
                <div
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose text-[#090a0a]"}`}>
                    -
                </div>
                <div
                    onClick={handleClickedPreviewExam}
                    className={`relative justify-center text-[#090a0a] text-2xl font-bold font-['Be_Vietnam_Pro'] leading-loose cursor-pointer`}>
                    Xem đề thi
                </div>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <LoadingSpinner color="border-black" size="5rem" />
                </div>
            ) : (
                <>
                    <div className="flex h-full overflow-y-auto">
                        <table className="w-full border-collapse border border-[#E7E7ED]">
                            <thead className="bg-[#F6FAFD]">
                                <tr className="border border-[#E7E7ED]">
                                    <th className="p-3 text-[#202325] text-md font-bold font-['Be_Vietnam_Pro'] leading-[18px] w-64">Thuộc tính</th>
                                    <th className="p-3 text-[#202325] text-md font-bold font-['Be_Vietnam_Pro'] leading-[18px]">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                <DetailTr
                                    title="ID"
                                    value={exam?.id}
                                    type={0}
                                    required={true}
                                />
                                <DetailTr
                                    title="Tên đề"
                                    value={exam?.name}
                                    type={1}
                                    required={true}
                                    placeholder={"Nhập tên đề"}
                                    onChange={(e) => dispatch(setExam({ ...exam, name: e.target.value }))}
                                />
                                <DetailTr
                                    title="Loại đề"
                                    value={exam?.typeOfExam}
                                    type={0}
                                    required={true}
                                />
                                <DetailTr
                                    title={"Lớp"}
                                    value={exam?.class}
                                    type={3}
                                    required={true}
                                    options={Array.isArray(codes["grade"]) ? codes["grade"] : []}
                                    onChange={(option) => dispatch(setExam({ ...exam, class: option }))}
                                />
                                <DetailTr
                                    title={"Chương"}
                                    value={exam?.chapter}
                                    valueText={exam?.chapter ? codes['chapter']?.find((code) => code.code === exam?.chapter).description : "Chưa phân loại"}
                                    type={3}
                                    options={optionChapter}
                                    onChange={(option) => dispatch(setExam({ ...exam, chapter: option }))}
                                />
                                <DetailTr
                                    title="Năm"
                                    value={exam?.year}
                                    type={3}
                                    required={true}
                                    options={Array.isArray(codes["year"]) ? codes["year"] : []}
                                    onChange={(option) => dispatch(setExam({ ...exam, year: option }))}
                                />
                                <DetailTr
                                    title={"Mô tả"}
                                    value={exam?.description ? exam?.description : "Chưa có mô tả"}
                                    type={2}
                                    placeholder={"Nhập mô tả"}
                                    onChange={(e) => dispatch(setExam({ ...exam, description: e.target.value }))}
                                />
                                <DetailTr
                                    title="Thời gian"
                                    value={exam?.testDuration}
                                    valueText={exam?.testDuration ? exam?.testDuration : "Vô thời hạn"}
                                    type={3}
                                    options={[
                                        { code: "30", description: "30 phút" },
                                        { code: "45", description: "45 phút" },
                                        { code: "60", description: "60 phút" },
                                        { code: "90", description: "90 phút" },
                                        { code: "120", description: "120 phút" },
                                        { code: null, description: "Vô thời hạn" },
                                    ]}
                                    onChange={(option) => dispatch(setExam({ ...exam, testDuration: option }))}
                                />
                                <DetailTr
                                    title={"Tỷ lệ đạt"}
                                    value={exam?.passRate}
                                    type={4}
                                    placeholder={"Nhập tỷ lệ đạt"}
                                    valueText={exam?.passRate ? exam?.passRate + "%" : "0%"}
                                    onChange={(e) => dispatch(setExam({ ...exam, passRate: e.target.value }))}
                                />
                                <DetailTr
                                    title="Link lời giải"
                                    value={exam?.solutionUrl}
                                    type={1}
                                    valueText={exam?.solutionUrl ? exam?.solutionUrl : "Chưa có lời giải"}
                                    placeholder={"Nhập URL lời giải"}
                                    onChange={(e) => dispatch(setExam({ ...exam, solutionUrl: e.target.value }))}
                                />
                                
                                <tr className="border border-[#E7E7ED]">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-md font-bold">
                                            Ảnh
                                        </label>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-md">
                                        <PutImage imageUrl={exam?.imageUrl} inputId={exam?.id} id={exam?.id} className="w-full"
                                            putImageFunction={handlePutImage} />
                                    </td>
                                </tr>
                                <DetailTr 
                                    title="Công khai"
                                    value={exam?.public}
                                    type={3}
                                    required={true}
                                    options={[
                                        { code: true, description: "Công khai" },
                                        { code: false, description: "Không công khai" },
                                    ]}
                                    onChange={(option) => dispatch(setExam({ ...exam, public: option }))}
                                    valueText={exam?.public ? "Công khai" : "Không công khai"}
                                />
                                <DetailTr
                                    title="Ngày tạo"
                                    value={new Date(exam?.createdAt).toLocaleDateString()}
                                    type={0}
                                />
                                <DetailTr
                                    title="Ngày cập nhật"
                                    value={new Date(exam?.updatedAt).toLocaleDateString()}
                                    type={0}
                                />
                            </tbody>
                        </table>
                    </div>
                    <div className="flex w-full justify-end">
                        <button
                            type="button"
                            onClick={handlePutExam}
                            data-icon Position="None" data-mode="Light" data-size="Large" data-state="Default" data-type="Primary"
                            className="h-12 px-8 py-4 bg-[#253f61] hover:bg-[#1b2e47] active:bg-[#16263a] transition-all duration-300 rounded-[48px] flex justify-center items-center gap-2.5"
                        >
                            <div className="text-center justify-center text-white text-md font-medium font-['Inter'] leading-normal">
                                Lưu
                            </div>
                        </button>
                    </div>
                </>
            )}
        </div>

    )
}
export default ExamDetail;