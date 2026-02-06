const mongoose = require('mongoose');

// Sub-schema for dish
const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  image: String,
  category: { 
    type: String, 
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'other'],
    default: 'other'
  },
  available: { type: Boolean, default: true }
});

// Main restaurant schema
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  rating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  cuisine: String,
  deliveryTime: String,
  menu: [dishSchema],
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
