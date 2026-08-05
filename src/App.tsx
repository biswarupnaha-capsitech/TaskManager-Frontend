import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import type { Task } from "./common/types";
import { getTasks } from "./api/taskService";
import { useTasks } from "./context/TaskContext";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Task | null>(null);
  const { tasks, fetchTasks } = useTasks();

  useEffect(() => {
    getTasks().then(data => {
      console.log(data)
      fetchTasks(data?.result);
    });

    return () => {
      console.log("Component unmounted");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-indigo-400 shadow-lg">
        <div className="mx-auto max-w-5xl px-6 py-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">
            Task Manager
          </h1>

          <button
            onClick={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
            className="rounded-full bg-white px-6 py-3 font-medium text-indigo-600 shadow-md transition hover:shadow-lg hover:scale-105"
          >
            + New Task
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
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