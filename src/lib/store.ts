import { create } from "zustand";

export interface Task {
  _id: string;
  title: string;
  isDone: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (title: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/v1/tasks/getTasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      set({ tasks: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        loading: false,
      });
    }
  },

  createTask: async (title: string) => {
    try {
      const res = await fetch("/api/v1/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const newTask = await res.json();
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (err) {
      console.error(err);
      set({ error: "Failed to create task" });
    }
  },

  toggleTask: async (id: string) => {
    const task = useTaskStore.getState().tasks.find((t) => t._id === id);
    if (!task) return;

    try {
      const res = await fetch(`/api/v1/tasks/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDone: !task.isDone }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t._id === id ? { ...t, isDone: !t.isDone } : t
        ),
      }));
    } catch (err) {
      console.error(err);
      set({ error: "Failed to update task" });
    }
  },

  deleteTask: async (id: string) => {
    try {
      const res = await fetch(`/api/v1/tasks/remove/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
      }));
    } catch (err) {
      console.error(err);
      set({ error: "Failed to delete task" });
    }
  },
}));
