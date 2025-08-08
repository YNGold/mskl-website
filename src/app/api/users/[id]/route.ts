import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// GET - Get user profile by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        grade: true,
        state: true,
        school: true,
        parentEmail: true,
        parentApproved: true,
        points: true,
        level: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            submissions: true,
            teamMembers: true,
            createdTeams: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's recent submissions
    const recentSubmissions = await prisma.submission.findMany({
      where: { userId: id },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            points: true,
            category: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' },
      take: 5
    })

    // Get user's teams
    const teams = await prisma.teamMember.findMany({
      where: { userId: id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true
          }
        }
      }
    })

    return NextResponse.json({
      user,
      recentSubmissions,
      teams: teams.map(tm => tm.team)
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile (admin can edit everything)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      parentApproved,
      points,
      level
    } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      firstName,
      lastName,
      email,
      username,
      grade: grade ? parseInt(grade) : undefined,
      state,
      school,
      parentEmail,
      parentApproved,
      points: points !== undefined ? parseInt(points) : undefined,
      level: level !== undefined ? parseInt(level) : undefined
    }

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    // Check for email/username conflicts if changing
    if (email && email !== existingUser.email) {
      const emailConflict = await prisma.user.findUnique({
        where: { email }
      })
      if (emailConflict) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        )
      }
    }

    if (username && username !== existingUser.username) {
      const usernameConflict = await prisma.user.findUnique({
        where: { username }
      })
      if (usernameConflict) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        grade: true,
        state: true,
        school: true,
        parentEmail: true,
        parentApproved: true,
        points: true,
        level: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'User updated successfully',
      user
    })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user and all related data (cascade)
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 