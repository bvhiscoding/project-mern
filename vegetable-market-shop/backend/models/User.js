const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    address:{
        type: Object,
        required: true
    },
    role:{
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    avatar:{
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const salt =  bcrypt.genSaltSync(10);

userSchema.pre('save' , function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = bcrypt.hashSync(this.password, salt);
    next();
})

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User', userSchema);

