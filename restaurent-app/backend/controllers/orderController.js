const Order = require('../models/Order');
const Cart = require('../models/Cart');
// POST /api/orders (protected)
const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, phone, note } = req.body;
    if (!deliveryAddress || !phone) {
      return res.status(400).json({ message: 'Delivery address and phone are required' });
    }
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.dish');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    const orderItems = cart.items.map((item) => ({
      dish: item.dish?._id,
      name: item.dish?.name || 'Unknown dish',
      quantity: item.quantity,
      price: item.price,
    }));
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice: cart.totalPrice,
      deliveryAddress,
      phone,
      note,
    });
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('CreateOrder error:', error);
    res.status(500).json({ message: error.message });
  }
};
// GET /api/orders (protected)
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('GetUserOrders error:', error);
    res.status(500).json({ message: error.message });
  }
};
// GET /api/orders/:id (protected)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (error) {
    console.error('GetOrderById error:', error);
    res.status(500).json({ message: error.message });
  }
};
// GET /api/orders/all (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('GetAllOrders error:', error);
    res.status(500).json({ message: error.message });
  }
};
// PATCH /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('UpdateOrderStatus error:', error);
    res.status(500).json({ message: error.message });
  }
};
// PATCH /api/orders/:id/cancel (protected)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: 'Not authorized' });
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }
    order.status = 'cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('CancelOrder error:', error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};