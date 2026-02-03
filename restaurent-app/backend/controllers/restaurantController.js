const Restaurant = require("../models/Restaurant");

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllRestaurantsAdmin = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const { name, image, description, address, rating, cuisine } = req.body;
    if (!name || !image) {
      return res.status(400).json({ success: false, message: "Name and Image are required" });
    }
    const restaurant = await Restaurant.create({
      name,
      image,
      description,
      address,
      rating,
      cuisine,
    });
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    restaurant.name = req.body.name || restaurant.name;
    restaurant.image = req.body.image || restaurant.image;
    restaurant.description = req.body.description || restaurant.description;
    restaurant.address = req.body.address || restaurant.address;
    restaurant.rating = req.body.rating ?? restaurant.rating;
    restaurant.cuisine = req.body.cuisine || restaurant.cuisine;
    restaurant.isActive = req.body.isActive ?? restaurant.isActive;
    const updatedRestaurant = await restaurant.save();
    res.json({ success: true, data: updatedRestaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
    res.json({ success: true, message: 'Restaurant removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  getAllRestaurants,
  getAllRestaurantsAdmin,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
