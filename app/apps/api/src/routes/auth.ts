import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '@soc/database'
import { redis, keys } from '../lib/redis'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// ── SCHEMAS ───────────────────────────────────────────────────

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(100).optional(),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// ── HELPERS ───────────────────────────────────────────────────

function generateTokens(userId: string, plan: string, role: string) {
  const accessToken = jwt.sign(
    { sub: userId, plan, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m' }
  )

  const refreshToken = jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d' }
  )

  return { accessToken, refreshToken }
}

// ── REGISTER ──────────────────────────────────────────────────

router.post('/register', async (req: Request, res: Response) => {
  const body = RegisterSchema.parse(req.body)

  const existing = await prisma.user.findUnique({ where: { email: body.email } })
  if (existing) {
    return res.status(409).json({
      success: false,
      error: { code: 'EMAIL_TAKEN', message: 'An account with this email already exists' },
    })
  }

  const passwordHash = await bcrypt.hash(body.password, 12)

  const user = await prisma.user.create({
    data: {
      email: body.email,
      passwordHash,
      name: body.name ?? null,
      notifications: {
        create: {},
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
  })

  const { accessToken, refreshToken } = generateTokens(user.id, user.plan, user.role)

  // Store refresh token in DB
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await prisma.refreshToken.create({
    data: { userId: user.id, token: refreshToken, expiresAt },
  })

  return res.status(201).json({
    success: true,
    data: {
      user: { ...user, updatedAt: new Date().toISOString() },
      tokens: { accessToken, refreshToken },
    },
  })
})

// ── LOGIN ─────────────────────────────────────────────────────

router.post('/login', async (req: Request, res: Response) => {
  const body = LoginSchema.parse(req.body)

  const user = await prisma.user.findUnique({ where: { email: body.email } })

  if (!user || !user.passwordHash) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
    })
  }

  const passwordMatch = await bcrypt.compare(body.password, user.passwordHash)
  if (!passwordMatch) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
    })
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.plan, user.role)

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await prisma.refreshToken.create({
    data: { userId: user.id, token: refreshToken, expiresAt },
  })

  // Update last seen
  await prisma.user.update({
    where: { id: user.id },
    data: { lastSeenAt: new Date() },
  })

  return res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      tokens: { accessToken, refreshToken },
    },
  })
})

// ── REFRESH TOKEN ─────────────────────────────────────────────

router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: { code: 'MISSING_TOKEN', message: 'Refresh token required' },
    })
  }

  let payload: { sub: string }
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { sub: string }
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token' },
    })
  }

  // Verify token exists in DB (single-use rotation)
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  })

  if (!storedToken || storedToken.expiresAt < new Date()) {
    return res.status(401).json({
      success: false,
      error: { code: 'TOKEN_REUSED', message: 'Refresh token already used or expired' },
    })
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user) {
    return res.status(401).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found' },
    })
  }

  // Rotate: delete old, create new
  await prisma.refreshToken.delete({ where: { token: refreshToken } })

  const newTokens = generateTokens(user.id, user.plan, user.role)
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await prisma.refreshToken.create({
    data: { userId: user.id, token: newTokens.refreshToken, expiresAt },
  })

  return res.json({ success: true, data: { tokens: newTokens } })
})

// ── LOGOUT ────────────────────────────────────────────────────

router.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
  }
  return res.json({ success: true, data: null })
})

// ── ME ────────────────────────────────────────────────────────

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'User not found' },
    })
  }

  return res.json({ success: true, data: { user } })
})

export default router
