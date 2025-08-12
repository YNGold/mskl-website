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
    const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y
    const startDate = getStartDate(period)

    // Get date range for filtering
    const endDate = new Date()
    const startDateFilter = startDate

    // User Statistics
    const totalUsers = await prisma.user.count({
      where: { role: 'student' }
    })

    const newUsers = await prisma.user.count({
      where: {
        role: 'student',
        createdAt: {
          gte: startDateFilter
        }
      }
    })

    const activeUsers = await prisma.user.count({
      where: {
        role: 'student',
        userActions: {
          some: {
            timestamp: {
              gte: startDateFilter
            }
          }
        }
      }
    })

    // Challenge Statistics
    const totalChallenges = await prisma.challenge.count()
    const activeChallenges = await prisma.challenge.count({
      where: {
        status: 'active'
      }
    })

    const totalSubmissions = await prisma.submission.count({
      where: {
        createdAt: {
          gte: startDateFilter
        }
      }
    })

    // Engagement Metrics
    const totalPageViews = await prisma.pageView.count({
      where: {
        timestamp: {
          gte: startDateFilter
        }
      }
    })

    const totalUserActions = await prisma.userAction.count({
      where: {
        timestamp: {
          gte: startDateFilter
        }
      }
    })

    // Geographic Distribution
    const geographicStats = await prisma.user.groupBy({
      by: ['state'],
      where: { role: 'student' },
      _count: { state: true },
      orderBy: { _count: { state: 'desc' } },
      take: 10
    })

    // Grade Distribution
    const gradeStats = await prisma.user.groupBy({
      by: ['grade'],
      where: { role: 'student' },
      _count: { grade: true },
      orderBy: { grade: 'asc' }
    })

    // Top Performing Challenges
    const topChallenges = await prisma.challenge.findMany({
      include: {
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
      take: 5
    })

    // Conversion Funnel Data
    const conversionData = await prisma.conversionFunnel.findMany({
      where: {
        date: {
          gte: startDateFilter
        }
      },
      orderBy: { date: 'desc' },
      take: 30
    })

    // Recent Activity
    const recentActions = await prisma.userAction.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 10
    })

    // Performance Metrics
    const performanceMetrics = await prisma.performanceMetrics.findMany({
      where: {
        date: {
          gte: startDateFilter
        }
      },
      orderBy: { date: 'desc' },
      take: 100
    })

    // Calculate trends
    const previousPeriodStart = new Date(startDateFilter)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - getDaysInPeriod(period))

    const previousNewUsers = await prisma.user.count({
      where: {
        role: 'student',
        createdAt: {
          gte: previousPeriodStart,
          lt: startDateFilter
        }
      }
    })

    const previousSubmissions = await prisma.submission.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDateFilter
        }
      }
    })

    // Calculate growth rates
    const userGrowthRate = previousNewUsers > 0 
      ? ((newUsers - previousNewUsers) / previousNewUsers) * 100 
      : newUsers > 0 ? 100 : 0

    const submissionGrowthRate = previousSubmissions > 0 
      ? ((totalSubmissions - previousSubmissions) / previousSubmissions) * 100 
      : totalSubmissions > 0 ? 100 : 0

    return NextResponse.json({
      period,
      dateRange: {
        start: startDateFilter,
        end: endDate
      },
      overview: {
        totalUsers,
        newUsers,
        activeUsers,
        userGrowthRate: Math.round(userGrowthRate * 100) / 100,
        totalChallenges,
        activeChallenges,
        totalSubmissions,
        submissionGrowthRate: Math.round(submissionGrowthRate * 100) / 100,
        totalPageViews,
        totalUserActions
      },
      geographic: geographicStats.map(stat => ({
        state: stat.state,
        userCount: stat._count.state
      })),
      gradeDistribution: gradeStats.map(stat => ({
        grade: stat.grade,
        userCount: stat._count.grade
      })),
      topChallenges: topChallenges.map(challenge => ({
        id: challenge.id,
        title: challenge.title,
        submissions: challenge._count.submissions,
        analytics: challenge.analytics
      })),
      conversionFunnel: conversionData,
      recentActivity: recentActions.map(action => ({
        id: action.id,
        action: action.action,
        timestamp: action.timestamp,
        user: action.user ? {
          name: `${action.user.firstName} ${action.user.lastName}`,
          email: action.user.email
        } : null
      })),
      performance: {
        avgPageLoadTime: calculateAverageMetric(performanceMetrics, 'page_load_time'),
        avgApiResponseTime: calculateAverageMetric(performanceMetrics, 'api_response_time'),
        errorRate: calculateAverageMetric(performanceMetrics, 'error_rate')
      }
    })
  } catch (error) {
    console.error('Error fetching analytics overview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
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

function getDaysInPeriod(period: string): number {
  switch (period) {
    case '7d': return 7
    case '30d': return 30
    case '90d': return 90
    case '1y': return 365
    default: return 30
  }
}

function calculateAverageMetric(metrics: any[], metricName: string): number {
  const filteredMetrics = metrics.filter(m => m.metric === metricName)
  if (filteredMetrics.length === 0) return 0
  
  const sum = filteredMetrics.reduce((acc, m) => acc + m.value, 0)
  return Math.round((sum / filteredMetrics.length) * 100) / 100
}
