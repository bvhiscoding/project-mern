const express = require("express");
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");
const { protect } = require("../middlewares/auth");
const { authorize } = require("../middlewares/role");
const router = express.Router();
router
  .route("/")
  .get(getRestaurants)
  .post(protect, authorize("admin"), createRestaurant);
router
  .route("/:id")
  .get(getRestaurantById)
  .put(protect, authorize("admin"), updateRestaurant)
  .delete(protect, authorize("admin"), deleteRestaurant);
module.exports = router;
