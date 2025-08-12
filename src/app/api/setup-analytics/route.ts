import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  try {
    const authError = requireAdminAuth(request)
    if (authError) {
      return authError
    }

    // Get existing users and challenges for seeding
    const users = await prisma.user.findMany({
      where: { role: 'student' },
      take: 5
    })

    const challenges = await prisma.challenge.findMany({
      take: 3
    })

    if (users.length === 0 || challenges.length === 0) {
      return NextResponse.json({ 
        error: 'No users or challenges found. Please seed the database first.' 
      }, { status: 400 })
    }

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Clear existing analytics data (with error handling)
    try {
      await Promise.all([
        prisma.pageView.deleteMany(),
        prisma.userAction.deleteMany(),
        prisma.userEngagement.deleteMany(),
        prisma.challengeAnalytics.deleteMany(),
        prisma.conversionFunnel.deleteMany(),
        prisma.geographicAnalytics.deleteMany(),
        prisma.performanceMetrics.deleteMany()
      ])
    } catch (error) {
      console.log('Some analytics tables may not exist yet, continuing...')
    }

    // Create sample page views
    let pageViews = []
    try {
      pageViews = await Promise.all([
        prisma.pageView.create({
          data: {
            userId: users[0].id,
            sessionId: 'sample_session_1',
            page: '/dashboard',
            timestamp: today
          }
        }),
        prisma.pageView.create({
          data: {
            userId: users[1].id,
            sessionId: 'sample_session_2',
            page: '/challenges',
            timestamp: today
          }
        }),
        prisma.pageView.create({
          data: {
            userId: users[0].id,
            sessionId: 'sample_session_3',
            page: '/leaderboard',
            timestamp: yesterday
          }
        })
      ])
    } catch (error) {
      console.log('PageView table may not exist yet')
    }

    // Create sample user actions
    let userActions = []
    try {
      userActions = await Promise.all([
        prisma.userAction.create({
          data: {
            userId: users[0].id,
            action: 'user_login',
            timestamp: today
          }
        }),
        prisma.userAction.create({
          data: {
            userId: users[1].id,
            action: 'challenge_start',
            metadata: JSON.stringify({ challengeId: challenges[0].id }),
            timestamp: today
          }
        }),
        prisma.userAction.create({
          data: {
            userId: users[2].id,
            action: 'challenge_submit',
            metadata: JSON.stringify({ challengeId: challenges[0].id }),
            timestamp: today
          }
        }),
        prisma.userAction.create({
          data: {
            userId: users[0].id,
            action: 'points_earned',
            metadata: JSON.stringify({ points: 50 }),
            timestamp: yesterday
          }
        })
      ])
    } catch (error) {
      console.log('UserAction table may not exist yet')
    }

    // Create sample user engagement
    let userEngagement = []
    try {
      userEngagement = await Promise.all([
        prisma.userEngagement.create({
          data: {
            userId: users[0].id,
            date: today,
            loginCount: 3,
            pageViews: 15,
            timeSpent: 120,
            challengesStarted: 2,
            challengesCompleted: 1,
            submissionsMade: 1,
            pointsEarned: 50
          }
        }),
        prisma.userEngagement.create({
          data: {
            userId: users[1].id,
            date: today,
            loginCount: 2,
            pageViews: 8,
            timeSpent: 90,
            challengesStarted: 1,
            challengesCompleted: 0,
            submissionsMade: 0,
            pointsEarned: 25
          }
        }),
        prisma.userEngagement.create({
          data: {
            userId: users[2].id,
            date: today,
            loginCount: 4,
            pageViews: 22,
            timeSpent: 180,
            challengesStarted: 3,
            challengesCompleted: 2,
            submissionsMade: 2,
            pointsEarned: 75
          }
        })
      ])
    } catch (error) {
      console.log('UserEngagement table may not exist yet')
    }

    // Create sample challenge analytics
    let challengeAnalytics = []
    try {
      challengeAnalytics = await Promise.all([
        prisma.challengeAnalytics.create({
          data: {
            challengeId: challenges[0].id,
            totalViews: 45,
            totalStarts: 23,
            totalSubmissions: 18,
            avgCompletionTime: 45,
            successRate: 78.3,
            difficultyRating: 6.5
          }
        }),
        prisma.challengeAnalytics.create({
          data: {
            challengeId: challenges[1].id,
            totalViews: 32,
            totalStarts: 19,
            totalSubmissions: 15,
            avgCompletionTime: 38,
            successRate: 82.1,
            difficultyRating: 5.8
          }
        }),
        prisma.challengeAnalytics.create({
          data: {
            challengeId: challenges[2].id,
            totalViews: 28,
            totalStarts: 16,
            totalSubmissions: 12,
            avgCompletionTime: 52,
            successRate: 75.0,
            difficultyRating: 7.2
          }
        })
      ])
    } catch (error) {
      console.log('ChallengeAnalytics table may not exist yet')
    }

    // Create sample conversion funnel data
    let conversionFunnel = []
    try {
      conversionFunnel = await Promise.all([
        prisma.conversionFunnel.create({
          data: {
            stage: 'landing_page',
            visitors: 1000,
            conversions: 150,
            conversionRate: 15.0,
            date: today
          }
        }),
        prisma.conversionFunnel.create({
          data: {
            stage: 'signup',
            visitors: 150,
            conversions: 120,
            conversionRate: 80.0,
            date: today
          }
        }),
        prisma.conversionFunnel.create({
          data: {
            stage: 'first_login',
            visitors: 120,
            conversions: 95,
            conversionRate: 79.2,
            date: today
          }
        }),
        prisma.conversionFunnel.create({
          data: {
            stage: 'first_challenge',
            visitors: 95,
            conversions: 67,
            conversionRate: 70.5,
            date: today
          }
        })
      ])
    } catch (error) {
      console.log('ConversionFunnel table may not exist yet')
    }

    // Create sample geographic analytics
    let geographicAnalytics = []
    try {
      geographicAnalytics = await Promise.all([
        prisma.geographicAnalytics.create({
          data: {
            state: 'CA',
            date: today,
            totalUsers: 45,
            activeUsers: 32,
            totalSubmissions: 67,
            avgPoints: 125.5,
            avgEngagement: 78.3
          }
        }),
        prisma.geographicAnalytics.create({
          data: {
            state: 'NY',
            date: today,
            totalUsers: 38,
            activeUsers: 28,
            totalSubmissions: 52,
            avgPoints: 142.8,
            avgEngagement: 82.1
          }
        }),
        prisma.geographicAnalytics.create({
          data: {
            state: 'TX',
            date: today,
            totalUsers: 25,
            activeUsers: 18,
            totalSubmissions: 34,
            avgPoints: 98.3,
            avgEngagement: 65.7
          }
        })
      ])
    } catch (error) {
      console.log('GeographicAnalytics table may not exist yet')
    }

    // Create sample performance metrics
    let performanceMetrics = []
    try {
      performanceMetrics = await Promise.all([
        prisma.performanceMetrics.create({
          data: {
            metric: 'page_load_time',
            value: 1.2,
            unit: 'seconds',
            date: today
          }
        }),
        prisma.performanceMetrics.create({
          data: {
            metric: 'api_response_time',
            value: 0.8,
            unit: 'seconds',
            date: today
          }
        }),
        prisma.performanceMetrics.create({
          data: {
            metric: 'error_rate',
            value: 0.5,
            unit: 'percentage',
            date: today
          }
        })
      ])
    } catch (error) {
      console.log('PerformanceMetrics table may not exist yet')
    }

    const totalCreated = pageViews.length + userActions.length + userEngagement.length + 
                        challengeAnalytics.length + conversionFunnel.length + 
                        geographicAnalytics.length + performanceMetrics.length

    return NextResponse.json({
      message: totalCreated > 0 
        ? 'Analytics system setup completed successfully!' 
        : 'Analytics tables need to be created first. Please run the database migration.',
      stats: {
        pageViews: pageViews.length,
        userActions: userActions.length,
        userEngagement: userEngagement.length,
        challengeAnalytics: challengeAnalytics.length,
        conversionFunnel: conversionFunnel.length,
        geographicAnalytics: geographicAnalytics.length,
        performanceMetrics: performanceMetrics.length,
        totalCreated
      },
      nextSteps: totalCreated > 0 ? [
        '1. Go to the Analytics tab in the admin panel',
        '2. You should now see charts and statistics',
        '3. The data will update in real-time as users interact with the platform'
      ] : [
        '1. The analytics tables need to be created in the database first',
        '2. Please run the SQL commands in your Supabase dashboard',
        '3. Then try the setup again'
      ]
    })

  } catch (error) {
    console.error('Error setting up analytics:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
