import logger from "winston"

const errorHandler = (err, req, res, next) => {
  logger.error("Global error", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date(),
  });

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

export default errorHandler