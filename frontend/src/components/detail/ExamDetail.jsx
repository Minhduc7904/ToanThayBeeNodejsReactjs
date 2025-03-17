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

const ExamDetail = ({ selectedExamId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { exam } = useSelector(state => state.exams);
    const { codes } = useSelector((state) => state.codes);
    const { loading } = useSelector(state => state.states);
    const [optionChapter, setOptionChapter] = useState([]);
    const [editName, setEditName] = useState(false);
    const [editClass, setEditClass] = useState(false);
    const [editChapter, setEditChapter] = useState(false);
    const [editYear, setEditYear] = useState(false);
    const [editDuration, setEditDuration] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const [editPassRate, setEditPassRate] = useState(false);
    const [editSolutionUrl, setEditSolutionUrl] = useState(false);
    const [editPublic, setEditPublic] = useState(false);

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
        <div className="flex flex-col gap-4">
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
                    <div className="flex-grow">
                        <table className="w-full border-collapse border border-[#E7E7ED]">
                            <thead className="bg-[#F6FAFD]">
                                <tr className="border border-[#E7E7ED]">
                                    <th className="p-3 text-[#202325] text-lg font-bold font-['Be_Vietnam_Pro'] leading-[18px] w-64">Thuộc tính</th>
                                    <th className="p-3 text-[#202325] text-lg font-bold font-['Be_Vietnam_Pro'] leading-[18px]">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    className="border border-[#E7E7ED] ">
                                    <td className="p-3  text-[#202325] text-lg font-bold">ID</td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {exam?.id}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED] ">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Tên <span className="text-red-500"> *</span>
                                        </label>

                                        <button onClick={() => setEditName(!editName)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {!editName ? (
                                            <>{exam?.name}</>
                                        ) : (
                                            <input
                                                placeholder="Nhập tên đề thi"
                                                value={exam?.name}
                                                onChange={(e) => dispatch(setExam({ ...exam, name: e.target.value }))}
                                                className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED] ">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Kiểu đề <span className="text-red-500"> *</span>
                                        </label>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {exam?.typeOfExam}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED] ">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Lớp <span className="text-red-500"> *</span>
                                        </label>
                                        <button onClick={() => setEditClass(!editClass)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.247 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {!editClass ? (
                                            <>{exam?.class}</>
                                        ) : (
                                            <DropMenuBarAdmin
                                                selectedOption={exam?.class}
                                                onChange={(option) => dispatch(setExam({ ...exam, class: option }))}
                                                options={Array.isArray(codes["grade"]) ? codes["grade"] : []}
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED] ">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Chương
                                        </label>
                                        <button onClick={() => setEditChapter(!editChapter)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {!editChapter ? (
                                            <>{exam?.chapter ? codes['chapter']?.find((code) => code.code === exam?.chapter).description : "Chưa phân loại"}</>
                                        ) : (
                                            <SuggestInputBarAdmin
                                                selectedOption={exam?.chapter}
                                                onChange={(option) => dispatch(setExam({ ...exam, chapter: option }))}
                                                options={optionChapter}
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED]">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Năm <span className="text-red-500"> *</span>
                                        </label>
                                        <button onClick={() => setEditYear(!editYear)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.247 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {!editYear ? (
                                            <>{exam?.year}</>
                                        ) : (
                                            <DropMenuBarAdmin
                                                selectedOption={exam?.year}
                                                onChange={(option) => dispatch(setExam({ ...exam, year: option }))}
                                                options={Array.isArray(codes["year"]) ? codes["year"] : []}
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED]">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Mô tả
                                        </label>
                                        <button onClick={() => setEditDescription(!editDescription)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg break-words max-w-10">
                                        {!editDescription ? (
                                            <>{exam?.description ? exam?.description : "Không có mô tả"}</>
                                        ) : (
                                            <textarea
                                                placeholder="Nhập mô tả"
                                                value={exam?.description}
                                                onChange={(e) => dispatch(setExam({ ...exam, description: e.target.value }))}
                                                className="w-full h-[100px] resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED]">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Thời gian <span className="text-red-500"> *</span>
                                        </label>
                                        <button onClick={() => setEditDuration(!editDuration)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.247 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {!editDuration ? (
                                            <>{exam?.testDuration ? exam?.testDuration : "Vô thời hạn"}</>
                                        ) : (
                                            <DropMenuBarAdmin
                                                selectedOption={exam?.testDuration}
                                                onChange={(option) => dispatch(setExam({ ...exam, testDuration: option }))}
                                                options={[
                                                    { code: "30", description: "30 phút" },
                                                    { code: "45", description: "45 phút" },
                                                    { code: "60", description: "60 phút" },
                                                    { code: "90", description: "90 phút" },
                                                    { code: "120", description: "120 phút" },
                                                    { code: null, description: "Vô thời hạn" },
                                                ]}
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED]">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Tỷ lệ đạt <span className="text-red-500"> *</span>
                                        </label>
                                        <button onClick={() => setEditPassRate(!editPassRate)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.247 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {!editPassRate ? (
                                            <>{exam?.passRate ? exam?.passRate + '%' : "0%"}</>
                                        ) : (
                                            <input
                                                type="number"
                                                placeholder="Nhập tỷ lệ đạt"
                                                value={exam?.passRate}
                                                onChange={(e) => dispatch(setExam({ ...exam, passRate: e.target.value }))}
                                                className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED]">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Link lời giải
                                        </label>
                                        <button onClick={() => setEditSolutionUrl(!editSolutionUrl)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16. 983 2.99963C17.247 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {!editSolutionUrl ? (
                                            <>{exam?.solutionUrl ? exam?.solutionUrl : "Chưa có lời giải"}</>
                                        ) : (
                                            <input
                                                placeholder="Nhập URL lời giải"
                                                value={exam?.solutionUrl}
                                                onChange={(e) => dispatch(setExam({ ...exam, solutionUrl: e.target.value }))}
                                                className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED]">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Ảnh
                                        </label>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        <PutImage imageUrl={exam?.imageUrl} inputId={exam?.id} id={exam?.id} className="w-full"
                                            putImageFunction={handlePutImage} />
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED]">
                                    <td className="p-3 flex justify-between items-center">
                                        <label className="text-[#202325] text-lg font-bold">
                                            Công khai
                                        </label>
                                        <button onClick={() => setEditPublic(!editPublic)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.247 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {!editPublic ? (
                                            <>{exam?.public ? "Công khai" : "Không công khai"}</>
                                        ) : (
                                            <DropMenuBarAdmin
                                                selectedOption={exam?.public}
                                                onChange={(option) => dispatch(setExam({ ...exam, public: option }))}
                                                options={[
                                                    { code: true, description: "Công khai" },
                                                    { code: false, description: "Không công khai" },
                                                ]}
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED]">
                                    <td className="p-3 text-[#202325] text-lg font-bold">Ngày tạo</td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {new Date(exam?.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                                <tr className="border border-[#E7E7ED]">
                                    <td className="p-3 text-[#202325] text-lg font-bold">Người tạo</td>
                                    <td className="p-3 text-[#72777a] text-lg">
                                        {new Date(exam?.updatedAt).toLocaleDateString()}
                                    </td>
                                </tr>
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
                            <div className="text-center justify-center text-white text-lg font-medium font-['Inter'] leading-normal">
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