import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// GET - Get all users (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        grade: true,
        state: true,
        school: true,
        parentEmail: true,
        parentApproved: true,
        points: true,
        level: true,
        role: true,
        permissions: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            submissions: true,
            teamMembers: true,
            createdTeams: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      email, 
      username, 
      password, 
      grade, 
      state, 
      school, 
      parentEmail,
      parentApproved = false,
      points = 0,
      level = 1,
      role = 'student',
      permissions = [],
      isAdmin = false
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !username || !password || !grade || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
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
        school,
        parentEmail,
        parentApproved,
        points: parseInt(points),
        level: parseInt(level),
        role,
        permissions,
        isAdmin
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        grade: true,
        state: true,
        school: true,
        parentEmail: true,
        parentApproved: true,
        points: true,
        level: true,
        role: true,
        permissions: true,
        isAdmin: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'User created successfully',
      user
    }, { status: 201 })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete multiple users (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userIds = searchParams.get('ids')

    if (!userIds) {
      return NextResponse.json(
        { error: 'User IDs are required' },
        { status: 400 }
      )
    }

    const ids = userIds.split(',')

    // Delete users and their related data (cascade)
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    return NextResponse.json({
      message: `${deletedUsers.count} user(s) deleted successfully`
    })

  } catch (error) {
    console.error('Delete users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 