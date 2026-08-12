import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project, ProjectWithTasks } from "../../common/types";

interface ProjectsState {
    projects: ProjectWithTasks[]
}

const initialState: ProjectsState = {
    projects: [],
}

const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjects(state, action: PayloadAction<ProjectWithTasks[]>) {
            const map = new Map(state.projects.map(project => [project.id, project]))
            action.payload.forEach(project => map.set(project.id, project))
            state.projects = Array.from(map.values())
        },
        addProjectLocal(state, action: PayloadAction<ProjectWithTasks>) {
            state.projects.push(action.payload)
        },
        updateProjectLocal(state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) {
            const { id, updates } = action.payload
            const project = state.projects.find(t => t.id === id)
            if (project) Object.assign(project, updates)
        },
        removeProjectLocal(state, action: PayloadAction<string>) {
            state.projects = state.projects.filter(project => project.id !== action.payload)
        },
        resetProjects(state) {
            state.projects = []
        }
    },
})

export const { setProjects, addProjectLocal, updateProjectLocal, removeProjectLocal, resetProjects } = projectsSlice.actions
export default projectsSlice.reducer