const express = require('express')
const router = express.Router()

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController')
const { protect } = require('../middlewares/authMiddleware')
const { validateRequest } = require('../middlewares/validationMiddleware')
const { body } = require('express-validator')

// Auth API
router.post(
  '/register',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validateRequest,
  registerUser
)
router.post(
  '/login',
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
  loginUser
)
router.get('/profile', protect, getUserProfile)
router.put(
  '/profile',
  protect,
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validateRequest,
  updateUserProfile
)

module.exports = router
