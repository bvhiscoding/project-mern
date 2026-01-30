const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    items: [
      {
        dish: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Dish' 
        },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: { 
      type: Number, 
      required: true 
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    deliveryAddress: { 
      type: String, 
      required: [true, 'Delivery address is required'] 
    },
    phone: { 
      type: String, 
      required: [true, 'Phone number is required'] 
    },
    note: { 
      type: String 
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Order', orderSchema);