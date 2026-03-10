import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { generateTokens, verifyRefreshToken } from '../../../../lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json()

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_TOKEN', message: 'Refresh token required' } },
        { status: 401 }
      )
    }

    let payload: { sub: string }
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token' } },
        { status: 401 }
      )
    }

    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!storedToken || storedToken.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: { code: 'TOKEN_REUSED', message: 'Refresh token already used or expired' } },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 401 }
      )
    }

    await prisma.refreshToken.delete({ where: { token: refreshToken } })
    const tokens = generateTokens(user.id, user.plan, user.role)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await prisma.refreshToken.create({ data: { userId: user.id, token: tokens.refreshToken, expiresAt } })

    return NextResponse.json({ success: true, data: { tokens } })
  } catch (err) {
    console.error('Refresh error:', err)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Token refresh failed' } },
      { status: 500 }
    )
  }
}
