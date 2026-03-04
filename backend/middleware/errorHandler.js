const constants = require('../constants');

/**
 * Global error handler middleware
 * Formats errors consistently and hides sensitive information in production
 */
const errorHandler = async (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log error for debugging (in real app, use a logging service like Winston)
  if (!isProduction) {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.status(statusCode).json({
        success: false,
        title: "Validation Error",
        message: err.message,
        ...(isProduction ? {} : { stackTrace: err.stack })
      });
      break;

    case constants.UNAUTHORIZED:
      res.status(statusCode).json({
        success: false,
        title: "Unauthorized",
        message: err.message,
        ...(isProduction ? {} : { stackTrace: err.stack })
      });
      break;

    case constants.FORBIDDEN:
      res.status(statusCode).json({
        success: false,
        title: "Forbidden",
        message: err.message,
        ...(isProduction ? {} : { stackTrace: err.stack })
      });
      break;

    case constants.NOT_FOUND:
      res.status(statusCode).json({
        success: false,
        title: "Not Found",
        message: err.message,
        ...(isProduction ? {} : { stackTrace: err.stack })
      });
      break;

    case constants.SERVER_ERROR:
      res.status(statusCode).json({
        success: false,
        title: "Server Error",
        message: "An internal server error occurred",
        ...(isProduction ? {} : { stackTrace: err.stack })
      });
      break;

    default:
      res.status(statusCode).json({
        success: false,
        title: "Error",
        message: err.message,
        ...(isProduction ? {} : { stackTrace: err.stack })
      });
      break;
  }
};

module.exports = errorHandler;
