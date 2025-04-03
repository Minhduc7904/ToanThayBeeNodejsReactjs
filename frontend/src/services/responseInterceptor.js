const applyResponseInterceptor = (axiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => {
            console.log("📥 [Response Success]", {
                url: response.config?.url,
                method: response.config?.method,
                status: response.status,
                data: response.data,
            });
            return response;
        },
        (error) => {
            if (error.response) {
                const { status, data, config } = error.response;
                console.error("❌ [Response Error]", {
                    url: config?.url,
                    method: config?.method,
                    status,
                    data,
                });

                if (status === 401) {
                    const currentPath = window.location.pathname;
                    if (currentPath !== "/") {
                        console.warn("🔒 Unauthorized! Redirecting to login...");
                        window.location.href = "/login";
                    }
                }
            } else if (error.request) {
                console.error("❌ [No Response Received]", {
                    request: error.request,
                });
            } else {
                console.error("❌ [Unexpected Error]", {
                    message: error.message,
                });
            }

            return Promise.reject(error);
        }
    );
};

export default applyResponseInterceptor;
