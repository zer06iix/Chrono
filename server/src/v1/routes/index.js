const express = require("express");
const router = express.Router();

// --- Import routes ---
const taskRoutes = require('../routes/taskRoutes');


router.use("/tasks", taskRoutes);


module.exports = router;
