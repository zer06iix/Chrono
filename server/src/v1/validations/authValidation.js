const Joi = require('joi');


const registerValidation = Joi.object({
    username: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin')
});

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateProfileValidation = Joi.object({
    username: Joi.string().min(3).max(10).required(),
    email: Joi.string().email(),
});

module.exports = {
    registerValidation,
    loginValidation,
    updateProfileValidation
};