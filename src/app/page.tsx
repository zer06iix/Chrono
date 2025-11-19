"use client";

import { useState, useEffect } from "react";
import { useTaskStore, type Task } from "../lib/store";
import AddTaskModal from "../components/AddTaskModal";
import styles from "./page.module.css";
import DynamicButton from "../components/DynamicButton";

export default function Home() {
  const { tasks, loading, error, fetchTasks, createTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddTask = (title: string) => {
    createTask(title);
  };

  return (
    <>
      <main className={`container ${styles.main}`}>
        <div className={styles.container}>
          <div className={styles.controls}>
            <DynamicButton
              variant="primary"
              onClick={handleOpenModal}
              style={{ borderRadius: "var(--radius-lg)" }}
              disabled={loading}
            >
              + Add New Task
            </DynamicButton>
          </div>

          <div className={styles.taskList}>
            {loading ? (
              <div className={styles.emptyState}>
                <p>
                  Loading tasks... <span className={styles.spinner}></span>
                </p>
              </div>
            ) : error ? (
              <div className={styles.error}>Error: {error}</div>
            ) : tasks.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No tasks yet</p>
                <small>Create your first task to get started</small>
              </div>
            ) : (
              tasks.map((task: Task) => (
                <div key={task._id} className={styles.taskCard}>
                  <div className={styles.taskContent}>
                    <span
                      className={`${styles.taskTitle} ${
                        task.isDone ? styles.completed : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className={styles.taskActions}>
                      <button
                        onClick={() =>
                          useTaskStore.getState().toggleTask(task._id)
                        }
                        className={`${styles.button} ${styles.doneButton}`}
                        // ${task.isDone ? styles.completed : ""}
                      >
                        {task.isDone ? "Undo" : "Done"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this task?")) {
                            useTaskStore.getState().deleteTask(task._id);
                          }
                        }}
                        className={`${styles.button} ${styles.deleteButton}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className={styles.taskMeta}>
                    <span>
                      Created:{" "}
                      {new Date(task.created_at).toLocaleString(
                        "fa-IR-u-nu-latn"
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddTask}
      />
    </>
  );
}
