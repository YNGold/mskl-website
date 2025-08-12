import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🔒 Middleware called for path:', pathname)
  
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/challenges', '/profile', '/submissions']
  const authRoutes = ['/login', '/signup']
  const adminRoutes = ['/admin']
  const adminAuthRoutes = ['/admin/login']
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isAdminAuthRoute = adminAuthRoutes.some(route => pathname.startsWith(route))
  
  console.log('🔒 Is protected route:', isProtectedRoute)
  console.log('🔒 Is auth route:', isAuthRoute)
  console.log('🔒 Is admin route:', isAdminRoute)
  console.log('🔒 Is admin auth route:', isAdminAuthRoute)
  
  // Handle admin routes separately (they use different auth system)
  if (isAdminRoute && !isAdminAuthRoute) {
    // Check for admin session cookie
    const adminSession = request.cookies.get('admin-session')
    console.log('🔒 Admin session cookie exists:', !!adminSession)
    
    if (!adminSession) {
      console.log('🚫 Middleware: Redirecting unauthenticated admin from', pathname, 'to /admin/login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  // Handle student routes with NextAuth
  if (isProtectedRoute || isAuthRoute) {
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
    '/admin/:path*',
    '/login',
    '/signup'
  ]
}
// Force fresh deployment
// Force fresh deployment Tue Aug 12 04:12:24 IDT 2025
