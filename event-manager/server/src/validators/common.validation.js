const Joi = require("joi");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const idParamSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required(),
});

const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});

module.exports = {
  objectIdPattern,
  idParamSchema,
  paginationQuerySchema,
};
