import { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { Skeleton, SkeletonItem } from "@fluentui/react-components";
import {
    CheckmarkCircle20Regular,
    Clock20Regular,
    FolderOpen20Regular,
    TaskListSquareLtr20Regular,
} from "@fluentui/react-icons";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import { Status } from "../../common/enums";
import type { Task } from "../../common/types";

const STATUS_META = {
    [Status.Pending]: { label: "Pending", color: "#f59e0b" },
    [Status.InProgress]: { label: "In Progress", color: "#3b82f6" },
    [Status.Completed]: { label: "Completed", color: "#22c55e" },
};

function isProjectCompleted(project: any): boolean {
    if (typeof project.isCompleted === "boolean") return project.isCompleted;
    const tasks: Task[] | undefined = project.tasks;
    if (!tasks || tasks.length === 0) return false;
    return tasks.every((t) => t.status === Status.Completed);
}

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f1fb] text-[#115EA3]">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-2xl font-semibold text-slate-800">{value}</p>
                <p className="truncate text-sm text-slate-500">{label}</p>
            </div>
        </div>
    );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>
            <div className="h-72 w-full">{children}</div>
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-md">
            <Skeleton>
                <SkeletonItem style={{ height: "44px", width: "44px", borderRadius: "12px" }} />
            </Skeleton>
        </div>
    );
}

const DashboardPage = () => {
    const { tasks, isLoading: tasksLoading } = useTasks();
    const { projects, isLoading: projectsLoading } = useProjects();

    const isLoading = tasksLoading || projectsLoading;

    const statusCounts = useMemo(() => {
        const counts = { [Status.Pending]: 0, [Status.InProgress]: 0, [Status.Completed]: 0 };
        tasks.forEach((t) => {
            counts[t.status as Status] = (counts[t.status as Status] ?? 0) + 1;
        });
        return counts;
    }, [tasks]);

    const pieData = useMemo(
        () =>
            Object.entries(statusCounts).map(([status, count]) => ({
                name: STATUS_META[Number(status) as Status].label,
                value: count,
                color: STATUS_META[Number(status) as Status].color,
            })),
        [statusCounts]
    );

    const projectCompletion = useMemo(() => {
        let completed = 0;
        let inProgress = 0;
        projects.forEach((p) => {
            if (isProjectCompleted(p)) completed += 1;
            else inProgress += 1;
        });
        return { completed, inProgress };
    }, [projects]);

    const barData = [
        { name: "Completed", count: projectCompletion.completed, fill: "#22c55e" },
        { name: "In Progress", count: projectCompletion.inProgress, fill: "#3b82f6" },
    ];

    const totalTasks = tasks.length;
    const completedTasks = statusCounts[Status.Completed] ?? 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="flex flex-col gap-6 p-6 md:p-8">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
                <p className="mt-1 text-slate-500">Overview of your projects and tasks</p>
            </div>

            {/* Stat cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                ) : (
                    <>
                        <StatCard
                            icon={<FolderOpen20Regular />}
                            label="Total Projects"
                            value={projects.length}
                        />
                        <StatCard
                            icon={<TaskListSquareLtr20Regular />}
                            label="Total Tasks"
                            value={totalTasks}
                        />
                        <StatCard
                            icon={<CheckmarkCircle20Regular />}
                            label="Completed Tasks"
                            value={completedTasks}
                        />
                        <StatCard
                            icon={<Clock20Regular />}
                            label="Completion Rate"
                            value={`${completionRate}%`}
                        />
                    </>
                )}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard title="Task Status Breakdown">
                    {isLoading ? (
                        <Skeleton>
                            <SkeletonItem style={{ height: "100%", width: "100%", borderRadius: "12px" }} />
                        </Skeleton>
                    ) : totalTasks === 0 ? (
                        <div className="flex h-full items-center justify-center text-slate-400">
                            No tasks yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                <ChartCard title="Projects by Completion">
                    {isLoading ? (
                        <Skeleton>
                            <SkeletonItem style={{ height: "100%", width: "100%", borderRadius: "12px" }} />
                        </Skeleton>
                    ) : projects.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-slate-400">
                            No projects yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                <RechartsTooltip cursor={{ fill: "rgba(17,94,163,0.06)" }} />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={64} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>
            </div>
        </div>
    );
};

export default DashboardPage;