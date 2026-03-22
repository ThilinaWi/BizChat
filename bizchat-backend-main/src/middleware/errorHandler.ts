import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import mongoose from 'mongoose';
import { log } from '../utils/logger';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  stack?: string;
}

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If headers already sent, delegate to Express default handler to avoid double-send crash
  if (res.headersSent) {
    next(error as Error);
    return;
  }

  let statusCode = 500;
  let message = 'Internal server error';
  let errors: string[] | undefined;
  let isOperational = false;

  try {
    // Normalise non-Error throws (e.g. throw 'string' or throw { msg: '...' })
    const err = error instanceof Error ? error : new Error(String(error ?? 'Unknown error'));

    if (err instanceof AppError) {
      statusCode = err.statusCode;
      message = err.message;
      isOperational = err.isOperational;

      if (err instanceof ValidationError) {
        errors = err.errors;
      }
    } else if (err instanceof mongoose.Error.ValidationError) {
      statusCode = 400;
      message = 'Validation failed';
      errors = err.errors ? Object.values(err.errors).map(e => e.message) : [];
      isOperational = true;
    } else if (err instanceof mongoose.Error.CastError) {
      statusCode = 400;
      message = `Invalid value for field "${err.path}"${err.value !== undefined ? `: "${err.value}"` : ''}`;
      isOperational = true;
    } else if ((err as any).code === 11000) {
      statusCode = 409;
      // keyPattern / keyValue structure varies between MongoDB drivers and CosmosDB
      const keyPattern = (err as any).keyPattern;
      const keyValue   = (err as any).keyValue;
      const rawField =
        (keyPattern && Object.keys(keyPattern).length > 0 && Object.keys(keyPattern)[0]) ||
        (keyValue   && Object.keys(keyValue).length   > 0 && Object.keys(keyValue)[0])   ||
        'field';
      const field = typeof rawField === 'string' ? rawField : 'field';
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      isOperational = true;
    } else if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token has expired. Please sign in again';
      isOperational = true;
    } else if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token. Please sign in again';
      isOperational = true;
    } else if (err.name === 'SyntaxError' && (err as any).status === 400 && (err as any).body) {
      // Malformed JSON body sent by client
      statusCode = 400;
      message = 'Invalid JSON in request body';
      isOperational = true;
    }

    // ─── Logging ───────────────────────────────────────────────────
    const errorContext = {
      statusCode,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: (req.user as any)?._id ?? 'unauthenticated',
    };

    if (isOperational) {
      if (statusCode >= 400 && statusCode < 500) {
        log.warn(`[${statusCode}] ${message}`, errorContext);
      } else {
        log.error(`[${statusCode}] ${message}`, errorContext);
      }
    } else {
      log.error(`Unexpected Error: ${err.message}`, {
        ...errorContext,
        stack: err.stack,
        name: err.name,
      });
    }

    // ─── Response ──────────────────────────────────────────────────
    const errorResponse: ErrorResponse = { success: false, message };

    if (errors && errors.length > 0) {
      errorResponse.errors = errors;
    }

    if (process.env.NODE_ENV !== 'production') {
      // In development expose the real error message and stack to ease debugging
      if (statusCode === 500 && err.message && err.message !== message) {
        (errorResponse as any).detail = err.message;
      }
      errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
  } catch (handlerError) {
    // Last-resort: the error handler itself threw — send a plain 500 and log
    log.error('Error handler itself threw an exception', { handlerError });
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  log.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
