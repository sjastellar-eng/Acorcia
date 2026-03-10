import jwt, { type SignOptions } from 'jsonwebtoken'

export function generateTokens(userId: string, plan: string, role: string) {
  const accessToken = jwt.sign(
    { sub: userId, plan, role },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as SignOptions['expiresIn'] }
  )
  const refreshToken = jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '30d') as SignOptions['expiresIn'] }
  )
  return { accessToken, refreshToken }
}

export function verifyAccessToken(token: string): { sub: string; plan: string; role: string } {
  return jwt.verify(token, process.env.JWT_SECRET!) as { sub: string; plan: string; role: string }
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { sub: string }
}
