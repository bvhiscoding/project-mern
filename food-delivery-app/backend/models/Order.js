const mongoose = require('mongoose');

// Sub-schema for order item
const orderItemSchema = new mongoose.Schema({
  dishId: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  quantity: { type: Number, default: 1, min: 1 }
});

// Main order schema
const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    unique: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant',
    required: true 
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    city: String,
    zipCode: String
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card'],
    default: 'cash'
  }
}, { 
  timestamps: true 
});

// Auto-generate orderId before save
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    this.orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
