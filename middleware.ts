import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const protectedPrefixes = ['/api/me']

function isProtected(pathname: string) {
  return protectedPrefixes.some(p => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pre-filter only: rejects requests that don't even have a session cookie so they never
  // reach a route handler. The real auth boundary is getSession() inside each /api/me/* handler.
  // Do NOT add new /api/me/* routes that rely on this check alone.
  if (isProtected(pathname)) {
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  // Per-request CSP nonce — Next.js auto-applies this to its inline hydration scripts
  // when the nonce is set on the request via the `x-nonce` header.
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isProd = process.env.NODE_ENV === 'production'

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}'${isProd ? '' : " 'unsafe-eval'"}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `connect-src 'self'${isProd ? '' : ' ws: wss:'}`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    ...(isProd ? ['upgrade-insecure-requests'] : []),
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
