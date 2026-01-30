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
const { validateRequest } = require('../middlewares/validationMiddleware')
const { body } = require('express-validator')

// Orders API
router.post(
  '/',
  protect,
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order items are required'),
  body('orderItems.*.book').notEmpty().withMessage('Book is required'),
  body('orderItems.*.title').notEmpty().withMessage('Title is required'),
  body('orderItems.*.price').isFloat({ min: 0 }).withMessage('Price is required'),
  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('orderItems.*.image').notEmpty().withMessage('Image is required'),
  body('shippingAddress.address')
    .notEmpty()
    .withMessage('Shipping address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode')
    .notEmpty()
    .withMessage('Postal code is required'),
  body('shippingAddress.country')
    .notEmpty()
    .withMessage('Country is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('itemsPrice').isFloat({ min: 0 }).withMessage('Items price is required'),
  body('taxPrice').isFloat({ min: 0 }).withMessage('Tax price is required'),
  body('shippingPrice')
    .isFloat({ min: 0 })
    .withMessage('Shipping price is required'),
  body('totalPrice')
    .isFloat({ min: 0 })
    .withMessage('Total price is required'),
  validateRequest,
  createOrder
)
router.get('/myorders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id/pay', protect, updateOrderToPaid)
router.get('/', protect, admin, getAllOrders)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered)

module.exports = router
