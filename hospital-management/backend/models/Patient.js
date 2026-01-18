const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:[true, 'Please add patient name']
    },
    age:{
        type: Number,
        required:[true, 'Please add patient age']
    },
    gender:{
        type: String,
        required:[true, 'Please add patient gender'],
        enum: ['Male', 'Female', 'Other']
    },
    phone:{
        type: String,
        required:[true, 'Please add phone number']
    },
    email:{
        type: String
    },
    address:{
        type: String
    },
    bloodGroup:{
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Patient', patientSchema)