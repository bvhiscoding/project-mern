const User = require('../models/User')

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
    res.status(200).json(users)
  } catch (error) {
    console.error('GetUsers error:', error)
    res.status(500).json({ message: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await user.deleteOne()
    res.status(200).json({ message: 'User removed' })
  } catch (error) {
    console.error('DeleteUser error:', error)
    res.status(500).json({ message: error.message })
  }
}

const updateUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.isAdmin = Boolean(req.body.isAdmin)
    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } catch (error) {
    console.error('UpdateUserAdmin error:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getUsers, deleteUser, updateUserAdmin }
