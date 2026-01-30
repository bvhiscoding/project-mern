const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Restaurant name is required'], 
      trim: true 
    },
    image: { 
      type: String, 
      required: [true, 'Restaurant image is required'] 
    },
    description: { 
      type: String 
    },
    address: { 
      type: String 
    },
    rating: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
    cuisine: { 
      type: String 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Restaurant', restaurantSchema);