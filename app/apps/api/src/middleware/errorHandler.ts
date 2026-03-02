import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[Error]', err)

  if (err instanceof ZodError) {
    const details: Record<string, string> = {}
    err.errors.forEach((e) => {
      const key = e.path.join('.')
      details[key] = e.message
    })
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details },
    })
  }

  if (err instanceof Error) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Resource not found' },
      })
    }

    if (err.message === 'FORBIDDEN') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied' },
      })
    }
  }

  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
  })
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  })
}
