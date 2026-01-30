const express = require("express");
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const router = express.Router();
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", protect, admin, createRestaurant);
router.put("/:id", protect, admin, updateRestaurant);
router.delete("/:id", protect, admin, deleteRestaurant);
module.exports = router;