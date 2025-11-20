const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    profilePicture: {
        type: String,
        default: null
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        currentTime: () => new Date().toLocaleString("en-US", {timeZone: 'Asia/Tehran'})
    }
});

userSchema.pre("save", async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.log(`Something wrong with hashing: ${error}`);
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Refresh token methods
userSchema.methods.addRefreshToken = function(token, expiresAt, deviceInfo = '') {
    if (!this.refreshTokens) {
        this.refreshTokens = [];
    }

    // Remove expired tokens
    const now = new Date();
    this.refreshTokens = this.refreshTokens.filter(t => new Date(t.expiresAt) > now);

    // Keep only latest 5 tokens
    this.refreshTokens = this.refreshTokens
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

    // Add new token
    this.refreshTokens.unshift({
        token,
        expiresAt,
        createdAt: new Date(),
        device: deviceInfo
    });

    this.markModified('refreshTokens');
};

userSchema.methods.isValidRefreshToken = function(token) {
    if (!this.refreshTokens || !Array.isArray(this.refreshTokens)) {
        return false;
    }

    const refreshToken = this.refreshTokens.find(item => item.token === token);
    if (!refreshToken) return false;
    
    return new Date() < new Date(refreshToken.expiresAt);
};

userSchema.methods.removeRefreshToken = function(token) {
    if (!this.refreshTokens || !Array.isArray(this.refreshTokens)) {
        this.refreshTokens = [];
        return;
    }

    this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
    this.markModified('refreshTokens');
};

userSchema.methods.removeAllRefreshTokens = function() {
    this.refreshTokens = [];
    this.markModified('refreshTokens');
};

const User = mongoose.model('User', userSchema);
module.exports = User;