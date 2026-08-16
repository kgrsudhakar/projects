import { AppError } from "../utils/AppError.js";

/**
 * MIDDLEWARE PATTERN
 * ------------------
 * A reusable, generic middleware factory: give it a Zod schema, get
 * back an Express middleware. This keeps validation declarative in
 * the routes file (see product.routes.js) instead of littering
 * if-checks inside controllers.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      return next(AppError.badRequest(message));
    }
    req.body = result.data; // parsed & coerced data
    next();
  };
}
