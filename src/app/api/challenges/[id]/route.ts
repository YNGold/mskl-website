import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get a specific challenge by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true
              }
            }
          }
        }
      }
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(challenge)

  } catch (error) {
    console.error('Get challenge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update a challenge
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, difficulty, categoryId, grade, points, startDate, endDate, isActive } = body

    const challenge = await prisma.challenge.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        categoryId,
        grade: grade ? parseInt(grade) : undefined,
        points: points ? parseInt(points) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive
      }
    })

    return NextResponse.json({
      message: 'Challenge updated successfully',
      challenge
    })

  } catch (error) {
    console.error('Update challenge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a challenge
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.challenge.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Challenge deleted successfully'
    })

  } catch (error) {
    console.error('Delete challenge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 