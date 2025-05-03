const applyResponseInterceptor = (axiosInstance) => {
    // Kiểm tra môi trường hiện tại
    // const isDevelopment = process.env.NODE_ENV === 'development';
    const isDevelopment = true;

    axiosInstance.interceptors.response.use(
        (response) => {
            // Chỉ log trong môi trường development
            if (isDevelopment) {
                console.log("📥 [Response Success]", {
                    url: response.config?.url,
                    method: response.config?.method,
                    status: response.status,
                    data: response.data,
                });
            }
            return response;
        },
        (error) => {
            if (error.response) {
                const { status, data, config } = error.response;

                // Chỉ log trong môi trường development
                if (isDevelopment) {
                    console.error("❌ [Response Error]", {
                        url: config?.url,
                        method: config?.method,
                        status,
                        data,
                    });
                }

                if (status === 401) {
                    const currentPath = window.location.pathname + window.location.search;

                    // Chỉ log trong môi trường development
                    if (isDevelopment) {
                        console.log("currentPath", currentPath);
                    }

                    // Chỉ lưu nếu không phải login hoặc đã không có redirect path
                    if (currentPath !== "/login") {
                        localStorage.setItem("redirect_after_login", currentPath);
                    }

                    // Tránh redirect lặp lại nếu đã ở login
                    if (currentPath === "/" || currentPath === "/login") return;

                    // Chỉ log trong môi trường development
                    if (isDevelopment) {
                        console.warn("🔒 Unauthorized! Redirecting to login...");
                    }
                    window.location.href = "/login";
                }
            } else if (error.request) {
                // Chỉ log trong môi trường development
                if (isDevelopment) {
                    console.error("❌ [No Response Received]", {
                        request: error.request,
                    });
                }
            } else {
                // Chỉ log trong môi trường development
                if (isDevelopment) {
                    console.error("❌ [Unexpected Error]", {
                        message: error.message,
                    });
                }
            }

            return Promise.reject(error);
        }
    );
};

export default applyResponseInterceptor;
