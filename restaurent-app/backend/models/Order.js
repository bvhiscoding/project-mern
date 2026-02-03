const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required']
    },
    items: [
      {
        dish: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Dish',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        image: {
          type: String
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0
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
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'momo', 'zalopay'],
      default: 'cash'
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid'
    }
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('Order', orderSchema);