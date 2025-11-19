"use client";

import styles from "./AddTaskModal.module.css";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  easeIn,
  easeOut,
  cubicBezier,
} from "framer-motion";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    onSubmit(title.trim());
    onClose();
  };

  // Animation variants for subtle enter/exit
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.15, ease: easeOut },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: easeIn },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: cubicBezier(0.25, 0.1, 0.25, 1),
        delay: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.15,
        ease: easeIn,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose} // Close on overlay click
        >
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent close on modal click
          >
            <h2 className={styles.title}>Add New Task</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label htmlFor="title" className={styles.label}>
                  Task Title
                </label>
                <input
                  id="title"
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                  placeholder="Enter task title..."
                  maxLength={100}
                />
                {error && <p className={styles.error}>{error}</p>}
              </div>
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={onClose}
                  className={`${styles.button} ${styles.cancelButton}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.submitButton}`}
                  disabled={!title.trim()}
                >
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
