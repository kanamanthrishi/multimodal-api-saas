const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
    error: err.code || "SERVER_ERROR",
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;