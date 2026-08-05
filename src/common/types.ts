import type { ToastIntent } from "@fluentui/react-components"
import type { Status } from "./enums"

export interface Values {
    title: string
    description: string
    status: Status
    isDeleted: boolean
}

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