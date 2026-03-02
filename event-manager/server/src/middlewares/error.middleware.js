const AppError = require("../utils/ApiError");
const { fail } = require("../utils/ApiResponse");

const notFound = (req, res, next) => {
  next(new AppError("Route not found", 404, "NOT_FOUND"));
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let status = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errorCode = err.errorCode || "INTERNAL_SERVER_ERROR";
  let details = err.details;

  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation failed";
    errorCode = "VALIDATION_ERROR";
    details = Object.values(err.errors || {}).map((item) => item.message);
  }

  if (err.code === 11000) {
    status = 400;
    message = "Duplicate resource";
    errorCode = "DUPLICATE_RESOURCE";
    details = err.keyValue;
  }

  if (!err.isOperational && status >= 500) {
    console.error(err);
    message = "Internal server error";
    errorCode = "INTERNAL_SERVER_ERROR";
    details = undefined;
  }

  return fail(res, { status, message, errorCode, details });
};

module.exports = { notFound, errorHandler };
