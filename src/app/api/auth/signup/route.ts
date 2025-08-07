import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { validateAndSanitizeUserInput } from '@/lib/validation'
import { rateLimit, getClientIP } from '@/lib/rateLimit'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimitResult = rateLimit(`signup:${clientIP}`, 5, 900000) // 5 attempts per 15 minutes
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate and sanitize input
    const validatedData = validateAndSanitizeUserInput(body)
    const { firstName, lastName, email, username, password, grade, state, school, parentEmail, parentApproved } = validatedData

    // Additional server-side validation (redundant but secure)
    if (!firstName || !lastName || !email || !username || !password || !grade || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check for inappropriate usernames
    const inappropriateWords = [
      'admin', 'moderator', 'staff', 'support', 'help', 'test', 'demo',
      'fuck', 'shit', 'bitch', 'ass', 'dick', 'pussy', 'cock', 'cunt',
      'nigger', 'nigga', 'faggot', 'dyke', 'whore', 'slut', 'bitch',
      'kill', 'death', 'hate', 'racist', 'sexist', 'homophobic'
    ]
    
    const lowerUsername = username.toLowerCase()
    for (const word of inappropriateWords) {
      if (lowerUsername.includes(word)) {
        return NextResponse.json(
          { error: 'Username contains inappropriate content. Please choose a different username.' },
          { status: 400 }
        )
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        grade: parseInt(grade),
        state,
        school: school || null,
        parentEmail: parentEmail || null,
        parentApproved: parentApproved || false,
        points: 0,
        level: 1
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 