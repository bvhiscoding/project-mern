const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/ApiError");
const { success } = require("../utils/ApiResponse");
const asyncHandler = require("../middlewares/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email: email.toLowerCase() });
  if (userExist) {
    throw new AppError("Email already in use", 400, "EMAIL_ALREADY_IN_USE");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "user",
  });

  const token = generateToken(user._id, user.role);

  return success(res, {
    status: 201,
    message: "Registered successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const token = generateToken(user._id, user.role);

  return success(res, {
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
});

const logout = asyncHandler(async (req, res) =>
  success(res, { message: "Logout successful on client side" }),
);

const me = asyncHandler(async (req, res) =>
  success(res, { data: { user: req.user } }),
);

module.exports = { register, login, logout, me };
