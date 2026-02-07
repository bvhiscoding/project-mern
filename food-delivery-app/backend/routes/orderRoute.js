const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const router = express.Router();
router
  .route("/")
  .post(protect, createOrder)
  .get(protect, authorize("admin"), getAllOrders);
router.get("/my-orders", protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);
module.exports = router;
