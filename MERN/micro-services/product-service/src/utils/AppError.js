/**
 * Custom error class for operational errors (expected errors we throw
 * on purpose, e.g. "not found", "validation failed").
 *
 * Why this exists: it lets our centralized error handler distinguish
 * between errors we meant to throw (safe to show a clean message for)
 * and unexpected bugs (which we should log and hide the details of).
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // marks this as an "expected" error
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(message = "Resource not found") {
    return new AppError(message, 404, "NOT_FOUND");
  }

  static badRequest(message = "Bad request") {
    return new AppError(message, 400, "BAD_REQUEST");
  }

  static conflict(message = "Conflict") {
    return new AppError(message, 409, "CONFLICT");
  }
}
