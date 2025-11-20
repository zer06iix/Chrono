const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');
const { validateRequest }  = require('../middlewares/validation');
const {
    loginValidation,
    registerValidation,
} = require('../validations/authValidation');

// Public routes
router.post('/register', validateRequest(registerValidation), register);
router.post('/login', validateRequest(loginValidation), login);
router.post('/logout', auth, validateRequest(loginValidation), logout);

// Protected route (requires authentication)
router.get('/me', auth, getMe);

module.exports = router;