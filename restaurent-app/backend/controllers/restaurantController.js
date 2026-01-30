const Restaurant = require("../models/Restaurant");

const getAllRestaurant = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    res.json(restaurants);
  } catch (error) {
    console.error("GetAllRestaurants error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.error("GetRestaurantById error:", error);
    res.status(500).json({ message: error.message });
  }
};
// ADMIN
const createRestaurent = async (req, res) => {
  try {
    const { name, image, description, address, rating, cuisine } = req.body;
    if (!name || !image) {
      return res.status(400).json({ message: "Name and Image are required" });
    }
    const restaurant = await Restaurant.create({
      name,
      image,
      description,
      address,
      rating,
      cuisine,
    });
    res.json(restaurant);
  } catch (error) {
    console.error("CreateRestaurant error:", error);
    res.status(500).json({ message: error.message });
  }
};
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    restaurant.name = req.body.name || restaurant.name;
    restaurant.image = req.body.image || restaurant.image;
    restaurant.description = req.body.description || restaurant.description;
    restaurant.address = req.body.address || restaurant.address;
    restaurant.rating = req.body.rating ?? restaurant.rating;
    restaurant.cuisine = req.body.cuisine || restaurant.cuisine;
    restaurant.isActive = req.body.isActive ?? restaurant.isActive;
    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } catch (error) {
    console.error('UpdateRestaurant error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant removed' });
  } catch (error) {
    console.error('DeleteRestaurant error:', error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};