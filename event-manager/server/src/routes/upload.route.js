const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { uploadEventCover } = require("../controllers/upload.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { uploadEventCoverSchema } = require("../validators/upload.validation");
const AppError = require("../utils/ApiError");

const router = express.Router();

router.post("/event-cover", protect, (req, res, next) => {
  upload.single("cover")(req, res, (error) => {
    if (error) {
      return next(new AppError(error.message, 400, "UPLOAD_ERROR"));
    }
    return next();
  });
}, validateBody(uploadEventCoverSchema), uploadEventCover);

module.exports = router;
