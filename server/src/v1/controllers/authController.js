// controllers/v1/authController.js
const User = require('../models/User');
const { addToBlacklist } = require('../utils/tokenBlacklist'); '../'
const { 
    generateToken, 
    generateRefreshToken, 
    verifyRefreshToken,
    getTokenExpiry,
    getRefreshTokenExpiry 
} = require('../utils/jwt');

// Register
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({ username, email, password });
        
        // Generate tokens
        const accessToken = generateToken({ id: user._id });
        const refreshToken = generateRefreshToken({ id: user._id });
        
        // Save refresh token to user
        const refreshTokenExpiry = getRefreshTokenExpiry(refreshToken);
        user.addRefreshToken(refreshToken, refreshTokenExpiry, req.headers['user-agent']);
        await user.save();

        // Set tokens as HTTP Only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate tokens
        const accessToken = generateToken({ id: user._id });
        const refreshToken = generateRefreshToken({ id: user._id });
        
        // Save refresh token to user
        const refreshTokenExpiry = getRefreshTokenExpiry(refreshToken);
        user.addRefreshToken(refreshToken, refreshTokenExpiry, req.headers['user-agent']);
        await user.save();

        // Set tokens as HTTP Only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Check if refresh token is valid
        if (!user.isValidRefreshToken(refreshToken)) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token is invalid or expired'
            });
        }

        // Generate new tokens
        const newAccessToken = generateToken({ id: user._id });
        const newRefreshToken = generateRefreshToken({ id: user._id });
        
        // Remove old refresh token and add new one
        user.removeRefreshToken(refreshToken);
        const newRefreshTokenExpiry = getRefreshTokenExpiry(newRefreshToken);
        user.addRefreshToken(newRefreshToken, newRefreshTokenExpiry, req.headers['user-agent']);
        await user.save();

        // Set new tokens as cookies
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken
            }
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }
        
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        const accessToken = req.token;
        const userId = req.user._id;
        const refreshToken = req.cookies?.refreshToken;

        // Add tokens to blacklist
        await addToBlacklist(accessToken, userId, 'logout');
        
        if (refreshToken) {
            await addToBlacklist(refreshToken, userId, 'logout');
            
            const user = await User.findById(userId);
            user.removeRefreshToken(refreshToken);
            await user.save();
        }

        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.json({
            success: true,
            message: 'Logged out successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Current User
exports.getMe = async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};