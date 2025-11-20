// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '15m'
    });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const getTokenExpiry = (token) => {
    const decoded = jwt.decode(token);
    return new Date(decoded.exp * 1000);
};

const getRefreshTokenExpiry = (token) => {
    const decoded = jwt.decode(token);
    return new Date(decoded.exp * 1000);
};

module.exports = { 
    generateToken, 
    generateRefreshToken, 
    verifyToken, 
    verifyRefreshToken,
    getTokenExpiry,
    getRefreshTokenExpiry
};