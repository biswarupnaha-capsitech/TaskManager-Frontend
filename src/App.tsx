import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import type { Task } from "./common/types";
import { useTasks } from "./context/TaskContext";
import { useToast } from "./context/ToastContext";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Task | null>(null);
  const { fetchTasks } = useTasks();
  const { notify } = useToast();

  useEffect(() => {
    fetchTasks().then(data => notify(data.msg, data.status ? "success" : "error"));

    return () => {
      console.log("Component unmounted");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-indigo-400 shadow-lg">
        <div className="mx-auto max-w-5xl px-6 py-8 flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            Task Manager
          </h1>

          <button
            onClick={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
            className="rounded-4xl bg-white px-3 py-2 md:px-6 md:py-3 font-medium text-indigo-600 shadow-md transition hover:shadow-lg hover:scale-105 text-xs md:text-lg"
          >
            + New Task
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6 px-8">
        <TaskList onEdit={(task) => {
          setEditingTodo(task);
          setIsModalOpen(true);
        }} />
      </main>

      {isModalOpen && (
        <TaskForm
          setIsModalOpen={setIsModalOpen}
          toEdit={!!editingTodo}
          task={editingTodo}
        />
      )}
    </div>
  );
}

export default App;