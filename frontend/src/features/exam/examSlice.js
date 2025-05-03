import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as examApi from "../../services/examApi";
import { setCurrentPage, setTotalPages, setTotalItems, setLimit } from "../filter/filterSlice";
import { apiHandler } from "../../utils/apiHandler";

export const fetchExams = createAsyncThunk(
    "exams/fetchExams",
    async ({ search, currentPage, limit, sortOrder }, { dispatch }) => {
        return await apiHandler(dispatch, examApi.getAllExamAPI, { search, currentPage, limit, sortOrder }, (data) => {
            dispatch(setCurrentPage(data.currentPage));
            dispatch(setTotalPages(data.totalPages));
            dispatch(setTotalItems(data.totalItems));
        }, true, false);
    }
);

export const fetchNewestExams = createAsyncThunk(
    "exams/fetchNewestExams",
    async (_, { dispatch }) => {
        return await apiHandler(dispatch, examApi.getNewestExamAPI, null, () => { }, false, false);
    }
);

export const fetchSavedExam = createAsyncThunk(
    "exams/fetchSavedExam",
    async (_, { dispatch }) => {
        return await apiHandler(dispatch, examApi.getExamsSavedAPI, null, () => { }, false, false);
    }
);

export const reExamination = createAsyncThunk(
    "exams/reExamination",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, examApi.reExamination, id, () => { }, true, false, false, false);
    }
);

export const summitExam = createAsyncThunk(
    "exams/summitExam",
    async (attemptId, { dispatch }) => {
        return await apiHandler(dispatch, examApi.summitExamAPI, { attemptId }, () => { }, true, false);
    }
);

export const fetchPublicExams = createAsyncThunk(
    "exams/fetchPublicExams",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, examApi.getAllPublicExamAPI, data, (data) => {
            dispatch(setCurrentPage(data.currentPage));
            dispatch(setTotalPages(data.totalPages));
            dispatch(setTotalItems(data.totalItems));
            dispatch(setLimit(data.limit));
        }, false, false);
    }
);

export const fetchRelatedExams = createAsyncThunk(
    "exams/fetchRelatedExams",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, examApi.getRelatedExamAPI, id, () => { }, false, false);
    }
);

// Thêm action mới để kiểm tra và chỉ gọi API khi cần thiết
export const fetchRelatedExamsIfNeeded = createAsyncThunk(
    "exams/fetchRelatedExamsIfNeeded",
    async (id, { dispatch, getState }) => {
        const state = getState();
        const { relatedExams, lastFetchedRelatedExams } = state.exams;

        // Kiểm tra xem đã có dữ liệu trong cache chưa
        const hasData = relatedExams[id] && relatedExams[id].length > 0;

        // Kiểm tra thời gian cache (5 phút = 300000ms)
        const now = Date.now();
        const lastFetched = lastFetchedRelatedExams[id] || 0;
        const isCacheValid = now - lastFetched < 300000;

        // Nếu có dữ liệu và cache còn hợp lệ, sử dụng dữ liệu cache
        if (hasData && isCacheValid) {
            // Cập nhật state.exams để hiển thị dữ liệu cache
            return { data: relatedExams[id] };
        }

        // Nếu không có dữ liệu hoặc cache hết hạn, gọi API
        return await dispatch(fetchRelatedExams(id)).unwrap();
    }
);

export const fetchExamById = createAsyncThunk(
    "exams/fetchExamById",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, examApi.getExamByIdAPI, id, () => { }, true, false);
    }
);

export const fetchPublicExamById = createAsyncThunk(
    "exams/fetchPublicExamById",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, examApi.getExamPublic, id, () => { }, false, false);
    }
);

export const putExam = createAsyncThunk(
    "exams/putExam",
    async ({ examId, examData }, { dispatch }) => {
        return await apiHandler(dispatch, examApi.putExamAPI, { examId, examData }, () => { }, true, false);
    }
);

export const putImageExam = createAsyncThunk(
    "exams/putImageExam",
    async ({ examId, examImage }, { dispatch }) => {
        return await apiHandler(dispatch, examApi.putImageExamAPI, { examId, examImage }, () => { }, true, false);
    }
);

export const postExam = createAsyncThunk(
    "exams/postExam",
    async ({ examData, examImage, questions, questionImages, statementImages }, { dispatch }) => {
        return await apiHandler(dispatch, examApi.postExamAPI, { examData, examImage, questions, questionImages, statementImages }, () => { }, true, false);
    }
);

export const uploadSolutionPdf = createAsyncThunk(
    "exams/uploadSolutionPdf",
    async ({ examId, pdfFile }, { dispatch }) => {
        return await apiHandler(dispatch, examApi.uploadSolutionPdfAPI, { examId, pdfFile }, () => { }, true, false, true);
    }
);

export const saveExamForUser = createAsyncThunk(
    "exams/saveExamForUser",
    async ({ examId }, { dispatch }) => {
        return await apiHandler(dispatch, examApi.saveExamForUserAPI, { examId }, () => { }, true, false);
    }
);

export const deleteExam = createAsyncThunk(
    "exams/deleteExam",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, examApi.deleteExamAPI, id, () => { }, true, false);
    }
);

const examSlice = createSlice({
    name: "exams",
    initialState: {
        exams: [],
        exam: null,
        relatedExams: {}, // Lưu trữ đề thi liên quan theo examId
        lastFetchedRelatedExams: {}, // Lưu thời gian gọi API cuối cùng theo examId
        loadingExam: false,
        loadingSubmit: false,
        isSubmit: false,
    },
    reducers: {
        setExam: (state, action) => {
            state.exam = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExams.pending, (state) => {
                state.exams = [];
            })
            .addCase(fetchExams.fulfilled, (state, action) => {
                if (action.payload) {
                    state.exams = action.payload.data;
                }
            })
            .addCase(fetchNewestExams.pending, (state) => {
                state.exams = [];
            })
            .addCase(fetchNewestExams.fulfilled, (state, action) => {
                if (action.payload) {
                    state.exams = action.payload.data;
                }
            })
            .addCase(fetchSavedExam.pending, (state) => {
                state.exams = [];
                state.loadingExam = true;
            })
            .addCase(fetchSavedExam.fulfilled, (state, action) => {
                if (action.payload) {
                    state.exams = action.payload.data;
                }
                state.loadingExam = false;
            })
            .addCase(fetchSavedExam.rejected, (state) => {
                state.loadingExam = false;
            })
            .addCase(fetchRelatedExams.pending, () => {
                // Không xóa state.exams nữa để tránh làm mất dữ liệu hiện tại
            })
            .addCase(fetchRelatedExams.fulfilled, (state, action) => {
                if (action.payload) {
                    const examId = action.meta.arg; // Lấy examId từ tham số gọi API
                    state.exams = action.payload.data;
                    state.relatedExams[examId] = action.payload.data;
                    state.lastFetchedRelatedExams[examId] = Date.now();
                }
            })
            .addCase(fetchExamById.pending, (state) => {
                state.exam = null;
            })
            .addCase(fetchExamById.fulfilled, (state, action) => {
                if (action.payload) {
                    state.exam = action.payload.data;
                }
            })
            .addCase(fetchPublicExams.pending, (state) => {
                state.exams = [];
            })
            .addCase(fetchPublicExams.fulfilled, (state, action) => {
                if (action.payload) {
                    state.exams = action.payload.data;
                }
            })
            .addCase(fetchPublicExamById.pending, (state) => {
                state.exam = null;
            })
            .addCase(fetchPublicExamById.fulfilled, (state, action) => {
                if (action.payload) {
                    state.exam = action.payload.data;
                }
            })
            .addCase(saveExamForUser.fulfilled, (state, action) => {
                if (action.payload) {
                    const { examId, isSave } = action.payload;

                    // Trường hợp 1: Khi exams chứa đối tượng có thuộc tính exam (từ API saved exams)
                    if (state.exams.length > 0 && state.exams[0]?.exam) {
                        if (isSave === false) {
                            // Nếu isSave = false, loại bỏ exam khỏi danh sách đã lưu
                            state.exams = state.exams.filter(exam => exam.exam?.id !== examId);
                        } else {
                            // Nếu isSave = true, cập nhật trạng thái
                            state.exams = state.exams.map(exam => {
                                if (exam.exam?.id === examId) {
                                    return { ...exam, isSave: true };
                                }
                                return exam;
                            });
                        }
                        return;
                    }

                    // Trường hợp 2: Khi exams chứa danh sách exam thông thường
                    if (state.exams && Array.isArray(state.exams)) {
                        state.exams = state.exams.map(exam => {
                            if (exam.id === examId) {
                                return { ...exam, isSave: isSave };
                            }
                            return exam;
                        });
                    }

                    // Cập nhật trạng thái cho exam hiện tại nếu có
                    if (state.exam) {
                        state.exam.isSave = isSave;
                    }
                }
            })
            .addCase(uploadSolutionPdf.fulfilled, (state, action) => {
                console.log(action.payload)
                const pdfUrl = action.payload
                if (state.exam) {
                    state.exam.solutionPdfUrl = pdfUrl;
                }
            })
            .addCase(fetchRelatedExamsIfNeeded.fulfilled, (state, action) => {
                if (action.payload && action.payload.data) {
                    state.exams = action.payload.data;
                }
            })
            .addCase(summitExam.pending, (state) => {
                state.loadingSubmit = true;
            })
            .addCase(summitExam.fulfilled, (state, action) => {
                state.loadingSubmit = false;
                state.isSubmit = true;
            })
            .addCase(summitExam.rejected, (state) => {
                state.loadingSubmit = false;
                state.isSubmit = false;
            })
    }
});

export const { setExam } = examSlice.actions;
export default examSlice.reducer;