const applyRequestInterceptor = (axiosInstance) => {
    // Log trước khi request được gửi
    axiosInstance.interceptors.request.use(
        (config) => {
            console.log("📤 [Request]", {
                url: config.url,
                method: config.method,
                headers: config.headers,
                params: config.params,
                data: config.data,
            });
            return config;
        },
        (error) => {
            console.error("❌ [Request Error]", error);
            return Promise.reject(error);
        }
    );

    // Log khi response được trả về
    axiosInstance.interceptors.response.use(
        (response) => {
            console.log("📥 [Response]", {
                url: response.config.url,
                status: response.status,
                data: response.data,
            });
            return response;
        },
        (error) => {
            if (error.response) {
                console.error("❌ [Response Error]", {
                    url: error.response.config?.url,
                    status: error.response.status,
                    data: error.response.data,
                });
            } else if (error.request) {
                console.error("❌ [No Response Received]", error.request);
            } else {
                console.error("❌ [Other Error]", error.message);
            }

            return Promise.reject(error);
        }
    );
};

export default applyRequestInterceptor;
