import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get all submissions (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const challengeId = searchParams.get('challengeId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    let where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (challengeId) {
      where.challengeId = challengeId
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        },
        challenge: {
          select: {
            id: true,
            title: true,
            points: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json(submissions)

  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Submit a challenge solution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, challengeId, answer } = body

    // Validate required fields
    if (!userId || !challengeId || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if challenge is active
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    if (!challenge.isActive) {
      return NextResponse.json(
        { error: 'Challenge is not active' },
        { status: 400 }
      )
    }

    // Check if user already submitted for this challenge
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        userId,
        challengeId
      }
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted a solution for this challenge' },
        { status: 409 }
      )
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        userId,
        challengeId,
        answer,
        score: 0 // Will be updated by admin/automated scoring
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        },
        challenge: {
          select: {
            id: true,
            title: true,
            points: true
          }
        }
      }
    })

    return NextResponse.json(
      { message: 'Submission created successfully', submission },
      { status: 201 }
    )

  } catch (error) {
    console.error('Create submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 