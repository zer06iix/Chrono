const mongoose = require('mongoose');


const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: process.env.JWT_REFRESH_EXPIRE }
    },
    reason: {
        type: String,
        enum: ["logout", "security", 'other'],
        default: "logout"
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        currentTime: () => new Date().toLocaleString("en-US", {timeZone: 'Asia/Tehran'})
    }
});


const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
module.exports = BlacklistedToken;