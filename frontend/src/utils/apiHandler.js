import { setErrorMessage, setLoading, setSuccessMessage } from '../features/state/stateApiSlice'

export const apiHandler = async (dispatch, apiFunc, params, successCallback, useSuccessMessage = true, setDelay = true) => {
    try {
        dispatch(setLoading(true)); // Bật trạng thái loading

        // Delay 500ms trước khi thực hiện API
        if (setDelay) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        // Gọi API với tham số truyền vào
        const response = await apiFunc(params);
        // Lưu message thành công nếu có

        if (response.data?.message && useSuccessMessage) {
            dispatch(setSuccessMessage(response.data.message));
        }
        if (response?.message && useSuccessMessage) {
            dispatch(setSuccessMessage(response.message));
        }

        if (successCallback) {
            successCallback(response.data);
        }
        return response.data ? response.data : response;
    } catch (error) {
        const errorMsg = error.response ? error.response.data.message : error.message;
        dispatch(setErrorMessage(errorMsg)); // Lưu lỗi vào stateApiSlice
    } finally {
        dispatch(setLoading(false)); // Tắt trạng thái loading
    }
};
