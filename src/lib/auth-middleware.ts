import { NextRequest, NextResponse } from 'next/server'

export interface AdminSession {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  permissions: string[]
  isAdmin: boolean
}

export function getAdminSession(request: NextRequest): AdminSession | null {
  try {
    const sessionCookie = request.cookies.get('admin-session')
    if (!sessionCookie?.value) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie.value) as AdminSession
    
    // Validate session data
    if (!sessionData.id || !sessionData.email || !sessionData.role) {
      return null
    }

    return sessionData
  } catch (error) {
    console.error('Error parsing admin session:', error)
    return null
  }
}

export function requireAdminAuth(request: NextRequest): NextResponse | null {
  const session = getAdminSession(request)
  
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Check if user has admin privileges
  if (!session.isAdmin && !['admin', 'moderator', 'viewer'].includes(session.role)) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return null
}

export function requireSpecificRole(request: NextRequest, allowedRoles: string[]): NextResponse | null {
  const session = getAdminSession(request)
  
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (!allowedRoles.includes(session.role)) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return null
}

export function requirePermission(request: NextRequest, requiredPermission: string): NextResponse | null {
  const session = getAdminSession(request)
  
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Super admins have all permissions
  if (session.role === 'super_admin') {
    return null
  }

  // Check if user has the required permission
  if (!session.permissions.includes(requiredPermission)) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return null
}

export function logoutAdmin(response: NextResponse): NextResponse {
  response.cookies.delete('admin-session')
  return response
}
