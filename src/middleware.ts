import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/directory', '/business', '/auth', '/api/auth']
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    if (isPublicRoute) {
      return NextResponse.next()
    }

    // Dashboard routes require authentication
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }

      // Business owner dashboard access
      if (pathname.startsWith('/dashboard/business') && token.role !== 'BUSINESS_OWNER' && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      // Admin routes
      if (pathname.startsWith('/dashboard/admin') && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow all public routes
        const publicRoutes = ['/', '/directory', '/business', '/auth', '/api/auth']
        const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
        
        if (isPublicRoute) return true
        
        // Require token for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}