const success = (res, { status = 200, message = "Success", data = {}, meta } = {}) => {
  const payload = {
    success: true,
    message,
    ...data,
  };

  if (meta !== undefined) {
    payload.meta = meta;
  }

  return res.status(status).json(payload);
};

const fail = (
  res,
  {
    status = 500,
    message = "Something went wrong",
    errorCode = "INTERNAL_SERVER_ERROR",
    details,
  } = {},
) => {
  const payload = {
    success: false,
    message,
    errorCode,
  };

  if (details !== undefined) {
    payload.details = details;
  }

  return res.status(status).json(payload);
};

module.exports = { success, fail };
