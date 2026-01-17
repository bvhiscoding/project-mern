const mongoose = require('mongoose');


const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please add doctor name']
    },
    specialty:{
        type: String,
        required:[true, 'Please add doctor specialty']
    },
    email:{
        type: String, 
        required:[true, 'Please add an email']
    },
    phone:{
        type: String, 
        required:[true, 'Please add phone number']
    },
    experience:{
        type: Number,
        default:0
    },
    avaiable:{
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date, 
        default: Date.now
    }
})

module.exports=  mongoose.model('Doctor' , doctorSchema)