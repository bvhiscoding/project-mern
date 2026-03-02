const Joi = require("joi");

const createBookingSchema = Joi.object({
  quantity: Joi.number().integer().min(1).default(1),
});

module.exports = {
  createBookingSchema,
};
