import type { Task } from "../common/types";
import { Trash2, PencilLine } from 'lucide-react';
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Spinner } from "@fluentui/react-components";
import { useToast } from "../hooks/useToast";
import { useTasks } from "../hooks/useTasks";
import { dateParser } from "@biswarup598/date-parser";

const statusColor = {
    0: "bg-amber-100 text-amber-700",
    1: "bg-blue-100 text-blue-700",
    2: "bg-green-100 text-green-700",
};

const statusText = {
    0: "Pending",
    1: "In Progress",
    2: "Completed",
};

type Props = {
    onEdit: (task: Task) => void;
    tasks?: Task[];
    isLoading?: boolean;
};

const TaskList = ({ onEdit, tasks: tasksProp, isLoading: isLoadingProp }: Props) => {
    const { tasks: allTasks, isLoading: hookLoading, removeTask } = useTasks();
    const tasks = tasksProp ?? allTasks;
    const isLoading = isLoadingProp ?? hookLoading;
    const { notify } = useToast();

    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <Spinner />
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="mt-16 rounded-2xl bg-white p-10 text-center shadow-md">
                <h2 className="text-xl font-semibold text-slate-700">
                    No tasks Yet
                </h2>
                <p className="mt-2 text-slate-500">
                    Click "New Task" to create your first task.
                </p>
            </div>
        );
    }

    function handleDelete(id: string) {
        removeTask(id).then(data => notify(data.msg, data.status ? "success" : "error"));
    }

    function handleEdit(id: string) {
        const task = tasks.find((t) => t.id === id);
        if (task) {
            onEdit(task);
        }
    }

    return (
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="flex flex-col rounded-2xl bg-white p-6 pt-12 shadow-md relative min-h-55"
                >
                    <span
                        className={`rounded-full absolute top-4 left-4 px-3 py-1 text-xs font-medium ${statusColor[task.status as keyof typeof statusColor]}`}
                    >
                        {statusText[task.status as keyof typeof statusText]}
                    </span>

                    <div className="absolute top-4 right-4 flex items-center gap-3">
                        <PencilLine
                            className="h-5 w-5 cursor-pointer text-yellow-500 hover:text-yellow-700"
                            onClick={() => handleEdit(task.id)}
                        />

                        <Dialog>
                            <DialogTrigger disableButtonEnhancement>
                                <Trash2 className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-700" />
                            </DialogTrigger>
                            <DialogSurface>
                                <DialogBody>
                                    <DialogTitle>Delete confirmation</DialogTitle>
                                    <DialogContent>
                                        Are you sure you want to delete this task?
                                    </DialogContent>
                                    <DialogActions>
                                        <Button appearance="primary" onClick={() => handleDelete(task.id)}>Confirm</Button>
                                        <DialogTrigger disableButtonEnhancement>
                                            <Button appearance="secondary">Cancel</Button>
                                        </DialogTrigger>
                                    </DialogActions>
                                </DialogBody>
                            </DialogSurface>
                        </Dialog>
                    </div>

                    <h2 className="text-center text-xl font-semibold text-slate-800 break-words mt-2">
                        {task.title}
                    </h2>

                    <p className="mt-3 flex-1 text-slate-600 break-words">
                        {task.description}
                    </p>

                    <span className="mt-4 self-end text-sm font-medium text-slate-400">
                        Due: {dateParser(task.dueDate)[0]}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default TaskList;