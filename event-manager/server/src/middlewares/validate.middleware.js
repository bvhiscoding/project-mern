const AppError = require("../utils/ApiError");

const validate = (schema, property) => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((item) => item.message);
    return next(
      new AppError("Validation failed", 400, "VALIDATION_ERROR", details),
    );
  }

  req[property] = value;
  return next();
};

const validateBody = (schema) => validate(schema, "body");
const validateQuery = (schema) => validate(schema, "query");
const validateParams = (schema) => validate(schema, "params");

module.exports = { validateBody, validateQuery, validateParams };
