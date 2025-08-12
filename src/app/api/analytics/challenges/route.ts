import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth, getAdminSession } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const authError = requireAdminAuth(request)
    if (authError) {
      return authError
    }
    
    const adminSession = getAdminSession(request)
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const startDate = getStartDate(period)
    const challengeId = searchParams.get('challengeId')

    if (challengeId) {
      return await getChallengeDetails(challengeId, startDate)
    }

    // Overall Challenge Performance
    const challengePerformance = await getChallengePerformance(startDate)
    
    // Challenge Engagement Metrics
    const engagementMetrics = await getEngagementMetrics(startDate)
    
    // Category Performance
    const categoryPerformance = await getCategoryPerformance(startDate)
    
    // Difficulty Analysis
    const difficultyAnalysis = await getDifficultyAnalysis(startDate)
    
    // Top Performing Challenges
    const topChallenges = await prisma.challenge.findMany({
      include: {
        category: true,
        analytics: true,
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: {
        submissions: {
          _count: 'desc'
        }
      },
      take: 10
    })

    // Challenge Completion Rates
    const completionRates = await getCompletionRates(startDate)
    
    // Geographic Challenge Performance
    const geographicPerformance = await getGeographicPerformance(startDate)

    return NextResponse.json({
      period,
      dateRange: {
        start: startDate,
        end: new Date()
      },
      performance: challengePerformance,
      engagement: engagementMetrics,
      categories: categoryPerformance,
      difficulty: difficultyAnalysis,
      topChallenges: topChallenges.map(challenge => ({
        id: challenge.id,
        title: challenge.title,
        category: challenge.category.name,
        grade: challenge.grade,
        status: challenge.isActive ? 'active' : 'inactive',
        submissions: challenge._count.submissions,
        analytics: challenge.analytics,
        createdAt: challenge.createdAt
      })),
      completionRates,
      geographic: geographicPerformance
    })
  } catch (error) {
    console.error('Error fetching challenge analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getChallengeDetails(challengeId: string, startDate: Date) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      category: true,
      analytics: true,
      submissions: {
        where: {
          submittedAt: {
            gte: startDate
          }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              grade: true,
              state: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' }
      },
      _count: {
        select: { submissions: true }
      }
    }
  })

  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
  }

  // Calculate detailed metrics
  const totalSubmissions = challenge._count.submissions
  const successfulSubmissions = challenge.submissions.filter(s => s.status === 'approved').length
  const successRate = totalSubmissions > 0 ? (successfulSubmissions / totalSubmissions) * 100 : 0

  // Grade distribution of participants
  const gradeDistribution = challenge.submissions.reduce((acc, submission) => {
    const grade = submission.user.grade
    acc[grade] = (acc[grade] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  // Geographic distribution
  const geographicDistribution = challenge.submissions.reduce((acc, submission) => {
    const state = submission.user.state
    acc[state] = (acc[state] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Submission timeline
  const submissionTimeline = challenge.submissions.reduce((acc, submission) => {
    const date = submission.submittedAt.toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return NextResponse.json({
    challenge: {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      category: challenge.category.name,
      grade: challenge.grade,
      status: challenge.isActive ? 'active' : 'inactive',
      createdAt: challenge.createdAt,
      analytics: challenge.analytics
    },
    metrics: {
      totalSubmissions,
      successfulSubmissions,
      successRate: Math.round(successRate * 100) / 100,
      avgCompletionTime: challenge.analytics?.avgCompletionTime || 0,
      difficultyRating: challenge.analytics?.difficultyRating || 0
    },
    distribution: {
      grade: Object.entries(gradeDistribution).map(([grade, count]) => ({
        grade: parseInt(grade),
        count
      })),
      geographic: Object.entries(geographicDistribution).map(([state, count]) => ({
        state,
        count
      }))
    },
    timeline: Object.entries(submissionTimeline).map(([date, count]) => ({
      date,
      count
    })),
    recentSubmissions: challenge.submissions.slice(0, 10).map(submission => ({
      id: submission.id,
      status: submission.status,
      submittedAt: submission.submittedAt,
      user: {
        name: `${submission.user.firstName} ${submission.user.lastName}`,
        grade: submission.user.grade,
        state: submission.user.state
      }
    }))
  })
}

async function getChallengePerformance(startDate: Date) {
  const challenges = await prisma.challenge.findMany({
    include: {
      analytics: true,
      _count: {
        select: { submissions: true }
      }
    }
  })

  const totalChallenges = challenges.length
  const activeChallenges = challenges.filter(c => c.isActive).length
  const totalSubmissions = challenges.reduce((sum, c) => sum + c._count.submissions, 0)
  const avgSubmissionsPerChallenge = totalChallenges > 0 ? totalSubmissions / totalChallenges : 0

  const avgSuccessRate = challenges.reduce((sum, c) => {
    if (c.analytics?.successRate) {
      return sum + c.analytics.successRate
    }
    return sum
  }, 0) / challenges.filter(c => c.analytics?.successRate).length

  return {
    totalChallenges,
    activeChallenges,
    totalSubmissions,
    avgSubmissionsPerChallenge: Math.round(avgSubmissionsPerChallenge * 100) / 100,
    avgSuccessRate: Math.round(avgSuccessRate * 100) / 100
  }
}

async function getEngagementMetrics(startDate: Date) {
  const submissions = await prisma.submission.findMany({
    where: {
      submittedAt: {
        gte: startDate
      }
    },
    include: {
      challenge: true
    }
  })

  const dailySubmissions = submissions.reduce((acc, submission) => {
    const date = submission.submittedAt.toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const challengeEngagement = submissions.reduce((acc, submission) => {
    const challengeId = submission.challengeId
    if (!acc[challengeId]) {
      acc[challengeId] = {
        title: submission.challenge.title,
        submissions: 0,
        successful: 0
      }
    }
    acc[challengeId].submissions++
    if (submission.status === 'approved') {
      acc[challengeId].successful++
    }
    return acc
  }, {} as Record<string, any>)

  return {
    dailySubmissions: Object.entries(dailySubmissions).map(([date, count]) => ({
      date,
      count
    })),
    challengeEngagement: Object.values(challengeEngagement)
  }
}

async function getCategoryPerformance(startDate: Date) {
  const categoryStats = await prisma.category.findMany({
    include: {
      challenges: {
        include: {
          _count: {
            select: { submissions: true }
          }
        }
      }
    }
  })

  return categoryStats.map(category => {
    const totalSubmissions = category.challenges.reduce((sum, c) => sum + c._count.submissions, 0)
    const avgSubmissionsPerChallenge = category.challenges.length > 0 
      ? totalSubmissions / category.challenges.length 
      : 0

    return {
      id: category.id,
      name: category.name,
      challengeCount: category.challenges.length,
      totalSubmissions,
      avgSubmissionsPerChallenge: Math.round(avgSubmissionsPerChallenge * 100) / 100
    }
  })
}

async function getDifficultyAnalysis(startDate: Date) {
  const challenges = await prisma.challenge.findMany({
    include: {
      analytics: true
    }
  })

  const difficultyLevels = challenges.reduce((acc, challenge) => {
    const difficulty = challenge.analytics?.difficultyRating || 0
    const level = difficulty < 3 ? 'Easy' : difficulty < 7 ? 'Medium' : 'Hard'
    
    if (!acc[level]) {
      acc[level] = {
        count: 0,
        avgSuccessRate: 0,
        totalSubmissions: 0
      }
    }
    
    acc[level].count++
    if (challenge.analytics?.successRate) {
      acc[level].avgSuccessRate += challenge.analytics.successRate
    }
    
    return acc
  }, {} as Record<string, any>)

  // Calculate averages
  Object.keys(difficultyLevels).forEach(level => {
    if (difficultyLevels[level].count > 0) {
      difficultyLevels[level].avgSuccessRate = Math.round(
        (difficultyLevels[level].avgSuccessRate / difficultyLevels[level].count) * 100
      ) / 100
    }
  })

  return difficultyLevels
}

async function getCompletionRates(startDate: Date) {
  const submissions = await prisma.submission.findMany({
    where: {
      submittedAt: {
        gte: startDate
      }
    },
    include: {
      challenge: true
    }
  })

  const challengeCompletion = submissions.reduce((acc, submission) => {
    const challengeId = submission.challengeId
    if (!acc[challengeId]) {
      acc[challengeId] = {
        title: submission.challenge.title,
        total: 0,
        completed: 0
      }
    }
    
    acc[challengeId].total++
    if (submission.status === 'approved') {
      acc[challengeId].completed++
    }
    
    return acc
  }, {} as Record<string, any>)

  return Object.values(challengeCompletion).map((challenge: any) => ({
    title: challenge.title,
    completionRate: challenge.total > 0 
      ? Math.round((challenge.completed / challenge.total) * 10000) / 100 
      : 0
  }))
}

async function getGeographicPerformance(startDate: Date) {
  const submissions = await prisma.submission.findMany({
    where: {
      submittedAt: {
        gte: startDate
      }
    },
    include: {
      user: {
        select: { state: true }
      },
      challenge: true
    }
  })

  const statePerformance = submissions.reduce((acc, submission) => {
    const state = submission.user.state
    if (!acc[state]) {
      acc[state] = {
        totalSubmissions: 0,
        successfulSubmissions: 0,
        challenges: new Set()
      }
    }
    
    acc[state].totalSubmissions++
    acc[state].challenges.add(submission.challengeId)
    
    if (submission.status === 'approved') {
      acc[state].successfulSubmissions++
    }
    
    return acc
  }, {} as Record<string, any>)

  return Object.entries(statePerformance).map(([state, data]: [string, any]) => ({
    state,
    totalSubmissions: data.totalSubmissions,
    successfulSubmissions: data.successfulSubmissions,
    uniqueChallenges: data.challenges.size,
    successRate: data.totalSubmissions > 0 
      ? Math.round((data.successfulSubmissions / data.totalSubmissions) * 10000) / 100 
      : 0
  }))
}

function getStartDate(period: string): Date {
  const now = new Date()
  switch (period) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}
