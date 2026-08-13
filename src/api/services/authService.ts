import { login, logout } from "../../app/features/authSlice";
import { store } from "../../app/store";
import type { LoginUserType, RegisterUserType } from "../../common/types";
import api from "../axios";

const logoutChannel = new BroadcastChannel("logout");
const loginChannel = new BroadcastChannel("login");
export const logoutAllTabsListener = () => {
    logoutChannel.onmessage = event => {
        store.dispatch(logout());
        logoutChannel.close();
        console.log(event.data)
    }
}
export const loginAllTabsListener = () => {
    loginChannel.onmessage = event => {
        store.dispatch(login(event.data));
        loginChannel.close();
        console.log("broadcast login success")
    }
}

export const authService = {

    async login(data: LoginUserType) {
        const res = await api.post("/Auth/Login", data);
        loginChannel.postMessage(res.data)
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
        logoutChannel.postMessage("broadcast logout success");
        return res.data;
    }
};