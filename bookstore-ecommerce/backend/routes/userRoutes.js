const express = require('express')
const router = express.Router()

const {
  getUsers,
  deleteUser,
  updateUserAdmin,
} = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware')
const { admin } = require('../middlewares/adminMiddleware')
const { validateRequest } = require('../middlewares/validationMiddleware')
const { body } = require('express-validator')

// Users API
router.get('/', protect, admin, getUsers)
router.delete('/:id', protect, admin, deleteUser)
router.put(
  '/:id/admin',
  protect,
  admin,
  body('isAdmin').isBoolean().withMessage('isAdmin must be a boolean'),
  validateRequest,
  updateUserAdmin
)

module.exports = router
