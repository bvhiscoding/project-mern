const express = require('express')
const router = express.Router()

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered,
} = require('../controllers/orderController')
const { protect } = require('../middlewares/authMiddleware')
const { admin } = require('../middlewares/adminMiddleware')

// Orders API
router.post('/', protect, createOrder)
router.get('/myorders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id/pay', protect, updateOrderToPaid)
router.get('/', protect, admin, getAllOrders)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered)

module.exports = router
