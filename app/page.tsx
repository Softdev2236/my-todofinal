"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import TaskForm from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";
import { Righteous } from "next/font/google";
import { getTasks, addTaskAction, deleteTaskAction, toggleTaskAction, editTaskAction } from "@/actions/tasks";
import KanbanBoard from "@/components/KanbanBoard";
import { updateStatusAction } from "@/actions/tasks";

const myFont = Righteous({ weight: "400", subsets: ["latin"] });

interface Task {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
  completed: boolean;
  status: string;
}

export default function Home() {

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(0);

  const moveTask = async (id: number, newStatus: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus, completed: newStatus === "done" } : t));
    await updateStatusAction(id, newStatus);
  };

  useEffect(() => {
    setNow(Date.now());
  }, []);

  useEffect(() => {
    async function Load() {
      const data = await getTasks();
      setTasks(data as Task[]);
      setLoading(false);
    }
    Load();
  }, []);

  const addTask = async (data: { title: string, priority: string, dueDate: string }) => {
    const tempTask: Task = {
      id: Date.now(),
      title: data.title,
      priority: data.priority,
      dueDate: data.dueDate,
      completed: false,
      status: "todo",
    };
    setTasks([tempTask, ...tasks]);

    const savedTask = await addTaskAction(data);
    setTasks((oldTasks) => {
      const withoutTemp = oldTasks.filter(t => t.id !== tempTask.id);
      return [savedTask as Task, ...withoutTemp];
    });
  };

  const deleteTask = async (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
    await deleteTaskAction(id);
  }

  const toggleComplete = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newCompleted = !task.completed;
    const newStatus = newCompleted ? "done" : "todo";
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: newCompleted, status: newStatus } : t));
    await toggleTaskAction(id, newCompleted);
  };

  const editTask = async (id: number, data: { title: string, priority: string, dueDate: string }) => {
    await editTaskAction(id, data);
    setTasks(tasks.map(t => t.id === id ? { ...t, title: data.title, priority: data.priority, dueDate: data.dueDate } : t));
  }

  const clearCompleted = async () => {
    const doneTasks = tasks.filter(t => t.completed);
    for (const t of doneTasks) {
      await deleteTaskAction(t.id);
    }
    setTasks(tasks.filter(t => !t.completed));
  };

  const filteredTasks = tasks.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "done" && !t.completed) return false;
    if (filter === "pending" && t.completed) return false;
    if (filter === "overdue" && (t.completed || new Date(t.dueDate).getTime() >= now)) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === "oldest") return a.id - b.id;
    if (sort === "priority") {
      const order: any = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (sort === "dueDate") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    return b.id - a.id;
  });
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const pending = total - done;
  const overdue = tasks.filter(t => !t.completed && new Date(t.dueDate).getTime() < now).length;

  return (
    <main suppressHydrationWarning className="min-h-screen bg-[#0a0a0a] flex flex-col items-center pt-6 sm:pt-10 px-3 sm:px-4 pb-10">
      <Header />
      <TaskForm onAdd={addTask} />

      <div className="w-full max-w-xl px-1 sm:px-4 mt-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className={`w-full bg-white/10 border border-white/20 px-5 py-2 rounded-full text-white placeholder:text-white/40 outline-none ${myFont.className}`} />
      </div>

      {/* ✅ MOBILE: flex-wrap + justify-center, DESKTOP: ek line me */}
      <div className={`flex flex-wrap justify-center items-center gap-2 mt-4 w-full max-w-xl px-1 sm:px-4 ${myFont.className}`}>
        <button onClick={() => setFilter("all")} className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm ${filter === "all" ? "bg-white text-black" : "bg-white/10 text-white"}`}>All <span className="font-bold">({total})</span></button>
        <button onClick={() => setFilter("pending")} className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm ${filter === "pending" ? "bg-white text-black" : "bg-white/10 text-white"}`}>Pending ({pending})</button>
        <button onClick={() => setFilter("done")} className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm ${filter === "done" ? "bg-white text-black" : "bg-white/10 text-white"}`}>Done ({done})</button>
        <button onClick={() => setFilter("overdue")} className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm ${filter === "overdue" ? "bg-white text-black" : "bg-white/10 text-white"}`}>Overdue ({overdue})</button>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-white text-xs sm:text-sm outline-none w-full sm:w-auto mt-1 sm:mt-0 sm:ml-2">
          <option value="newest" className="text-black">Newest</option>
          <option value="oldest" className="text-black">Oldest</option>
          <option value="priority" className="text-black">Priority</option>
          <option value="dueDate" className="text-black">Due Date</option>
        </select>
      </div>

      <div className="mt-4 w-full max-w-xl px-1 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-4">
          <h3 className={`text-white text-xl sm:text-2xl ${myFont.className}`}>List of added Tasks</h3>
          {done > 0 &&
            <button onClick={clearCompleted} className={`bg-green-400/20 border border-red-500/30 text-red-300 px-4 py-1 rounded-full text-xs sm:text-sm w-fit ${myFont.className}`}>
              clear completed ({done})
            </button>}
        </div>
        {loading ? (
          <div className="flex flex-col gap-3">
            <div className="h- bg-white/5 rounded-2xl animate-pulse"></div>
            <div className="h- bg-white/5 rounded-2xl animate-pulse"></div>
            <div className="h- bg-white/5 rounded-2xl animate-pulse"></div>
            <p className={`text-center text-white/40 py-2 ${myFont.className}`}>
              Loading Tasks from Neon...
            </p>
          </div>
        ) : sortedTasks.length === 0 ? (
          <p className={`text-center text-white/40 py-8 ${myFont.className}`}>
            {tasks.length === 0 ? "No tasks yet! Add your first task above 👆" : "No tasks match your search / filter!"}
          </p>
        ) : (
          sortedTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} priority={t.priority} completed={t.completed} dueDate={t.dueDate}
              onToggle={() => toggleComplete(t.id)} onDelete={() => deleteTask(t.id)} onEdit={(data) => editTask(t.id, data)} />
          ))
        )}
      </div>
      <div className="mt-8 w-full max-w-4xl px-1 sm:px-4">
        <KanbanBoard tasks={tasks} onMove={moveTask} />
      </div>
    </main>
  );
}