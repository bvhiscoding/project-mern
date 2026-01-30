const Cart = require('../models/Cart');
const Dish = require('../models/Dish');
// GET /api/cart (protected)
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.dish');
    if (!cart) return res.json({ items: [], totalPrice: 0 });
    res.json(cart);
  } catch (error) {
    console.error('GetCart error:', error);
    res.status(500).json({ message: error.message });
  }
};
// POST /api/cart (protected)
const addToCart = async (req, res) => {
  try {
    const { dishId, quantity = 1 } = req.body;
    if (!dishId) return res.status(400).json({ message: 'DishId is required' });
    const dish = await Dish.findById(dishId);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ dish: dishId, quantity, price: dish.price }],
        totalPrice: dish.price * quantity,
      });
      return res.status(201).json(cart);
    }
    const existingItem = cart.items.find(
      (item) => item.dish.toString() === dishId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ dish: dishId, quantity, price: dish.price });
    }
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('AddToCart error:', error);
    res.status(500).json({ message: error.message });
  }
};
// PUT /api/cart/:itemId (protected)
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('UpdateCartItem error:', error);
    res.status(500).json({ message: error.message });
  }
};
// DELETE /api/cart/:itemId (protected)
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    item.deleteOne();
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('RemoveFromCart error:', error);
    res.status(500).json({ message: error.message });
  }
};
// DELETE /api/cart (protected)
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    cart.totalPrice = 0;
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('ClearCart error:', error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};