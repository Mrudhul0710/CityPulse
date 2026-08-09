import { AppError } from "../errors/AppError.js";

/**
 * 404 handler for unmatched routes. Must be registered AFTER all routes.
 */
export function notFoundHandler(req, res, next) {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Single place where every error in the app becomes an HTTP response.
 * Controllers/services just throw — they never format responses on error.
 */
export function errorHandler(err, req, res, next) {
  let error = err;

  // Translate common non-AppError failures into AppError so the shape
  // sent to the client is always consistent.
  if (err.name === "ValidationError") {
    // Mongoose validation error
    const details = Object.values(err.errors).map((e) => e.message);
    error = AppError.badRequest("Validation failed", details);
  } else if (err.name === "CastError") {
    error = AppError.badRequest(`Invalid ${err.path}: ${err.value}`);
  } else if (err.code === 11000) {
    // Mongo duplicate key
    const field = Object.keys(err.keyValue || {})[0];
    error = AppError.conflict(`${field || "Field"} already exists`);
  } else if (err.name === "JsonWebTokenError") {
    error = AppError.unauthorized("Invalid token");
  } else if (err.name === "TokenExpiredError") {
    error = AppError.unauthorized("Token expired");
  } else if (!(err instanceof AppError)) {
    // Unexpected/programming error — don't leak internals to the client.
    console.error("[unhandled error]", err);
    error = new AppError("Something went wrong", 500);
  }

  if (error.statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    details: error.details || undefined,
  });
}
