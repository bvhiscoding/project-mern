const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});
module.exports = { register, login, getMe };
