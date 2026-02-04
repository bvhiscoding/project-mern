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
        required: true,
        select: false
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

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}
userSchema.methods.matchPassword = function(password){
    return this.comparePassword(password);
}
module.exports = mongoose.model('User', userSchema);

