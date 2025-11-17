const TaskTracker = require("../models/TaskTracker");


exports.getTasks = async (req, res) => {
    try {
        const tasks = await TaskTracker.find({}).sort({ created_at: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addTask = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });

        const newTask = new TaskTracker({ title });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { isDone } = req.body;

        const task = await TaskTracker.findByIdAndUpdate(
        id,
        { isDone },
        { new: true }
        );

        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteTasks = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await TaskTracker.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}