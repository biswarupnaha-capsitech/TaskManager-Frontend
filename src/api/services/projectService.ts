import type { Project } from "../../common/types";
import api from "../axios";

const baseUrl = "/Project";

export const getProjects = async () => {
    const res = await api.get(`${baseUrl}/GetProjects`);
    return res.data;
}

export const createProject = async (task: Omit<Project, "id">) => {
    const res = await api.post(`${baseUrl}/CreateProject`, task);
    return res.data;
}

export const updateProject = async (id: string, updates: Partial<Project>) => {
    const res = await api.put(`${baseUrl}/UpdateProject/${id}`, updates);
    return res.data;
}

export const deleteProject = async (id: string) => {
    const res = await api.delete(`${baseUrl}/DeleteProject/${id}`);
    return res.data;
}