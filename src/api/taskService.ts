import type { Task } from "../common/types";
import api from "./axios";

const baseUrl = "/Task";

export const getTasks = async () => {
    const res = await api.get(`${baseUrl}/GetTasks`);
    return res.data;
}

export const createTask = async (task: Omit<Task, "id">) => {
    const res = await api.post(`${baseUrl}/CreateTask`, task);
    return res.data;
}

export const updateTask = async (id: string, updates: Partial<Task>) => {
    const res = await api.put(`${baseUrl}/UpdateTask/${id}`, updates);
    return res.data;
}

// export const d