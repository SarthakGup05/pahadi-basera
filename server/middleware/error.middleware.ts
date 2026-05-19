import type { Request, Response, NextFunction } from 'express';

/**
 * Global Error Handler Middleware
 * Catches errors thrown in routes and returns a standardized JSON response.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error]:', err.stack);

  // Default to 500 server error if no specific status code is set on the error object
  const statusCode = (err as any).statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
