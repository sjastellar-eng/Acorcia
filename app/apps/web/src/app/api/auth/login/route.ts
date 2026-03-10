import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma'
import { generateTokens } from '../../../../lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 }
      )
    }

    const tokens = generateTokens(user.id, user.plan, user.role)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await prisma.refreshToken.create({ data: { userId: user.id, token: tokens.refreshToken, expiresAt } })
    await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role,
          avatarUrl: user.avatarUrl, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString(),
        },
        tokens,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Login failed' } },
      { status: 500 }
    )
  }
}
