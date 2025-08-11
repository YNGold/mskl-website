import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')
    const isStudentRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                          req.nextUrl.pathname.startsWith('/challenges') ||
                          req.nextUrl.pathname.startsWith('/profile') ||
                          req.nextUrl.pathname.startsWith('/submissions')

    // If user is on auth page but already authenticated, redirect to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is trying to access student route but not authenticated, redirect to login
    if (isStudentRoute && !isAuth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // If user is admin, allow access to admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Admin routes are handled by separate admin middleware
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/challenges/:path*', 
    '/profile/:path*',
    '/submissions/:path*',
    '/login',
    '/signup'
  ]
}
