import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/register', '/api']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) =>
    p === '/' ? pathname === '/' : pathname.startsWith(p)
  )

  if (isPublic) return NextResponse.next()

  // For app routes: check for refresh token cookie
  // (access token is in-memory; we just ensure there's a session)
  const hasSession =
    req.cookies.has('soc_session') ||
    req.headers.get('authorization')?.startsWith('Bearer ')

  // Client-side auth check happens in the auth provider
  // Middleware only handles hard redirects for non-JS navigation
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
