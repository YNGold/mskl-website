import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getClientIP } from '@/lib/rateLimit'

// Simple rate limiting for admin login
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const now = Date.now()
    
    // Rate limiting: max 5 attempts per 15 minutes
    const attempts = loginAttempts.get(clientIP)
    if (attempts && attempts.count >= 5 && (now - attempts.lastAttempt) < 15 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      // Update rate limiting
      const currentAttempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(clientIP, {
        count: currentAttempts.count + 1,
        lastAttempt: now
      })

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (!user.isAdmin && user.role !== 'admin' && user.role !== 'moderator' && user.role !== 'viewer') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      // Update rate limiting
      const currentAttempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(clientIP, {
        count: currentAttempts.count + 1,
        lastAttempt: now
      })

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Reset rate limiting on successful login
    loginAttempts.delete(clientIP)

    // Create session data
    const sessionData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: user.permissions,
      isAdmin: user.isAdmin
    }

    // Set session cookie (in production, use secure session management)
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: sessionData
      },
      { status: 200 }
    )

    // Set HTTP-only cookie for session
    response.cookies.set('admin-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
