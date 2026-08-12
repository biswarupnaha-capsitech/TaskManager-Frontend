import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../common/types";

interface AuthState {
    token: string | null;
    user: User | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("tm-access"),
    user: JSON.parse(localStorage.getItem("tm-user")!)
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<any>) => {
            const token = action.payload.token;
            const user = {
                id: action.payload.id,
                name: action.payload.name,
                email: action.payload.userName
            }
            state.token = token;
            state.user = user;

            localStorage.setItem(
                "tm-user",
                JSON.stringify(user)
            )
            localStorage.setItem(
                "tm-access",
                token
            );
        },

        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem(
                "tm-access"
            );
            localStorage.removeItem(
                "tm-user"
            );
        },
    },
});

export const {
    login,
    logout,
} = authSlice.actions;

export default authSlice.reducer;