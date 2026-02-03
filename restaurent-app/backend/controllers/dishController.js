const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().populate("restaurant", "name");
    res.json({ success: true, data: dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDishesByRestaurant = async (req, res) => {
  try {
    const dishes = await Dish.find({ restaurant: req.params.restaurantId });
    res.json({ success: true, data: dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ success: false, message: "Dish not found" });
    res.json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDish = async (req, res) => {
  try {
    const { name, price, restaurant } = req.body;
    if (!name || !price || !restaurant) {
      return res
        .status(400)
        .json({ success: false, message: "Name, price, restaurant are required" });
    }
    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    const dish = await Dish.create(req.body);
    res.status(201).json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ success: false, message: 'Dish not found' });
    if (req.body.restaurant) {
      const restaurantExists = await Restaurant.findById(req.body.restaurant);
      if (!restaurantExists) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
    }
    Object.assign(dish, req.body);
    const updatedDish = await dish.save();
    res.json({ success: true, data: updatedDish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ success: false, message: 'Dish not found' });
    res.json({ success: true, message: 'Dish removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  getAllDishes,
  getDishesByRestaurant,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
};
