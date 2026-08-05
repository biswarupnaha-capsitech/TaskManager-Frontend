import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"

import type { Task } from "../common/types"

interface TaskContextType {
    tasks: Task[],
    fetchTasks: (tasks: Task[]) => void
    addTask: (values: Omit<Task, "id">) => void
    updateTask: (id: string, updates: Partial<Task>) => void
    deleteTask: (id: string) => void
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

    function fetchTasks(tasks: Task[]) {
        setTasks(prev => {
            const map = new Map(prev.map(task => [task.id, task]));

            tasks.forEach(task => {
                map.set(task.id, task);
            });

            return Array.from(map.values());
        });
    }

    function addTask(values: Omit<Task, "id">) {
        const newTask: Task = {
            id: crypto.randomUUID(),
            ...values
        }

        setTasks(prev => [...prev, newTask])
    }

    function updateTask(id: string, updates: Partial<Task>) {
        setTasks(prev =>
            prev.map(task =>
                task.id === id
                    ? { ...task, ...updates }
                    : task
            )
        )
    }

    function deleteTask(id: string) {
        setTasks(prev => prev.filter(task => task.id !== id))
    }

    return (
        <TaskContext.Provider
            value={{
                tasks,
                fetchTasks,
                addTask,
                updateTask,
                deleteTask,
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