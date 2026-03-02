const express = require("express");
const { register, login, logout, me } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { validateBody } = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validators/user.validation");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, me);

module.exports = router;
