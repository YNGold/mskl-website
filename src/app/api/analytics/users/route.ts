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
    const limit = parseInt(searchParams.get('limit') || '50')

    // User Growth Over Time
    const userGrowthData = await getUserGrowthData(startDate)
    
    // User Engagement Metrics
    const engagementMetrics = await getEngagementMetrics(startDate)
    
    // User Retention Analysis
    const retentionData = await getRetentionData(startDate)
    
    // Top Active Users
    const topActiveUsers = await prisma.user.findMany({
      where: {
        role: 'student',
        userEngagement: {
          some: {
            date: {
              gte: startDate
            }
          }
        }
      },
      include: {
        userEngagement: {
          where: {
            date: {
              gte: startDate
            }
          },
          orderBy: { date: 'desc' }
        },
        _count: {
          select: {
            submissions: true,
            userActions: true
          }
        }
      },
      orderBy: {
        userEngagement: {
          _count: 'desc'
        }
      },
      take: limit
    })

    // User Behavior Analysis
    const behaviorAnalysis = await getUserBehaviorAnalysis(startDate)
    
    // Geographic User Distribution
    const geographicDistribution = await prisma.user.groupBy({
      by: ['state'],
      where: { role: 'student' },
      _count: { state: true },
      _sum: { points: true },
      orderBy: { _count: { state: 'desc' } }
    })

    // Grade Level Analysis
    const gradeAnalysis = await prisma.user.groupBy({
      by: ['grade'],
      where: { role: 'student' },
      _count: { grade: true },
      _sum: { points: true },
      _avg: { points: true }
    })

    // User Activity Heatmap
    const activityHeatmap = await getActivityHeatmap(startDate)

    return NextResponse.json({
      period,
      dateRange: {
        start: startDate,
        end: new Date()
      },
      userGrowth: userGrowthData,
      engagement: engagementMetrics,
      retention: retentionData,
      topActiveUsers: topActiveUsers.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        grade: user.grade,
        state: user.state,
        points: user.points,
        level: user.level,
        totalSubmissions: user._count.submissions,
        totalActions: user._count.userActions,
        recentEngagement: user.userEngagement[0] || null
      })),
      behavior: behaviorAnalysis,
      geographic: geographicDistribution.map(stat => ({
        state: stat.state,
        userCount: stat._count.state,
        totalPoints: stat._sum.points || 0,
        avgPoints: stat._sum.points ? Math.round((stat._sum.points / stat._count.state) * 100) / 100 : 0
      })),
      gradeLevel: gradeAnalysis.map(stat => ({
        grade: stat.grade,
        userCount: stat._count.grade,
        totalPoints: stat._sum.points || 0,
        avgPoints: Math.round((stat._avg.points || 0) * 100) / 100
      })),
      activityHeatmap
    })
  } catch (error) {
    console.error('Error fetching user analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getUserGrowthData(startDate: Date) {
  const dailyGrowth = await prisma.$queryRaw`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as new_users,
      SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as cumulative_users
    FROM users 
    WHERE role = 'student' 
      AND created_at >= ${startDate}
    GROUP BY DATE(created_at)
    ORDER BY date
  `
  
  return dailyGrowth
}

async function getEngagementMetrics(startDate: Date) {
  const engagement = await prisma.userEngagement.aggregate({
    where: {
      date: {
        gte: startDate
      }
    },
    _avg: {
      loginCount: true,
      pageViews: true,
      timeSpent: true,
      challengesStarted: true,
      challengesCompleted: true,
      submissionsMade: true,
      pointsEarned: true
    },
    _sum: {
      loginCount: true,
      pageViews: true,
      timeSpent: true,
      challengesStarted: true,
      challengesCompleted: true,
      submissionsMade: true,
      pointsEarned: true
    }
  })

  return {
    averages: {
      loginCount: Math.round((engagement._avg.loginCount || 0) * 100) / 100,
      pageViews: Math.round((engagement._avg.pageViews || 0) * 100) / 100,
      timeSpent: Math.round((engagement._avg.timeSpent || 0) * 100) / 100,
      challengesStarted: Math.round((engagement._avg.challengesStarted || 0) * 100) / 100,
      challengesCompleted: Math.round((engagement._avg.challengesCompleted || 0) * 100) / 100,
      submissionsMade: Math.round((engagement._avg.submissionsMade || 0) * 100) / 100,
      pointsEarned: Math.round((engagement._avg.pointsEarned || 0) * 100) / 100
    },
    totals: {
      loginCount: engagement._sum.loginCount || 0,
      pageViews: engagement._sum.pageViews || 0,
      timeSpent: engagement._sum.timeSpent || 0,
      challengesStarted: engagement._sum.challengesStarted || 0,
      challengesCompleted: engagement._sum.challengesCompleted || 0,
      submissionsMade: engagement._sum.submissionsMade || 0,
      pointsEarned: engagement._sum.pointsEarned || 0
    }
  }
}

async function getRetentionData(startDate: Date) {
  // Calculate user retention rates
  const totalUsers = await prisma.user.count({
    where: { role: 'student' }
  })

  const activeUsers = await prisma.user.count({
    where: {
      role: 'student',
      userActions: {
        some: {
          timestamp: {
            gte: startDate
          }
        }
      }
    }
  })

  const returningUsers = await prisma.user.count({
    where: {
      role: 'student',
      userActions: {
        some: {
          timestamp: {
            gte: startDate
          }
        }
      },
      createdAt: {
        lt: startDate
      }
    }
  })

  return {
    totalUsers,
    activeUsers,
    returningUsers,
    retentionRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 10000) / 100 : 0,
    returnRate: totalUsers > 0 ? Math.round((returningUsers / totalUsers) * 10000) / 100 : 0
  }
}

async function getUserBehaviorAnalysis(startDate: Date) {
  const actionCounts = await prisma.userAction.groupBy({
    by: ['action'],
    where: {
      timestamp: {
        gte: startDate
      }
    },
    _count: { action: true }
  })

  const pageViewCounts = await prisma.pageView.groupBy({
    by: ['page'],
    where: {
      timestamp: {
        gte: startDate
      }
    },
    _count: { page: true },
    _avg: { duration: true }
  })

  return {
    actions: actionCounts.map(stat => ({
      action: stat.action,
      count: stat._count.action
    })),
    pageViews: pageViewCounts.map(stat => ({
      page: stat.page,
      views: stat._count.page,
      avgDuration: Math.round((stat._avg.duration || 0) * 100) / 100
    }))
  }
}

async function getActivityHeatmap(startDate: Date) {
  const hourlyActivity = await prisma.userAction.groupBy({
    by: ['timestamp'],
    where: {
      timestamp: {
        gte: startDate
      }
    },
    _count: { timestamp: true }
  })

  // Group by hour of day
  const hourlyData = new Array(24).fill(0)
  hourlyActivity.forEach(activity => {
    const hour = new Date(activity.timestamp).getHours()
    hourlyData[hour] += activity._count.timestamp
  })

  return hourlyData
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
