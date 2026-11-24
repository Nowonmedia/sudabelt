import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

export class AppError extends Error {
  public statusCode: number;
  public errors?: unknown;

  constructor(message: string, statusCode = 400, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the submitted fields.',
      errors: formattedErrors,
    });
    return;
  }

  // 2. Custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
    return;
  }

  // 3. Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    const formattedErrors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Database validation failed.',
      errors: formattedErrors,
    });
    return;
  }

  // 4. Mongoose Duplicate Key Error (Code 11000)
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: number }).code === 11000
  ) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue || {};
    const duplicateFields = Object.keys(keyValue).join(', ');
    res.status(409).json({
      success: false,
      message: `Duplicate record found for field(s): ${duplicateFields || 'unique field'}`,
      errors: [{ field: duplicateFields, message: 'Value already exists.' }],
    });
    return;
  }

  // 5. Fallback Unhandled Error
  console.error('[Server Error]', err);
  const message =
    err instanceof Error && process.env.NODE_ENV !== 'production'
      ? err.message
      : 'Internal server error';

  res.status(500).json({
    success: false,
    message,
  });
};
