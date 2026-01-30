const mongoose = require('mongoose');
const dishSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Dish name is required'], 
      trim: true 
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'], 
      min: 0 
    },
    image: { 
      type: String 
    },
    description: { 
      type: String 
    },
    category: { 
      type: String, 
      enum: ['appetizer', 'main', 'dessert', 'beverage'] 
    },
    restaurant: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Restaurant', 
      required: [true, 'Restaurant is required'] 
    },
    isAvailable: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Dish', dishSchema);