const express = require("express");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const router = express.Router();
router.use(protect);
router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/all", admin, getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/cancel", cancelOrder);
router.patch("/:id/status", admin, updateOrderStatus);
module.exports = router;