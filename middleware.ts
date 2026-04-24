import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const protectedPrefixes = ['/api/me']

function isProtected(pathname: string) {
  return protectedPrefixes.some(p => pathname === p || pathname.startsWith(p + '/'))    // Does at least one item in protectedPrefixes match the conditions?
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!isProtected(pathname)) return

  const sessionCookie = getSessionCookie(request)
  if (!sessionCookie) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],  // Exclude static files, Next.js internals, and auth routes from middleware
}
