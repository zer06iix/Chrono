const express = require("express");
const router = express.Router();

// --- Import routes ---
const taskRoutes = require('../routes/taskRoutes');
const authRoutes = require('../routes/authRoutes');


router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);


module.exports = router;
