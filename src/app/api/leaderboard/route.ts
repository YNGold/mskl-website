import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get leaderboard rankings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const state = searchParams.get('state')
    const grade = searchParams.get('grade')

    let where: any = {}

    if (state) {
      where.state = state
    }

    if (grade) {
      where.grade = parseInt(grade)
    }

    // Get users with their total points, ordered by points descending
    const leaderboard = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        grade: true,
        state: true,
        points: true,
        level: true,
        createdAt: true,
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: [
        { points: 'desc' },
        { level: 'desc' },
        { createdAt: 'asc' } // Earlier joiners get priority in ties
      ],
      take: limit
    })

    // Calculate additional stats
    const enrichedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
      submissionCount: user._count.submissions
    }))

    return NextResponse.json({
      leaderboard: enrichedLeaderboard,
      totalUsers: await prisma.user.count({ where })
    })

  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 