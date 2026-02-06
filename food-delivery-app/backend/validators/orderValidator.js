const { body, validationResult } = require("express-validator");
const createOrderValidator = [
  body("restaurant").notEmpty().withMessage("Restaurant is required"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must have at least 1 item"),
  body("totalAmount")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be positive"),
  body("deliveryAddress.street").notEmpty().withMessage("Street is required"),
  body("deliveryAddress.city").notEmpty().withMessage("City is required"),
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
module.exports = { createOrderValidator };
