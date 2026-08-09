import { AppError } from "../errors/AppError.js";

/**
 * Wraps a plain validator function so validation always happens at the
 * route boundary, before the controller/service ever sees the request.
 *
 * `validatorFn` is a plain (req.body) => { value, errors } function.
 * We're not pulling in a schema library (Joi/Zod) to keep dependencies
 * minimal for the MVP — see each module's *.validation.js file.
 */
export function validate(validatorFn) {
  return function (req, res, next) {
    const { value, errors } = validatorFn(req.body);
    if (errors.length > 0) {
      throw AppError.badRequest("Validation failed", errors);
    }
    req.body = value; // sanitized/normalized body
    next();
  };
}
