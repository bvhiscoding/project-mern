const express = require("express");
const {
  getAllDishes,
  getDishesByRestaurant,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
} = require("../controllers/dishController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const router = express.Router();
router.get("/", getAllDishes);
router.get("/:id", getDishById);
router.get("/restaurant/:restaurantId", getDishesByRestaurant);
router.post("/", protect, admin, createDish);
router.put("/:id", protect, admin, updateDish);
router.delete("/:id", protect, admin, deleteDish);

module.exports = router