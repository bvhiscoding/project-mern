const express = require('express');
const router = express.Router();
const { register, login , getProfile , updateProfile} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const {registerValidation, loginValidation,validate} = require('../middlewares/validationMiddleware');
const { get } = require('mongoose');

// @route   POST /api/auth/register

router.post('/register', ...registerValidation, validate, register);

// @route   POST /api/auth/login
router.post('/login', ...loginValidation, validate, login);

// @route   GET /api/auth/profile
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

module.exports = router;
