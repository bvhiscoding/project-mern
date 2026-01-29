const Order = require('../models/Order')

const createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Order items are empty' })
    }

    const order = await Order.create({
      ...req.body,
      user: req.user._id,
    })

    res.status(201).json(order)
  } catch (error) {
    console.error('CreateOrder error:', error)
    res.status(500).json({ message: error.message })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (error) {
    console.error('GetMyOrders error:', error)
    res.status(500).json({ message: error.message })
  }
}

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    res.status(200).json(order)
  } catch (error) {
    console.error('GetOrderById error:', error)
    res.status(500).json({ message: error.message })
  }
}

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = req.body.paymentResult || order.paymentResult

    const updatedOrder = await order.save()
    res.status(200).json(updatedOrder)
  } catch (error) {
    console.error('PayOrder error:', error)
    res.status(500).json({ message: error.message })
  }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (error) {
    console.error('GetAllOrders error:', error)
    res.status(500).json({ message: error.message })
  }
}

const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()
    res.status(200).json(updatedOrder)
  } catch (error) {
    console.error('DeliverOrder error:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered,
}
