import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("tm-accessToken"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            const token = action.payload;

            state.token = token;

            localStorage.setItem(
                "tm-accessToken",
                token
            );
        },

        logout: (state) => {
            state.token = null;

            localStorage.removeItem(
                "tm-accessToken"
            );
        },
    },
});

export const {
    login,
    logout,
} = authSlice.actions;

export default authSlice.reducer;