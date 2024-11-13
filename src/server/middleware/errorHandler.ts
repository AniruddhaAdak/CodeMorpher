import { Request, Response, NextFunction } from 'express';
import { ConversionError } from '../utils/errors';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof ConversionError) {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
        sourceLang: err.sourceLang,
        targetLang: err.targetLang,
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid request data',
        details: err.errors,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
    },
  });
}