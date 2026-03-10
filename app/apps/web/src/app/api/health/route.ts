import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const checks: Record<string, string> = {}

  // Check env vars (don't expose values, just presence)
  checks.DATABASE_URL = process.env.DATABASE_URL ? 'set' : 'MISSING'
  checks.JWT_SECRET = process.env.JWT_SECRET ? 'set' : 'MISSING'
  checks.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ? 'set' : 'MISSING'

  // Check DB connection
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = 'connected'
  } catch (err: any) {
    checks.database = `ERROR: ${err.message}`
  }

  const allOk = Object.values(checks).every(v => v === 'set' || v === 'connected')

  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 500 })
}
