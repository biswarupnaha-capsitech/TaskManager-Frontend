import axios from "axios";
import { authService } from "./services/authService";
import { store } from "../app/store";
import { login, logout } from "../app/features/authSlice";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("tm-access");
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
                if (!data?.status) {
                    store.dispatch(logout());
                    window.location.href = "/login";
                    return Promise.reject(new Error(data?.message));
                }
                store.dispatch(login(data?.result));
                originalRequest.headers.Authorization = `Bearer ${data?.result?.token}`;

                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;