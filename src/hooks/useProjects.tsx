import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject, updateProject, deleteProject } from "../api/services/projectService"
import type { Project, ProjectWithTasks } from "../common/types"
import { useAppDispatch, useAppSelector } from "../app/store"
import { addProjectLocal, removeProjectLocal, setProjects, updateProjectLocal } from "../app/features/projectSlice"
import { getProjects } from "../api/services/projectService"
import { useTasks } from "./useTasks"

export function useProjects() {
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const { projects } = useAppSelector(state => state.projects)
    const { fetchTasks } = useTasks();
    const query = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const data = await getProjects();
            const fetched: ProjectWithTasks[] = data?.result?.results ?? []
            dispatch(setProjects(fetched))

            return { msg: data?.message, status: data?.status }
        },
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
    })

    const addMutation = useMutation({
        mutationFn: (values: Omit<Project, "id">) => createProject(values),
        onSuccess: data => {
            const newProject = data?.result
            if (newProject) dispatch(addProjectLocal(newProject))
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
    })

    const editMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) =>
            updateProject(id, updates),
        onMutate: async ({ id, updates }) => {
            dispatch(updateProjectLocal({ id, updates }))
            if (updates.isCompleted) fetchTasks();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
    })

    const removeMutation = useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: (_data, id) => {
            dispatch(removeProjectLocal(id))
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
    })

    return {
        projects,
        isLoading: query.isLoading,
        projectsQueryClient: queryClient,
        fetchProjects: async () => {
            const result = await query.refetch()
            return result.data
        },
        addProject: async (values: Omit<Project, "id">) => {
            const data = await addMutation.mutateAsync(values)
            return { msg: data?.message, status: data?.status }
        },
        editProject: async (id: string, updates: Partial<Project>) => {
            const data = await editMutation.mutateAsync({ id, updates })
            return { msg: data?.message, status: data?.status }
        },
        removeProject: async (id: string) => {
            const data = await removeMutation.mutateAsync(id)
            return { msg: data?.message, status: data?.status }
        },
    }
}