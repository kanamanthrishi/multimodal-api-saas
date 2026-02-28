// utils/apiResponse.js

const successResponse = (res, message, data = {}, meta = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  });
};

const errorResponse = (res, message, error = "SERVER_ERROR", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse
};