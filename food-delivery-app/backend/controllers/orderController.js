const Order = require("../models/Order");
const asyncHandler = require("../middlewares/asyncHandler");
const Restaurant = require("../models/Restaurant");

const createOrder = asyncHandler(async (req, res) => {
  const { restaurant, items, deliveryAddress, paymentMethod } = req.body;
  const restaurantExists = await Restaurant.findById(restaurant);
  if (!restaurantExists) {
    return res
      .status(404)
      .json({ success: false, message: "Restaurant not found" });
  }

  const totalAmount = items.reduce((sum, item) => {
    (sum + item.price * item.quantity, 0);
  });

  const order = await Order.create({
    user: req.user._id,
    restaurant,
    items,
    totalAmount,
    deliveryAddress,
    paymentMethod,
  });
  res.status(201).json({
    success: true,
    data: order,
  });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("restaurant")
    .sort({ createdAt: -1 });
  res.json({
    success: true,
    data: orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("restaurant", "name image");
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  res.json({
    success: true,
    data: order,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  order.status = status;
  await order.save();
  res.json({
    success: true,
    data: order,
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const total = await Order.countDocuments();

  const orders = await Order.find()
    .populate("user", "name email")
    .populate("restaurant", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  res.json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};
