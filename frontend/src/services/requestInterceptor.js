const applyRequestInterceptor = (axiosInstance) => {
    // Kiểm tra môi trường hiện tại
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Log trước khi request được gửi
    axiosInstance.interceptors.request.use(
        (config) => {
            // Kiểm tra xem có token trong localStorage không
            const token = localStorage.getItem('auth_token');

            // Nếu có token trong localStorage, thêm vào header Authorization
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Chỉ log trong môi trường development
            if (isDevelopment) {
                console.log("📤 [Request]", {
                    url: config.url,
                    method: config.method,
                    headers: config.headers,
                    params: config.params,
                    data: config.data,
                });
            }

            return config;
        },
        (error) => {
            // Chỉ log trong môi trường development
            if (isDevelopment) {
                console.error("❌ [Request Error]", error);
            }
            return Promise.reject(error);
        }
    );

    // Log khi response được trả về
    axiosInstance.interceptors.response.use(
        (response) => {
            // Chỉ log trong môi trường development
            if (isDevelopment) {
                console.log("📥 [Response]", {
                    url: response.config.url,
                    status: response.status,
                    data: response.data,
                });
            }
            return response;
        },
        (error) => {
            if (error.response) {
                // Chỉ log trong môi trường development
                if (isDevelopment) {
                    console.error("❌ [Response Error]", {
                        url: error.response.config?.url,
                        status: error.response.status,
                        data: error.response.data,
                    });
                }
            } else if (error.request) {
                // Chỉ log trong môi trường development
                if (isDevelopment) {
                    console.error("❌ [No Response Received]", error.request);
                }
            } else {
                // Chỉ log trong môi trường development
                if (isDevelopment) {
                    console.error("❌ [Other Error]", error.message);
                }
            }

            return Promise.reject(error);
        }
    );
};

export default applyRequestInterceptor;
