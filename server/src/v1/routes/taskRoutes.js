const express = require('express');
const router = express.Router();
const {
    getTasks,
    addTask,
    updateTask,
    deleteTasks
} = require('../controllers/taskController')


// GET all tasks
router.get("/getTasks", getTasks);

// POST new task
router.post("/add", addTask);

// PUT update task
router.put("/update/:id", updateTask);

// DELETE task
router.delete("/remove/:id", deleteTasks);

router.post("/test", async (req, res) => {
    try {
        const testTask = new TaskTracker({ title: "Test Task" });
        await testTask.save();
        res.json({ message: "Database and collection created!", task: testTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;