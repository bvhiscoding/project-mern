const jwt = require('jsonwebtoken')
const User = require('../models/User')

const {validationResult} = require('express-validator')


const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
}


const register = async (req,res) =>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const {username ,password ,email} = req.body
        
        // Lỗi: Thiếu await - findOne() trả về Promise, không phải kết quả!
        const userExists = await User.findOne({
            $or:[{email}, {username}]
        })

        if(userExists){
            return res.status(400).json({
                message: userExists.email === email ? 'Email already exists' :'Username already exists',
            })
        }
        const user = await User.create({ username, email, password})

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            token: generateToken(user._id),
        })
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const login = async (req,res)=>{
    try{
        const {email, password} = req.body

        const user = await User.findOne({email}).select('+password')

        if(!user){
            return res.status(401).json({message:'Invalid email or password'})

        }
        const isMatch = await user.matchPassword(password)
        if(!isMatch){
            return res.status(401).json({message:"Invalid email or password"})
        }
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            token: generateToken(user._id),
        })

    }catch(error){
        res.status(500).json({mesage: error.message})
    }
}

const getMe = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id)
        .populate('followers', 'username avatar')
        .populate('following', 'username avatar')
        res.json(user)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

module.exports ={
    register,
    login,
    getMe
}