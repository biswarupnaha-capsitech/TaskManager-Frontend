import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../common/types";

interface TasksState {
    tasks: Task[]
}

const initialState: TasksState = {
    tasks: [],
}

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTasks(state, action: PayloadAction<Task[]>) {
            const map = new Map(state.tasks.map(task => [task.id, task]))
            action.payload.forEach(task => map.set(task.id, task))
            state.tasks = Array.from(map.values())
        },
        addTaskLocal(state, action: PayloadAction<Task>) {
            state.tasks.push(action.payload)
        },
        updateTaskLocal(state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) {
            const { id, updates } = action.payload
            const task = state.tasks.find(t => t.id === id)
            if (task) Object.assign(task, updates)
        },
        removeTaskLocal(state, action: PayloadAction<string>) {
            state.tasks = state.tasks.filter(task => task.id !== action.payload)
        },
        resetTasks(state) {
            state.tasks = []
        }
    },
})

export const { setTasks, addTaskLocal, updateTaskLocal, removeTaskLocal, resetTasks } = tasksSlice.actions
export default tasksSlice.reducer