const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
    let token;
    
    // Lỗi 5: req.header -> req.headers (có 's')
    // Lỗi 6: startWith -> startsWith (có 's')
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            
            if(!req.user){
                return res.status(401).json({message: 'User not found'})
            }
            next()
        }catch(error){
            return res.status(401).json({message: 'Not authorized, token failed'})
        }
    }
    
    if(!token){
        return res.status(401).json({message: 'Not authorized, no token'})
    }
}

// Lỗi 7: Export phải match với cách import trong authRoutes.js
// authRoutes.js dùng: const { protect } = require(...)
// Nên phải export: module.exports = { protect }
module.exports = { protect }
