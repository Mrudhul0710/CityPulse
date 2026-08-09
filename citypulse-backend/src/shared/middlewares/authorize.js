import { AppError } from "../errors/AppError.js";

/**
 * Role-based access control. Usage: authorize("admin", "officer")
 * Must run AFTER authenticate() since it relies on req.user.role.
 *
 * This is deliberately dumb — a single "is your role in this list" check.
 * Anything more nuanced (e.g. "officer can only edit issues in their own
 * department") is a business rule and belongs in the Service layer, not here.
 */
export function authorize(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden(
        `Role '${req.user.role}' is not permitted to perform this action`
      );
    }
    next();
  };
}
