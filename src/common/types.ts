import type { ToastIntent } from "@fluentui/react-components"
import type { Status } from "./enums"


export interface Task {
    id: string
    title: string
    description: string
    status: Status
    isDeleted: boolean
}

export interface TaskContextType {
    tasks: Task[],
    fetchTasks: () => Promise<TaskResponseType>
    addTask: (values: Omit<Task, "id">) => Promise<TaskResponseType>
    editTask: (id: string, updates: Partial<Task>) => Promise<TaskResponseType>
    removeTask: (id: string) => Promise<TaskResponseType>
}

export type TaskResponseType = {
    msg: string
    status: boolean
}

export interface ToastContextType {
    notify: (msg: string, intent: ToastIntent) => void
}


export interface RegisterUserType {
    email: string,
    name: {
        first: string,
        last: string
    },
    phoneNumber: string,
    passwordHash: string
}

export interface LoginUserType {
    userName: string,
    password: string
}

export interface AuthContextType {
    token: string | null;
    login(token: string): void;
    logout(): void;
}

export interface Project {
    id: string
    title: string
    description: string
    isCompleted: boolean
    isDeleted: boolean
}

export interface ProjectWithTasks extends Project {
    Tasks: Task[]
}

export interface ProjectContextType {
    projects: ProjectWithTasks[],
    fetchProjects: () => Promise<ProjectResponseType>
    addProject: (values: Omit<Project, "id">) => Promise<ProjectResponseType>
    editProject: (id: string, updates: Partial<Project>) => Promise<ProjectResponseType>
    removeProject: (id: string) => Promise<ProjectResponseType>
}

export type ProjectResponseType = {
    msg: string
    status: boolean
}