import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"

import type { Task } from "../common/types"
import { createTask, updateTask, deleteTask, getTasks } from "../api/taskService"

interface TaskContextType {
    tasks: Task[],
    fetchTasks: () => Promise<string>
    addTask: (values: Omit<Task, "id">) => Promise<string>
    editTask: (id: string, updates: Partial<Task>) => Promise<string>
    removeTask: (id: string) => Promise<string>
}

const TaskContext = createContext<TaskContextType | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const stored = localStorage.getItem("tasks")

        if (!stored) return []

        return JSON.parse(stored)
    })

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }, [tasks])




    //#region CRUD operations
    async function fetchTasks() {
        const data = await getTasks();
        const tasks: Task[] = data?.result;
        setTasks(prev => {
            const map = new Map(prev.map(task => [task.id, task]));

            tasks.forEach(task => {
                map.set(task.id, task);
            });

            return Array.from(map.values());
        });
        return data?.message;
    }

    async function addTask(values: Omit<Task, "id">): Promise<string> {
        const data = await createTask(values);
        const newTask = data?.result;
        setTasks(prev => [...prev, newTask])
        return data?.message;
    }

    async function editTask(id: string, updates: Partial<Task>): Promise<string> {
        const data = await updateTask(id, updates)
        setTasks(prev =>
            prev.map(task =>
                task.id === id
                    ? { ...task, ...updates }
                    : task
            )
        );
        return data?.message;
    }

    async function removeTask(id: string): Promise<string> {
        const data = await deleteTask(id);
        setTasks(prev => prev.filter(task => task.id !== id));
        return data?.message;
    }
    //#endregion



    return (
        <TaskContext.Provider
            value={{
                tasks,
                fetchTasks,
                addTask,
                editTask,
                removeTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export function useTasks() {
    const context = useContext(TaskContext)

    if (!context) {
        throw new Error("useTasks must be used inside TaskProvider")
    }

    return context
}