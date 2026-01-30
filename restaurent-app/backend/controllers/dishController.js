const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");
const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().populate("restaurant", "name");
    res.json(dishes);
  } catch (error) {
    console.error("GetAllDishes error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getDishesByRestaurant = async (req, res) => {
  try {
    const dishes = await Dish.find({ restaurant: req.params.restaurantId });
    res.json(dishes);
  } catch (error) {
    console.error("GetDishesByRestaurant error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.json(dish);
  } catch (error) {
    console.error("GetDishById error:", error);
    res.status(500).json({ message: error.message });
  }
};
// ADMIN
const createDish = async (req, res) => {
  try {
    const { name, price, restaurant } = req.body;
    if (!name || !price || !restaurant) {
      return res
        .status(400)
        .json({ message: "Name, price, restaurant are required" });
    }
    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const dish = await Dish.create(req.body);
    res.status(201).json(dish);
  } catch (error) {
    console.error('CreateDish error:', error);
    res.status(500).json({ message: error.message });
  }
};
const updateDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    if (req.body.restaurant) {
      const restaurantExists = await Restaurant.findById(req.body.restaurant);
      if (!restaurantExists) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
    }
    Object.assign(dish, req.body);
    const updatedDish = await dish.save();
    res.json(updatedDish);
  } catch (error) {
    console.error('UpdateDish error:', error);
    res.status(500).json({ message: error.message });
  }
};
const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json({ message: 'Dish removed' });
  } catch (error) {
    console.error('DeleteDish error:', error);
    res.status(500).json({ message: error.message });
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