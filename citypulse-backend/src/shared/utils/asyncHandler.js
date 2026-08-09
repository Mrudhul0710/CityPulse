/**
 * Wraps an async controller so a rejected promise (or thrown AppError)
 * is forwarded to next(), which the centralized errorHandler picks up.
 *
 * Without this, Express (v4 and earlier semantics) does NOT catch errors
 * thrown inside an async function automatically — the request just hangs
 * or crashes the process on an unhandled rejection. This is the manual
 * replacement for what express-async-errors was patching in for us.
 *
 * Usage: router.post("/", asyncHandler(controller.create));
 */
export function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
