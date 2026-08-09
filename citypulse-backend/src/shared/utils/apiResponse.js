/**
 * Every successful response goes through this so the client always
 * receives the same envelope shape: { success, message, data, meta }.
 */
export function sendSuccess(res, { statusCode = 200, message = "Success", data = null, meta = null }) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}
