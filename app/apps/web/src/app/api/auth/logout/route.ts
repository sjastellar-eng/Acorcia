import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json()
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    return NextResponse.json({ success: true, data: null })
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json({ success: true, data: null })
  }
}
