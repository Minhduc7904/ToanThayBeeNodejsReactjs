const applyResponseInterceptor = (axiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => {
            console.log('📥 Response:', {
                url: response.config.url,
                status: response.status,
                data: response.data,
                headers: response.headers
            });

            return response;
        },
        (error) => {
            console.error('🚨 Response Error:', error.response ? error.response.data : error);

            // Nếu lỗi 401, logout user
            if (error.response && error.response.status === 401) {
                console.warn('🔒 Unauthorized! Redirecting to login...');
                window.location.href = '/login';
            }

            return Promise.reject(error);
        }
    );
};

export default applyResponseInterceptor;
