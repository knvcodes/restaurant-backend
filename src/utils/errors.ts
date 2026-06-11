import logger from "./logger";

// errors.ts
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Convenience subclasses
export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", details?: Record<string, unknown>) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", details?: Record<string, unknown>) {
    super(401, message, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", details?: Record<string, unknown>) {
    super(403, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found", details?: Record<string, unknown>) {
    super(404, message, details);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict", details?: Record<string, unknown>) {
    super(409, message, details);
  }
}

export class ValidationError extends HttpError {
  constructor(
    message = "Validation Failed",
    details?: Record<string, unknown>,
  ) {
    super(422, message, details);
  }
}

export class InternalError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}

export const globalErrorHandler = (err, _req, res, _next) => {
  logger.error({ err }, "Unhandled error in globalErrorHandler");

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: Object.values(err.errors).map((e: any) => e.message),
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: "Duplicate entry",
      field: Object.keys(err.keyValue)[0],
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }

  // Default
  res.status(err.status || err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
};
