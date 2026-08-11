import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import taskReducer from "./features/taskSlice";
import projectReducer from "./features/projectSlice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: taskReducer,
        projects: projectReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch =
    useDispatch.withTypes<AppDispatch>();

export const useAppSelector =
    useSelector.withTypes<RootState>();