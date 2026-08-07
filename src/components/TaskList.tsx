import type { Task } from "../common/types";
import { Trash2, PencilLine } from 'lucide-react';
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from "@fluentui/react-components";
import { useToast } from "../context/ToastContext";
import { useTasks } from "../hooks/useTasks";

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
};

const TaskList = ({ onEdit }: Props) => {
    const { tasks, removeTask } = useTasks();
    const { notify } = useToast();

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
        // <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-5 grid-cols-1">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="rounded-2xl bg-white p-6 shadow-md"
                >
                    <div className="relative flex items-center justify-center">
                        <h2 className="text-xl text-center font-semibold text-slate-800 break-all mt-10">
                            {task.title}
                        </h2>
                        <PencilLine
                            className="text-yellow-500 hover:text-yellow-700 absolute top-0 right-20" onClick={() => handleEdit(task.id)} />

                        <Dialog>
                            <DialogTrigger disableButtonEnhancement>
                                <Trash2
                                    className="text-red-500 hover:text-red-700 absolute top-0 right-5" />
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

                        <span
                            className={`rounded-full absolute top-0 left-0 px-4 py-1 text-sm font-medium ${statusColor[task.status as keyof typeof statusColor]
                                }`}
                        >
                            {statusText[task.status as keyof typeof statusText]}
                        </span>
                    </div>
                    <p className="mt-3 text-slate-600 wrap-break-word">
                        {task.description}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default TaskList;