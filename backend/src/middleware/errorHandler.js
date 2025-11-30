import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  logger.error("Unhandled error", { error: err.message, stack: err.stack });

  const status = err.status || 500;
  const message =
    status === 500 && env.nodeEnv === "production"
      ? "Internal server error"
      : err.message;

  res.status(status).json({
    message,
    traceId: req.traceId,
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
}
