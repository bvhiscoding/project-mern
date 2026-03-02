const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next(new AppError("Not authorized, token missing", 401, "TOKEN_MISSING"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return next(new AppError("Not authorized, user not found", 401, "USER_NOT_FOUND"));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError("Not authorized, invalid token", 401, "INVALID_TOKEN"));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not authorized", 401, "UNAUTHORIZED"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden: insufficient role", 403, "FORBIDDEN"));
    }

    next();
  };
};

module.exports = { protect, authorize };
