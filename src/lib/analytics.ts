import { prisma } from './prisma'

export interface AnalyticsEvent {
  userId?: string
  sessionId: string
  action: string
  page?: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  referrer?: string
}

export class AnalyticsTracker {
  static async trackPageView(event: AnalyticsEvent) {
    try {
      await prisma.pageView.create({
        data: {
          userId: event.userId,
          sessionId: event.sessionId,
          page: event.page || '',
          referrer: event.referrer,
          userAgent: event.userAgent,
          ipAddress: event.ipAddress,
          timestamp: new Date()
        }
      })
    } catch (error) {
      console.error('Error tracking page view:', error)
    }
  }

  static async trackUserAction(event: AnalyticsEvent) {
    try {
      await prisma.userAction.create({
        data: {
          userId: event.userId || 'anonymous',
          action: event.action,
          metadata: event.metadata ? JSON.stringify(event.metadata) : null,
          ipAddress: event.ipAddress,
          timestamp: new Date()
        }
      })
    } catch (error) {
      console.error('Error tracking user action:', error)
    }
  }

  static async updateUserEngagement(userId: string, engagementData: {
    loginCount?: number
    pageViews?: number
    timeSpent?: number
    challengesStarted?: number
    challengesCompleted?: number
    submissionsMade?: number
    pointsEarned?: number
  }) {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const existingEngagement = await prisma.userEngagement.findFirst({
        where: {
          userId,
          date: today
        }
      })

      if (existingEngagement) {
        await prisma.userEngagement.update({
          where: { id: existingEngagement.id },
          data: {
            loginCount: { increment: engagementData.loginCount || 0 },
            pageViews: { increment: engagementData.pageViews || 0 },
            timeSpent: { increment: engagementData.timeSpent || 0 },
            challengesStarted: { increment: engagementData.challengesStarted || 0 },
            challengesCompleted: { increment: engagementData.challengesCompleted || 0 },
            submissionsMade: { increment: engagementData.submissionsMade || 0 },
            pointsEarned: { increment: engagementData.pointsEarned || 0 }
          }
        })
      } else {
        await prisma.userEngagement.create({
          data: {
            userId,
            date: today,
            loginCount: engagementData.loginCount || 0,
            pageViews: engagementData.pageViews || 0,
            timeSpent: engagementData.timeSpent || 0,
            challengesStarted: engagementData.challengesStarted || 0,
            challengesCompleted: engagementData.challengesCompleted || 0,
            submissionsMade: engagementData.submissionsMade || 0,
            pointsEarned: engagementData.pointsEarned || 0
          }
        })
      }
    } catch (error) {
      console.error('Error updating user engagement:', error)
    }
  }

  static async updateChallengeAnalytics(challengeId: string, analyticsData: {
    totalViews?: number
    totalStarts?: number
    totalSubmissions?: number
    avgCompletionTime?: number
    successRate?: number
    difficultyRating?: number
  }) {
    try {
      const existingAnalytics = await prisma.challengeAnalytics.findUnique({
        where: { challengeId }
      })

      if (existingAnalytics) {
        await prisma.challengeAnalytics.update({
          where: { id: existingAnalytics.id },
          data: {
            totalViews: { increment: analyticsData.totalViews || 0 },
            totalStarts: { increment: analyticsData.totalStarts || 0 },
            totalSubmissions: { increment: analyticsData.totalSubmissions || 0 },
            avgCompletionTime: analyticsData.avgCompletionTime,
            successRate: analyticsData.successRate,
            difficultyRating: analyticsData.difficultyRating,
            lastUpdated: new Date()
          }
        })
      } else {
        await prisma.challengeAnalytics.create({
          data: {
            challengeId,
            totalViews: analyticsData.totalViews || 0,
            totalStarts: analyticsData.totalStarts || 0,
            totalSubmissions: analyticsData.totalSubmissions || 0,
            avgCompletionTime: analyticsData.avgCompletionTime,
            successRate: analyticsData.successRate,
            difficultyRating: analyticsData.difficultyRating,
            lastUpdated: new Date()
          }
        })
      }
    } catch (error) {
      console.error('Error updating challenge analytics:', error)
    }
  }

  static async trackConversionFunnel(stage: string, visitors: number, conversions: number) {
    try {
      const conversionRate = visitors > 0 ? (conversions / visitors) * 100 : 0

      await prisma.conversionFunnel.create({
        data: {
          stage,
          visitors,
          conversions,
          conversionRate,
          date: new Date()
        }
      })
    } catch (error) {
      console.error('Error tracking conversion funnel:', error)
    }
  }

  static async trackPerformanceMetric(metric: string, value: number, unit: string) {
    try {
      await prisma.performanceMetrics.create({
        data: {
          metric,
          value,
          unit,
          date: new Date()
        }
      })
    } catch (error) {
      console.error('Error tracking performance metric:', error)
    }
  }

  static async updateGeographicAnalytics(state: string, analyticsData: {
    totalUsers?: number
    activeUsers?: number
    totalSubmissions?: number
    avgPoints?: number
    avgEngagement?: number
  }) {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const existingAnalytics = await prisma.geographicAnalytics.findFirst({
        where: {
          state,
          date: today
        }
      })

      if (existingAnalytics) {
        await prisma.geographicAnalytics.update({
          where: { id: existingAnalytics.id },
          data: {
            totalUsers: analyticsData.totalUsers || existingAnalytics.totalUsers,
            activeUsers: analyticsData.activeUsers || existingAnalytics.activeUsers,
            totalSubmissions: analyticsData.totalSubmissions || existingAnalytics.totalSubmissions,
            avgPoints: analyticsData.avgPoints || existingAnalytics.avgPoints,
            avgEngagement: analyticsData.avgEngagement || existingAnalytics.avgEngagement
          }
        })
      } else {
        await prisma.geographicAnalytics.create({
          data: {
            state,
            date: today,
            totalUsers: analyticsData.totalUsers || 0,
            activeUsers: analyticsData.activeUsers || 0,
            totalSubmissions: analyticsData.totalSubmissions || 0,
            avgPoints: analyticsData.avgPoints || 0,
            avgEngagement: analyticsData.avgEngagement || 0
          }
        })
      }
    } catch (error) {
      console.error('Error updating geographic analytics:', error)
    }
  }
}

// Common tracking events
export const AnalyticsEvents = {
  // User actions
  USER_LOGIN: 'user_login',
  USER_SIGNUP: 'user_signup',
  USER_LOGOUT: 'user_logout',
  
  // Challenge actions
  CHALLENGE_VIEW: 'challenge_view',
  CHALLENGE_START: 'challenge_start',
  CHALLENGE_SUBMIT: 'challenge_submit',
  CHALLENGE_COMPLETE: 'challenge_complete',
  
  // Page views
  PAGE_DASHBOARD: 'page_dashboard',
  PAGE_CHALLENGES: 'page_challenges',
  PAGE_LEADERBOARD: 'page_leaderboard',
  PAGE_COMMUNITY: 'page_community',
  PAGE_PROFILE: 'page_profile',
  
  // Engagement actions
  POINTS_EARNED: 'points_earned',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  
  // System actions
  EMAIL_SENT: 'email_sent',
  EMAIL_OPENED: 'email_opened',
  EMAIL_CLICKED: 'email_clicked'
}

// Utility function to generate session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Utility function to get client IP from request
export function getClientIP(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  return undefined
}
