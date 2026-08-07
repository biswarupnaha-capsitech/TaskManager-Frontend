import axios from "axios";
import { authService } from "./authService";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
    // timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("tm-accessToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    config.withCredentials = true;
    return config;
}, error => Promise.reject(error));



api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const data = await authService.refresh();
                if (!data.status) {
                    localStorage.removeItem("tm-access");
                    window.location.href = "/login";
                    return Promise.reject(new Error(data.message));
                }

                const token = data.result.token;
                localStorage.setItem("tm-access", token);
                originalRequest.headers.Authorization = `Bearer ${token}`;

                return api(originalRequest);
            } catch (refreshError) {
                // Refresh endpoint failed
                localStorage.removeItem("tm-accessToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;