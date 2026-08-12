import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import TaskList from "../../components/TaskList";
import TaskForm from "../../components/TaskForm";
import { Status } from "../../common/enums";
import type { Task } from "../../common/types";

const DUE_SENTINEL = "0001-01-01T00:00:00";

const ProjectPage = () => {
    const { id } = useParams<{ id: string }>();
    const { tasks, isLoading: tasksLoading } = useTasks();
    const { projects, isLoading: projectsLoading } = useProjects();

    const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);

    const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
    const [dueFrom, setDueFrom] = useState("");
    const [dueTo, setDueTo] = useState("");
    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    console.log("URL id:", id);
    console.log("Tasks:", tasks);
    console.log(
        "Task project IDs:",
        tasks.map((t) => ({
            taskId: t.id,
            projectId: t.projectId,
        }))
    );
    const projectTasks = useMemo(() => {
        if (!id) return [];
        return tasks.filter((t) => t.projectId === id.trim());
    }, [tasks, id]);

    const filteredTasks = useMemo(() => {
        return projectTasks.filter((task) => {
            if (statusFilter !== "all" && task.status !== statusFilter) return false;

            if (dueFrom || dueTo) {
                const hasDate = task.dueDate && task.dueDate !== DUE_SENTINEL;
                if (!hasDate) return false;

                const due = new Date(task.dueDate);

                if (dueFrom) {
                    const from = new Date(dueFrom);
                    from.setHours(0, 0, 0, 0);
                    if (due < from) return false;
                }

                if (dueTo) {
                    const to = new Date(dueTo);
                    to.setHours(23, 59, 59, 999);
                    if (due > to) return false;
                }
            }

            if (search.trim()) {
                const q = search.trim().toLowerCase();
                const matches =
                    task.title.toLowerCase().includes(q) ||
                    task.description?.toLowerCase().includes(q);
                if (!matches) return false;
            }

            return true;
        });
    }, [projectTasks, statusFilter, dueFrom, dueTo, search]);

    const hasActiveFilters = statusFilter !== "all" || dueFrom || dueTo || !!search;

    function clearFilters() {
        setStatusFilter("all");
        setDueFrom("");
        setDueTo("");
        setSearch("");
    }

    if (projectsLoading) {
        return <div className="p-6 text-slate-500">Loading project...</div>;
    }

    if (!project) {
        return (
            <div className="mt-16 rounded-2xl bg-white p-10 text-center shadow-md">
                <h2 className="text-xl font-semibold text-slate-700">Project not found</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 px-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-800">{project.title}</h1>
                <button
                    onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                    className="rounded-4xl bg-white px-6 py-3 font-medium text-[#115EA3] shadow-md hover:bg-[#e5e6e7] hover:shadow-lg"
                >
                    + New Task
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-md">
                <div className="flex min-w-50 flex-1 flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">Search</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value === "all" ? "all" : (Number(e.target.value) as Status))
                        }
                        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                    >
                        <option value="all">All statuses</option>
                        <option value={Status.Pending}>Pending</option>
                        <option value={Status.InProgress}>In Progress</option>
                        <option value={Status.Completed}>Completed</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">Due from</label>
                    <input
                        type="date"
                        value={dueFrom}
                        onChange={(e) => setDueFrom(e.target.value)}
                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">Due to</label>
                    <input
                        type="date"
                        value={dueTo}
                        onChange={(e) => setDueTo(e.target.value)}
                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                    />
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="pb-2 text-sm font-medium text-[#115EA3] hover:underline"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            <TaskList
                tasks={filteredTasks}
                isLoading={tasksLoading}
                onEdit={(task) => { setEditingTask(task); setIsModalOpen(true); }}
            />

            <TaskForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                toEdit={!!editingTask}
                task={editingTask ?? ({ projectId: id } as Task)}
            />
        </div>
    );
};

export default ProjectPage;