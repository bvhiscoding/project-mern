const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");
const { protect } = require("../middlewares/auth");
const router = express.Router();
// Public routes
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
// Protected routes
router.get("/me", protect, getMe);
module.exports = router;
