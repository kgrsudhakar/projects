/**
 * CENTRALIZED ERROR HANDLING PATTERN
 * -----------------------------------
 * Express recognizes a middleware as an error handler when it has
 * FOUR arguments (err, req, res, next). By putting this at the end
 * of the middleware chain in app.js, EVERY `next(err)` call and every
 * thrown error in an async route (see asyncHandler below) ends up
 * here instead of scattered try/catch blocks everywhere.
 */
export function errorHandler(err, req, res, next) {
  const isOperational = err.isOperational === true;
  const statusCode = err.statusCode || 500;

  if (!isOperational) {
    // Unexpected bug - log full details for us, but don't leak internals
    // to the client.
    console.error("[UNEXPECTED ERROR]", err);
  }

  res.status(statusCode).json({
    error: {
      message: isOperational ? err.message : "Something went wrong",
      code: err.code || "INTERNAL_ERROR",
    },
  });
}

/**
 * Express does NOT automatically catch errors thrown inside async
 * route handlers (pre-Express 5). This wrapper catches them and
 * forwards to next(), so our async controllers can just `throw`
 * instead of needing try/catch in every single function.
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: { message: `Route ${req.method} ${req.originalUrl} not found`, code: "ROUTE_NOT_FOUND" },
  });
}
