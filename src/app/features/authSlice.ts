import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("tm-access"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            const token = action.payload;

            state.token = token;

            localStorage.setItem(
                "tm-access",
                token
            );
        },

        logout: (state) => {
            state.token = null;
            localStorage.removeItem(
                "tm-access"
            );
        },
    },
});

export const {
    login,
    logout,
} = authSlice.actions;

export default authSlice.reducer;