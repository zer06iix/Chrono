// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isBlacklisted } = require('../utils/tokenBlacklist');

const auth = async (req, res, next) => {
    try {
        // Get token from cookie or header
        let token = req.cookies?.accessToken || 
            req.header('Authorization')?.replace('Bearer ', '');
    
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Check if token is blacklisted
        const blacklisted = await isBlacklisted(token);
        if (blacklisted) {
            return res.status(401).json({
                success: false,
                message: 'Token has been invalidated. Please login again.'
            });
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
    
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token - user not found'
            });
        }
    
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

// Role-based middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

module.exports = { auth, requireRole };