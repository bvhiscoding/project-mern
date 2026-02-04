const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        
    },
    type:{
        type : String,
        required : true,
        enum: ['vegetable', 'fruit'],
        
    },
    description:{
        type : String,
        required : true,
        
    },
    price:{
        type : Number,
        required : true,
    },
    image:{
        type : String,
        required : true,
    },
    stock:{
        type : Number,
        required : true,
        default: 0,
    },
    category:{
        type : String,
        required : true,
    },
    unit:{
        type : String,
        required : true,
    },
    rating:{
        type : Number,
        default: 0,
    },
    numReviews:{
        type : Number,
        default: 0,
    },
    featured:{
        type : Boolean,
        default: false,
    }
},
{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);