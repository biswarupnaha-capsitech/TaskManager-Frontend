import { useEffect, useState, } from 'react'
import { useTasks } from '../context/TaskContext';
import type { Task } from '../common/types';
import { useToast } from '../context/ToastContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthProvider';

const DashboardPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Task | null>(null);
    const { fetchTasks } = useTasks();
    const { logout } = useAuth();
    const { notify } = useToast();

    useEffect(() => {
        fetchTasks().then(data => notify(data.msg, data.status ? "success" : "error"));

        return () => {
            console.log("Component unmounted");
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-[#115EA3] shadow-lg">
                <div className="mx-auto max-w-5xl px-6 py-8 flex justify-between items-center">
                    <h1 className="text-2xl md:text-4xl font-bold text-white">
                        Task Manager
                    </h1>
                    <div className='flex md:gap-x-12 gap-x-5'>
                        <button
                            onClick={() => {
                                setEditingTodo(null);
                                setIsModalOpen(true);
                            }}
                            className="rounded-4xl bg-white px-3 py-2 md:px-6 md:py-3 font-medium text-[#115EA3] shadow-md transition hover:shadow-lg hover:bg-[#e5e6e7]  text-xs md:text-lg hover:cursor-pointer"
                        >
                            + New Task
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                notify("Logged out successfully", "success");
                            }}
                            className="rounded-4xl bg-red-400 px-3 py-2 md:px-7 md:py-4 font-medium text-white shadow-md transition hover:shadow-lg hover:bg-[#e7e5e5] hover:text-red-400 text-xs md:text-lg hover:cursor-pointer"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl p-6 px-8">
                <TaskList onEdit={(task) => {
                    setEditingTodo(task);
                    setIsModalOpen(true);
                }} />
            </main>

            {
                isModalOpen && (
                    <TaskForm
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        toEdit={!!editingTodo}
                        task={editingTodo}
                    />
                )
            }
        </div>
    )
}

export default DashboardPage