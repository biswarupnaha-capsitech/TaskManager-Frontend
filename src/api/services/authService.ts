import type { LoginUserType, RegisterUserType } from "../../common/types";
import api from "../axios";

export const authService = {

    async login(data: LoginUserType) {
        const res = await api.post("/Auth/Login", data);
        return res.data;
    },

    async register(data: RegisterUserType) {
        const res = await api.post("/Auth/SaveUser", data);
        return res.data;
    },

    async refresh() {
        const res = await api.post("/Auth/Refresh");
        return res.data;
    },

    async logout() {
        const res = await api.post("/Auth/Logout");
        return res.data;
    }
};