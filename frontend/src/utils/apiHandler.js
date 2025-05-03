import { setErrorMessage, setLoading, setSuccessMessage } from '../features/state/stateApiSlice';

const requestTimestamps = [];
const REQUEST_LIMIT = 50;
const TIME_WINDOW = 10000; // 10 giây
const BLOCK_DURATION = 5 * 60 * 1000; // 5 phút
const BLOCK_KEY = "api_block_until"; // key lưu trong localStorage
const isDevelopment = process.env.NODE_ENV === 'development';

export const apiHandler = async (
    dispatch,
    apiFunc,
    params,
    successCallback,
    useSuccessMessage = true,
    setDelay = true,
    returnData = false,
    isSetLoading = true
) => {
    const now = Date.now();

    // 🔒 Lấy thời gian bị chặn từ localStorage
    const storedBlockUntil = localStorage.getItem(BLOCK_KEY);
    if (storedBlockUntil && now < parseInt(storedBlockUntil) && !isDevelopment) {
        const remaining = Math.ceil((parseInt(storedBlockUntil) - now) / 1000);
        const errorMsg = `Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ${remaining} giây.`;
        dispatch(setErrorMessage(errorMsg));
        return Promise.reject(errorMsg);
    }

    // Dọn các request cũ
    while (requestTimestamps.length && now - requestTimestamps[0] > TIME_WINDOW) {
        requestTimestamps.shift();
    }

    if (requestTimestamps.length >= REQUEST_LIMIT && !isDevelopment) {
        // 🚫 Ghi block vào localStorage
        const blockUntil = now + BLOCK_DURATION;
        localStorage.setItem(BLOCK_KEY, blockUntil.toString());

        const errorMsg = `Bạn đã gửi quá ${REQUEST_LIMIT} yêu cầu trong ${TIME_WINDOW / 1000}s. Đã bị chặn trong 5 phút.`;
        dispatch(setErrorMessage(errorMsg));
        return Promise.reject(errorMsg);
    }

    requestTimestamps.push(now);

    try {
        if (isSetLoading) dispatch(setLoading(true));

        if (setDelay) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const response = await apiFunc(params);

        if (response.data?.message && useSuccessMessage) {
            dispatch(setSuccessMessage(response.data.message));
        }
        if (response?.message && useSuccessMessage) {
            dispatch(setSuccessMessage(response.message));
        }

        if (successCallback) {
            successCallback(response.data);
        }

        return returnData ? response.data : (response.data || response);
    } catch (error) {
        const errorMsg = error.response ? error.response.data.message : error.message;
        console.error("API Error:", error);
        dispatch(setErrorMessage(errorMsg));
        return Promise.reject(errorMsg);
    } finally {
        dispatch(setLoading(false));
    }
};
