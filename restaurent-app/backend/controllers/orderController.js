const Order = require('../models/Order');

// POST /api/orders (protected) - Create order from frontend cart data
const createOrder = async (req, res) => {
  try {
    const { items, restaurant, totalPrice, deliveryAddress, phone, note, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    
    if (!deliveryAddress || !phone) {
      return res.status(400).json({ success: false, message: 'Delivery address and phone are required' });
    }
    
    if (!restaurant) {
      return res.status(400).json({ success: false, message: 'Restaurant is required' });
    }
    
    // Create order with items from frontend cart
    const orderItems = items.map((item) => ({
      dish: item.dishId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));
    
    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurant,
      items: orderItems,
      totalPrice,
      deliveryAddress,
      phone,
      note: note || '',
      paymentMethod: paymentMethod || 'cash',
      status: 'pending',
      paymentStatus: 'unpaid'
    });
    
    // Populate the created order
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('restaurant', 'name address cuisine');
    
    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    console.error('CreateOrder error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders (protected) - Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name cuisine image')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('GetUserOrders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id (protected) - Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name address cuisine phone');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('GetOrderById error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/all (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('restaurant', 'name cuisine')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('GetAllOrders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    order.status = status;
    const updatedOrder = await order.save();
    
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('user', 'name email')
      .populate('restaurant', 'name');
    
    res.json({ success: true, data: populatedOrder });
  } catch (error) {
    console.error('UpdateOrderStatus error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/orders/:id/cancel (protected)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    const isOwner = order.user.toString() === req.user._id.toString();
    
    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }
    
    order.status = 'cancelled';
    const updatedOrder = await order.save();
    
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('restaurant', 'name');
    
    res.json({ success: true, data: populatedOrder });
  } catch (error) {
    console.error('CancelOrder error:', error);
    res.status(500).json({ success: false, message: error.message });
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