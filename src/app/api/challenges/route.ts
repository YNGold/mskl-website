import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get all challenges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const grade = searchParams.get('grade')

    let where: any = {}

    if (active === 'true') {
      where.isActive = true
    }

    if (category) {
      where.categoryId = category
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (grade) {
      where.grade = parseInt(grade)
    }

    const challenges = await prisma.challenge.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(challenges)

  } catch (error) {
    console.error('Get challenges error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new challenge (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, difficulty, categoryId, grade, points, startDate, endDate, isActive } = body

    // Validate required fields
    if (!title || !description || !difficulty || !categoryId || !grade || !points || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        difficulty,
        categoryId,
        grade: parseInt(grade),
        points: parseInt(points),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive || false
      }
    })

    return NextResponse.json(
      { message: 'Challenge created successfully', challenge },
      { status: 201 }
    )

  } catch (error) {
    console.error('Create challenge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 