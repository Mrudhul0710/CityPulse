/**
 * AppError is the single shape of error the rest of the app throws.
 * Controllers/services never send responses themselves on failure —
 * they throw AppError, and the centralized error handler formats it.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details) {
    return new AppError(message, 400, details);
  }
  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401);
  }
  static forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }
  static notFound(message = "Resource not found") {
    return new AppError(message, 404);
  }
  static conflict(message = "Conflict") {
    return new AppError(message, 409);
  }
}
