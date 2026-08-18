import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createTask, updateTask, deleteTask, getTasks } from "../api/services/taskService"
import type { Task } from "../common/types"
import { useAppDispatch, useAppSelector } from "../app/store"
import { addTaskLocal, removeTaskLocal, setTasks, updateTaskLocal } from "../app/features/taskSlice"

export function useTasks() {
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const { tasks } = useAppSelector(state => state.tasks)

    const query = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const data = await getTasks()
            const fetched: Task[] = data?.result?.results ?? []
            dispatch(setTasks(fetched))
            return { msg: data?.message, status: data?.status }
        },
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
    })

    const addMutation = useMutation({
        mutationFn: (values: Omit<Task, "id">) => createTask(values),
        onSuccess: data => {
            const newTask = data?.result
            if (newTask) dispatch(addTaskLocal(newTask))
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
    })

    const editMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
            updateTask(id, updates),
        onMutate: async ({ id, updates }) => {
            dispatch(updateTaskLocal({ id, updates }))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
    })

    const removeMutation = useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: (_data, id) => {
            dispatch(removeTaskLocal(id))
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
    })

    return {
        tasks,
        isLoading: query.isLoading,
        tasksQueryClient: queryClient,
        fetchTasks: async () => {
            const result = await query.refetch()
            return result.data
        },
        addTask: async (values: Omit<Task, "id">) => {
            const data = await addMutation.mutateAsync(values)
            return { msg: data?.message, status: data?.status }
        },
        editTask: async (id: string, updates: Partial<Task>) => {
            const data = await editMutation.mutateAsync({ id, updates })
            return { msg: data?.message, status: data?.status }
        },
        removeTask: async (id: string) => {
            const data = await removeMutation.mutateAsync(id)
            return { msg: data?.message, status: data?.status }
        },
    }
}