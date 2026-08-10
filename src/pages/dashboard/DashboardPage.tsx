import { useEffect, useState, } from 'react'
import { useTasks } from '../../hooks/useTasks';
import type { Task } from '../../common/types';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';
import { useToast } from '../../hooks/useToast';
import Header from '../../components/Header';

const DashboardPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Task | null>(null);
    const { fetchTasks } = useTasks();
    const { notify } = useToast();

    useEffect(() => {
        fetchTasks().then(data =>
            !data?.status && notify(data?.msg, "error"));

        return () => {
            console.log("Component unmounted");
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">
            <Header setIsModalOpen={setIsModalOpen} setEditingTodo={setEditingTodo} />
            <main className="mx-auto top-40 relative max-w-5xl p-6 px-8">
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