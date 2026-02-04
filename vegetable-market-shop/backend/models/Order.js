const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        
    },
    orderItems:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity:{
                type: Number,
                required: true
            },
            price:{
                type: Number,
                required: true
            }

        }
    ],
    shippingAddress:{
        type: Object,
        required: true

    },
    paymentMethod:{
        type: String,
        required: true
    },
    paymentResult:{
        type: Object,
        default: {}
    },
    itemsPrice:{
        type: Number,
        required: true
    },
    taxPrice:{
        type: Number,
        required: true
    },
    shippingPrice:{
        type: Number,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true
    },
    isPaid:{
        type: Boolean,
        default: false
    },
    paidAt:{
        type: Date
    },
    isDelivered:{
        type: Boolean,
        default: false
    },
    deliveredAt:{
        type: Date
    },
    status:{
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Order', orderSchema);