import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { verifyAccessToken } from '../../../../lib/jwt'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Missing authorization header' } },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    let payload: { sub: string }
    try {
      payload = verifyAccessToken(token)
    } catch {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired access token' } },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, plan: true, role: true, avatarUrl: true, createdAt: true, updatedAt: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { user: { ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() } },
    })
  } catch (err) {
    console.error('Me error:', err)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch user' } },
      { status: 500 }
    )
  }
}
