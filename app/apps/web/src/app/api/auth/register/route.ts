import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma'
import { generateTokens } from '../../../../lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password (min 8 chars) required' } },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'EMAIL_TAKEN', message: 'An account with this email already exists' } },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ?? null,
        notifications: { create: {} },
      },
      select: { id: true, email: true, name: true, plan: true, role: true, avatarUrl: true, createdAt: true, updatedAt: true },
    })

    const tokens = generateTokens(user.id, user.plan, user.role)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await prisma.refreshToken.create({ data: { userId: user.id, token: tokens.refreshToken, expiresAt } })

    return NextResponse.json({
      success: true,
      data: {
        user: { ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() },
        tokens,
      },
    }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Registration failed' } },
      { status: 500 }
    )
  }
}
