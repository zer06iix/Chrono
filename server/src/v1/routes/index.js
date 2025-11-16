const express = require('express');
const router = express.Router();
const TaskTracker = require('../models/TaskTracker');


router.get('/', (req, res) => {
    res.json('Home');
})

router.post('/test', async (req, res) => {
    try {
        const testTask = new TaskTracker({
            title: 'Test Task'
        });
        
        await testTask.save();
        res.json({ 
            message: 'Database and collection created!',
            task: testTask 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


module.exports = router;