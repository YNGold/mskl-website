import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🔒 Middleware called for path:', pathname)
  
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/challenges', '/profile', '/submissions']
  const authRoutes = ['/login', '/signup']
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  console.log('🔒 Is protected route:', isProtectedRoute)
  console.log('🔒 Is auth route:', isAuthRoute)
  
  // Get the token from the request
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const isAuthenticated = !!token
  
  console.log('🔒 Token exists:', !!token)
  console.log('🔒 Is authenticated:', isAuthenticated)
  
  // If trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    console.log('🚫 Middleware: Redirecting unauthenticated user from', pathname, 'to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If trying to access auth pages while already authenticated
  if (isAuthRoute && isAuthenticated) {
    console.log('🔄 Middleware: Redirecting authenticated user from', pathname, 'to /dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  console.log('✅ Middleware: Allowing request to continue')
  // Allow the request to continue
  return NextResponse.next()
}

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
// Force fresh deployment
// Force fresh deployment Tue Aug 12 04:12:24 IDT 2025
