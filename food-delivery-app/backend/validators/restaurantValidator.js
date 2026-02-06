const { body, validationResult } = require("express-validator");
const createRestaurantValidator = [
  body("name").notEmpty().withMessage("Restaurant name is required"),
  body("cuisine").notEmpty().withMessage("Cuisine is required"),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];
module.exports = { createRestaurantValidator };
