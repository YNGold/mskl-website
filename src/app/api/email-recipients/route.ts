import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const adminSession = await requireAdminAuth(request)
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade')
    const state = searchParams.get('state')
    const school = searchParams.get('school')
    const limit = parseInt(searchParams.get('limit') || '100')

    // Build query based on filters
    const whereClause: any = {
      role: 'student',
      isAdmin: false
    }

    if (grade) {
      whereClause.grade = parseInt(grade)
    }

    if (state) {
      whereClause.state = state
    }

    if (school) {
      whereClause.school = { contains: school, mode: 'insensitive' }
    }

    const recipients = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        grade: true,
        state: true,
        school: true,
        points: true,
        level: true
      },
      orderBy: { lastName: 'asc' },
      take: limit
    })

    // Get summary statistics
    const totalStudents = await prisma.user.count({
      where: { role: 'student', isAdmin: false }
    })

    const gradeStats = await prisma.user.groupBy({
      by: ['grade'],
      where: { role: 'student', isAdmin: false },
      _count: { grade: true }
    })

    const stateStats = await prisma.user.groupBy({
      by: ['state'],
      where: { role: 'student', isAdmin: false },
      _count: { state: true }
    })

    return NextResponse.json({
      recipients,
      stats: {
        totalStudents,
        gradeStats,
        stateStats
      }
    })
  } catch (error) {
    console.error('Error fetching email recipients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
