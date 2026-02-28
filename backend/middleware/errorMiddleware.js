const { errorResponse } = require("../utils/responseHandler");

const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Global Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return errorResponse(res, statusCode, message);
};

module.exports = errorMiddleware;