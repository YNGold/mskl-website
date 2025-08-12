'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, Users, Target, TrendingUp, MapPin, Clock, 
  Activity, Award, Eye, Download, Calendar, Filter,
  ChevronDown, ChevronUp, RefreshCw, ExternalLink
} from 'lucide-react'

interface AnalyticsData {
  period: string
  dateRange: {
    start: string
    end: string
  }
  overview: {
    totalUsers: number
    newUsers: number
    activeUsers: number
    userGrowthRate: number
    totalChallenges: number
    activeChallenges: number
    totalSubmissions: number
    submissionGrowthRate: number
    totalPageViews: number
    totalUserActions: number
  }
  geographic: Array<{
    state: string
    userCount: number
  }>
  gradeDistribution: Array<{
    grade: number
    userCount: number
  }>
  topChallenges: Array<{
    id: string
    title: string
    submissions: number
    analytics: any
  }>
  conversionFunnel: any[]
  recentActivity: Array<{
    id: string
    action: string
    timestamp: string
    user: {
      name: string
      email: string
    } | null
  }>
  performance: {
    avgPageLoadTime: number
    avgApiResponseTime: number
    errorRate: number
  }
}

interface UserAnalytics {
  period: string
  userGrowth: any[]
  engagement: {
    averages: {
      loginCount: number
      pageViews: number
      timeSpent: number
      challengesStarted: number
      challengesCompleted: number
      submissionsMade: number
      pointsEarned: number
    }
    totals: {
      loginCount: number
      pageViews: number
      timeSpent: number
      challengesStarted: number
      challengesCompleted: number
      submissionsMade: number
      pointsEarned: number
    }
  }
  retention: {
    totalUsers: number
    activeUsers: number
    returningUsers: number
    retentionRate: number
    returnRate: number
  }
  topActiveUsers: Array<{
    id: string
    name: string
    email: string
    grade: number
    state: string
    points: number
    level: number
    totalSubmissions: number
    totalActions: number
    recentEngagement: any
  }>
  behavior: {
    actions: Array<{
      action: string
      count: number
    }>
    pageViews: Array<{
      page: string
      views: number
      avgDuration: number
    }>
  }
  geographic: Array<{
    state: string
    userCount: number
    totalPoints: number
    avgPoints: number
  }>
  gradeLevel: Array<{
    grade: number
    userCount: number
    totalPoints: number
    avgPoints: number
  }>
  activityHeatmap: number[]
}

interface ChallengeAnalytics {
  period: string
  performance: {
    totalChallenges: number
    activeChallenges: number
    totalSubmissions: number
    avgSubmissionsPerChallenge: number
    avgSuccessRate: number
  }
  engagement: {
    dailySubmissions: Array<{
      date: string
      count: number
    }>
    challengeEngagement: any[]
  }
  categories: Array<{
    id: string
    name: string
    challengeCount: number
    totalSubmissions: number
    avgSubmissionsPerChallenge: number
  }>
  difficulty: Record<string, any>
  topChallenges: Array<{
    id: string
    title: string
    category: string
    grade: number
    status: string
    submissions: number
    analytics: any
    createdAt: string
  }>
  completionRates: Array<{
    title: string
    completionRate: number
  }>
  geographic: Array<{
    state: string
    totalSubmissions: number
    successfulSubmissions: number
    uniqueChallenges: number
    successRate: number
  }>
}

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [period, setPeriod] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overviewData, setOverviewData] = useState<AnalyticsData | null>(null)
  const [userData, setUserData] = useState<UserAnalytics | null>(null)
  const [challengeData, setChallengeData] = useState<ChallengeAnalytics | null>(null)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'challenges', label: 'Challenges', icon: Target }
  ]

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [overviewRes, usersRes, challengesRes] = await Promise.all([
        fetch(`/api/analytics/overview?period=${period}`),
        fetch(`/api/analytics/users?period=${period}`),
        fetch(`/api/analytics/challenges?period=${period}`)
      ])

      if (overviewRes.ok) {
        const overview = await overviewRes.json()
        setOverviewData(overview)
      }

      if (usersRes.ok) {
        const users = await usersRes.json()
        setUserData(users)
      }

      if (challengesRes.ok) {
        const challenges = await challengesRes.json()
        setChallengeData(challenges)
      }
    } catch (err) {
      setError('Failed to fetch analytics data')
      console.error('Error fetching analytics:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
  }

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return 'text-green-400'
    if (rate < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={fetchData}
          className="mt-2 text-sm text-red-300 hover:text-red-200"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400">Comprehensive insights into platform performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'overview' && overviewData && (
        <OverviewTab data={overviewData} />
      )}
      
      {activeTab === 'users' && userData && (
        <UsersTab data={userData} />
      )}
      
      {activeTab === 'challenges' && challengeData && (
        <ChallengesTab data={challengeData} />
      )}
    </div>
  )
}

function OverviewTab({ data }: { data: AnalyticsData }) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
  }

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return 'text-green-400'
    if (rate < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  const metrics = [
    {
      label: 'Total Users',
      value: formatNumber(data.overview.totalUsers),
      icon: Users,
      color: 'text-blue-400'
    },
    {
      label: 'New Users',
      value: formatNumber(data.overview.newUsers),
      change: formatPercentage(data.overview.userGrowthRate),
      changeColor: getGrowthColor(data.overview.userGrowthRate),
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      label: 'Active Users',
      value: formatNumber(data.overview.activeUsers),
      icon: Activity,
      color: 'text-purple-400'
    },
    {
      label: 'Total Submissions',
      value: formatNumber(data.overview.totalSubmissions),
      change: formatPercentage(data.overview.submissionGrowthRate),
      changeColor: getGrowthColor(data.overview.submissionGrowthRate),
      icon: Target,
      color: 'text-orange-400'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{metric.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  {metric.change && (
                    <p className={`text-sm mt-1 ${metric.changeColor}`}>
                      {metric.change}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg bg-white/10 ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Geographic Distribution
          </h3>
          <div className="space-y-3">
            {data.geographic.slice(0, 5).map((state, index) => (
              <div key={state.state} className="flex items-center justify-between">
                <span className="text-gray-300">{state.state}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(state.userCount / Math.max(...data.geographic.map(s => s.userCount))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{state.userCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Challenges */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Top Challenges
          </h3>
          <div className="space-y-3">
            {data.topChallenges.slice(0, 5).map((challenge, index) => (
              <div key={challenge.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate">{challenge.title}</p>
                  <p className="text-gray-400 text-sm">{challenge.submissions} submissions</p>
                </div>
                <div className="text-right">
                  <span className="text-green-400 text-sm">
                    {challenge.analytics?.successRate ? `${challenge.analytics.successRate.toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {data.recentActivity.slice(0, 10).map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-white">
                    {activity.user ? activity.user.name : 'Anonymous'} 
                    <span className="text-gray-400 ml-2">{activity.action}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UsersTab({ data }: { data: UserAnalytics }) {
  return (
    <div className="space-y-6">
      {/* User Growth Chart */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Chart placeholder - User growth over time
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(data.engagement.averages).map(([key, value]) => (
          <div key={key} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Top Active Users */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Top Active Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/10">
                <th className="pb-3">User</th>
                <th className="pb-3">Grade</th>
                <th className="pb-3">State</th>
                <th className="pb-3">Points</th>
                <th className="pb-3">Submissions</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.topActiveUsers.slice(0, 10).map((user) => (
                <tr key={user.id} className="border-b border-white/5">
                  <td className="py-3">
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 text-gray-300">{user.grade}</td>
                  <td className="py-3 text-gray-300">{user.state}</td>
                  <td className="py-3 text-white font-medium">{user.points}</td>
                  <td className="py-3 text-gray-300">{user.totalSubmissions}</td>
                  <td className="py-3 text-gray-300">{user.totalActions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ChallengesTab({ data }: { data: ChallengeAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(data.performance).map(([key, value]) => (
          <div key={key} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold text-white mt-1">
              {typeof value === 'number' ? value.toFixed(1) : value}
            </p>
          </div>
        ))}
      </div>

      {/* Category Performance */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Category Performance</h3>
        <div className="space-y-3">
          {data.categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{category.name}</p>
                <p className="text-gray-400 text-sm">{category.challengeCount} challenges</p>
              </div>
              <div className="text-right">
                <p className="text-white">{category.totalSubmissions} submissions</p>
                <p className="text-gray-400 text-sm">
                  {category.avgSubmissionsPerChallenge.toFixed(1)} avg per challenge
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Challenges */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Top Performing Challenges</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/10">
                <th className="pb-3">Challenge</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Grade</th>
                <th className="pb-3">Submissions</th>
                <th className="pb-3">Success Rate</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.topChallenges.slice(0, 10).map((challenge) => (
                <tr key={challenge.id} className="border-b border-white/5">
                  <td className="py-3">
                    <p className="text-white font-medium">{challenge.title}</p>
                  </td>
                  <td className="py-3 text-gray-300">{challenge.category}</td>
                  <td className="py-3 text-gray-300">{challenge.grade}</td>
                  <td className="py-3 text-white font-medium">{challenge.submissions}</td>
                  <td className="py-3 text-gray-300">
                    {challenge.analytics?.successRate ? `${challenge.analytics.successRate.toFixed(1)}%` : 'N/A'}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      challenge.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {challenge.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
