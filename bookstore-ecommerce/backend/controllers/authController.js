const User = require('../models/User')
const generateToken = require('../utils/generateToken')

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ name, email, password })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    }

    res.status(401).json({ message: 'Invalid email or password' })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: error.message })
  }
}

const getUserProfile = async (req, res) => {
  res.status(200).json(req.user)
}

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        email,
        _id: { $ne: user._id },
      })
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' })
      }
    }

    user.name = name || user.name
    user.email = email || user.email
    if (password) {
      user.password = password
    }

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } catch (error) {
    console.error('UpdateProfile error:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile }
