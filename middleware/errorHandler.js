const logger = require("../utils/logger");

/**
 * Global Error Handling Middleware
 */

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
