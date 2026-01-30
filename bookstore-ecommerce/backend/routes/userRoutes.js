const express = require('express')
const router = express.Router()

const {
  getUsers,
  deleteUser,
  updateUserAdmin,
} = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware')
const { admin } = require('../middlewares/adminMiddleware')

// Users API
router.get('/', protect, admin, getUsers)
router.delete('/:id', protect, admin, deleteUser)
router.put('/:id/admin', protect, admin, updateUserAdmin)

module.exports = router
