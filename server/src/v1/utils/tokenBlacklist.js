// utils/tokenBlacklist.js
const BlacklistedToken = require('../models/BlacklistedToken');
const jwt = require('jsonwebtoken');

const isBlacklisted = async (token) => {
    try {
        const blacklistedToken = await BlacklistedToken.findOne({ token });
        return !!blacklistedToken;
    } catch (error) {
        console.error('Error checking token blacklist:', error);
        return false;
    }
};

const addToBlacklist = async (token, userId, reason = 'logout') => {
    try {
        // Check if token is already blacklisted
        const existing = await BlacklistedToken.findOne({ token });
        if (existing) {
            return existing;
        }

        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);
        
        const blacklistedToken = await BlacklistedToken.create({
            token,
            userId,
            expiresAt,
            reason
        });
        
        return blacklistedToken;
    } catch (error) {
        if (error.code === 11000) {
            return await BlacklistedToken.findOne({ token });
        }
        console.error('Error adding token to blacklist:', error);
        throw error;
    }
};

module.exports = { isBlacklisted, addToBlacklist };