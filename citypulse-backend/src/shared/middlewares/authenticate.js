import { AppError } from "../errors/AppError.js";
import { verifyToken } from "../utils/jwt.js";

/**
 * Verifies the JWT and attaches { id, role } to req.user.
 * This middleware answers ONE question: "is this a valid, logged-in user?"
 * It does NOT decide what that user is allowed to do — that's authorize.js.
 */
export function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw AppError.unauthorized("Authentication token missing");
  }

  const token = header.split(" ")[1];
  const decoded = verifyToken(token); // { sub, role, iat, exp }

  req.user = { id: decoded.sub, role: decoded.role };
  next();
}
