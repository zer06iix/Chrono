const mongoose = require('mongoose');


const taskTrackerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isDone: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        currentTime: () => new Date().toLocaleString("en-US", {timeZone: 'Asia/Tehran'})
    }
});


const TaskTracker = mongoose.model('TaskTracker', taskTrackerSchema);
module.exports = TaskTracker;