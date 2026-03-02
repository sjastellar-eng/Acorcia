import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '@soc/database'

export interface AuthRequest extends Request {
  userId?: string
  userPlan?: string
}

interface JWTPayload {
  sub: string
  plan: string
  role: string
  iat: number
  exp: number
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' },
    })
  }

  const token = authHeader.slice(7)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    req.userId = payload.sub
    req.userPlan = payload.plan
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Access token expired' },
      })
    }
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid access token' },
    })
  }
}

export function requirePlan(minPlan: 'pro' | 'annual') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const plan = req.userPlan
    const hasAccess =
      plan === 'annual' ||
      (minPlan === 'pro' && (plan === 'pro' || plan === 'annual'))

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PLAN_REQUIRED',
          message: `This feature requires the ${minPlan} plan`,
        },
      })
    }

    next()
  }
}
