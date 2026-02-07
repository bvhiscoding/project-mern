const Restaurant = require("../models/Restaurant");
const asyncHandler = require("../middlewares/asyncHandler");

const getRestaurants = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = { isActive: true };
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
  }
  if (req.query.minRating) {
    query.rating = { $gte: parseFloat(req.query.minRating) };
  }
  if (req.query.cuisine) {
    query.cuisine = req.query.cuisine;
  }

  const total = await Restaurant.countDocuments(query);
  const restaurants = await Restaurant.find(query)
    .skip(skip)
    .limit(limit)
    .select("-menu");
  res.json({
    success: true,
    data: restaurants,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }
  res.json({
    success: true,
    data: restaurant,
  });
});
const createRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({
    success: true,
    data: restaurant,
  });
});
const updateRestaurant = asyncHandler(async (req, res) => {
  let restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }
  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({
    success: true,
    data: restaurant,
  });
});
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }
  await restaurant.deleteOne();
  res.status(204).json({
    success: true,
    data: {},
  });
});
module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
