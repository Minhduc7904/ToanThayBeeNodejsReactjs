import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ClassApi from "../../services/classApi";
import { setCurrentPage, setTotalItems, setTotalPages } from "../filter/filterSlice";
import { apiHandler } from "../../utils/apiHandler";

export const fetchClasses = createAsyncThunk(
    "classes/fetchClasses",
    async ({ search, currentPage, limit, sortOrder }, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.getAllClassesAPI, { search, currentPage, limit, sortOrder }, (data) => {
            dispatch(setCurrentPage(data.currentPage));
            dispatch(setTotalPages(data.totalPages));
            dispatch(setTotalItems(data.totalItems));
        }, true, false);
    }
);

export const fetchClassesPublic = createAsyncThunk(
    "classes/fetchClassesPublic",
    async (_, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.getClassPublicAPI, null, () => { }, false, false);
    }
);

export const fetchClassById = createAsyncThunk(
    "classes/fetchClassById",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.getClassByIdAPI, id, () => { }, true, false);
    }
);

export const fetchClassesByUser = createAsyncThunk(
    "classes/fetchClassesByUser",
    async (_, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.getClassByUserAPI, null, (data) => {
            dispatch(setCurrentPage(1));
            dispatch(setTotalItems(data.totalItems));
        }, false, false);
    }
);

export const fetchLessonLearningItemInClass = createAsyncThunk(
    "classes/fetchLessonLearningItemInClass",
    async (classCode, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.getLessonLearningItemInClassAPI, classCode, () => { }, false, false);
    }
);

export const fetchClassesOverview = createAsyncThunk(
    "classes/fetchClassesOverview",
    async (_, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.getClassOverviewAPI, null, () => { }, false, false);
    }
);

export const joinClass = createAsyncThunk(
    "classes/joinClass",
    async (classCode, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.joinClassAPI, classCode, () => { }, true, false);
    }
);

export const getDataForLearning = createAsyncThunk(
    "classes/getDataForLearning",
    async (classCode, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.getDataForLearningAPI, classCode, () => { }, false, false);
    }
);

export const getFullLessonLearningItemByClassId = createAsyncThunk(
    "classes/getFullLessonLearningItemByClassId",
    async ({ classId }, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.getFullLessonLearningItemByClassIdAPI, { classId }, () => { }, true, false);
    }
);

export const putSlideImagesForClass = createAsyncThunk(
    "classes/putSlideImagesForClass",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.putSlideImagesForClassAPI, data, () => { }, true, false);
    }
);

export const postClass = createAsyncThunk(
    "classes/postClass",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.postClassAPI, data, () => { }, true, false);
    }
);

export const putClass = createAsyncThunk(
    "classes/putClass",
    async ({ data, id }, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.putClassAPI, { data, id }, () => { }, true, false);
    }
);

export const acceptStudentClass = createAsyncThunk(
    "classes/acceptStudentClass",
    async ({ classId, studentId }, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.acceptStudentClassAPI, { classId, studentId }, () => { }, true, false);
    }
);

export const uploadLearningItemPdf = createAsyncThunk(
    "classes/uploadLearningItemPdf",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.uploadLearningItemPdfAPI, data, () => { }, true, false);
    }
);

export const putLearningItem = createAsyncThunk(
    "classes/putLearningItem",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.putLearningItemAPI, data, () => { }, true, false);
    }
);

export const postLesson = createAsyncThunk(
    "classes/postLesson",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.postLessonAPI, data, () => { }, true, false);
    }
);

export const deleteLesson = createAsyncThunk(
    "classes/deleteLesson",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.deleteLessonAPI, data, () => { }, true, false);
    }
);

export const putLesson = createAsyncThunk(
    "classes/putLesson",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.putLessonAPI, data, () => { }, true, false);
    }
);

export const deleteLearningItem = createAsyncThunk(
    "classes/deleteLearningItem",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.deleteLearningItemAPI, data, () => { }, true, false);
    }
);

export const markLearningItem = createAsyncThunk(
    "classes/markLearningItem",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.markLearningItemAPI, data, () => { }, false, false);
    }
);

export const postLearningItem = createAsyncThunk(
    "classes/postLearningItem",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.postLearningItemAPI, data, () => { }, true, false);
    }
);

export const getUncompletedLearningItem = createAsyncThunk(
    "classes/getUncompletedClass",
    async (_, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.getUncompletedLearningItemAPI, null, () => { }, false, false);
    }
);

export const deleteClass = createAsyncThunk(
    "classes/deleteClass",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, ClassApi.deleteClassAPI, data, () => { }, true, false);
    }
);

const classSlice = createSlice({
    name: "classes",
    initialState: {
        classes: [],
        classDetail: null,
        learningItems: [],
        loadingClass: false,
        loadingLearningItem: false,
    },
    reducers: {
        setClass: (state, action) => {
            state.classDetail = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClasses.pending, (state) => {
                state.classes = [];
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.classes = action.payload.data;
            })
            .addCase(fetchClassById.pending, (state) => {
                state.classDetail = null;
            })
            .addCase(fetchClassById.fulfilled, (state, action) => {
                state.classDetail = action.payload.data;
            })
            .addCase(fetchClassesByUser.pending, (state) => {
                state.classes = [];
            })
            .addCase(fetchClassesByUser.fulfilled, (state, action) => {
                state.classes = action.payload.data;
            })
            .addCase(fetchClassesOverview.pending, (state) => {
                state.classes = [];
                state.loadingClass = true;
            })
            .addCase(fetchClassesOverview.fulfilled, (state, action) => {
                state.classes = action.payload.data;
                state.loadingClass = false;
            })
            .addCase(fetchClassesOverview.rejected, (state) => {
                state.loadingClass = false;
            })
            .addCase(fetchLessonLearningItemInClass.pending, (state) => {
                state.classDetail = null;
            })
            .addCase(fetchLessonLearningItemInClass.fulfilled, (state, action) => {
                state.classDetail = action.payload.data;
            })
            .addCase(joinClass.fulfilled, (state) => {
                if (state.classDetail) {
                    state.classDetail.userStatus = 'WS';
                }
            })
            .addCase(getDataForLearning.pending, (state) => {
                state.classDetail = null;
            })
            .addCase(getDataForLearning.fulfilled, (state, action) => {
                state.classDetail = action.payload.data;
            })
            .addCase(getFullLessonLearningItemByClassId.pending, (state) => {
                state.classDetail = null;
            })
            .addCase(getFullLessonLearningItemByClassId.fulfilled, (state, action) => {
                state.classDetail = action.payload.data;
            })
            .addCase(markLearningItem.fulfilled, (state, action) => {
                const { learningItemId, isDone, studyTime } = action.payload.data;

                for (const lesson of state.classDetail?.lessons || []) {
                    const learningItem = lesson.learningItems?.find(item => item.id === learningItemId);
                    if (learningItem) {
                        learningItem.studyStatuses[0].isDone = isDone;
                        learningItem.studyStatuses[0].studyTime = studyTime;
                        break;
                    }
                }
            })
            .addCase(getUncompletedLearningItem.pending, (state) => {
                state.learningItems = [];
                state.loadingLearningItem = true;
            })
            .addCase(getUncompletedLearningItem.fulfilled, (state, action) => {
                state.learningItems = action.payload.data;
                state.loadingLearningItem = false;
            })
            .addCase(getUncompletedLearningItem.rejected, (state) => {
                state.loadingLearningItem = false;
            })
            .addCase(fetchClassesPublic.pending, (state) => {
                state.classes = [];
            })
            .addCase(fetchClassesPublic.fulfilled, (state, action) => {
                state.classes = action.payload.data;
            })
    },
});

export const { setClass } = classSlice.actions;
export default classSlice.reducer;