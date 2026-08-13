import { useState } from "react";
import TaskList from "../../components/TaskList";
import TaskForm from "../../components/TaskForm";
import type { Task } from "../../common/types";

const TasksPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    return (
        <div className="flex flex-col gap-6 px-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-800">Tasks</h1>
                <button
                    onClick={() => {
                        setEditingTask(null);
                        setIsModalOpen(true);
                    }}
                    className="rounded-4xl bg-white px-6 py-3 font-medium text-[#115EA3] shadow-md hover:bg-[#e5e6e7] hover:shadow-lg"
                >
                    + New Task
                </button>
            </div>

            <TaskList onEdit={(task) => { setEditingTask(task); setIsModalOpen(true); }} />

            <TaskForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                toEdit={!!editingTask}
                task={editingTask}
            />
        </div>
    );
};

export default TasksPage;