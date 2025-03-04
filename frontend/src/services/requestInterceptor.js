const applyRequestInterceptor = (axiosInstance) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            console.log('📤 Request:', {
                method: config.method,
                url: config.url,
                headers: config.headers,
                data: config.data,
                params: config.params
            });

            return config;
        },
        (error) => {
            console.error('🚨 Request Error:', error);
            return Promise.reject(error);
        }
    );
};

export default applyRequestInterceptor;
