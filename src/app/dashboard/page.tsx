'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Target, Trophy, TrendingUp, Calendar, Users, Award, Loader2 } from 'lucide-react'

// Force dynamic rendering to prevent pre-rendering
export const dynamic = 'force-dynamic'

interface UserStats {
  points: number
  rank: number
  challengesCompleted: number
  teamMembers: number
}

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: string
  points: number
  category: string
  endDate: string
  progress: number
}

interface Activity {
  id: string
  type: string
  title: string
  description: string
  points?: number
  date: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated' || !session) {
    // Use useEffect to redirect to avoid hydration issues
    useEffect(() => {
      router.push('/login')
    }, [router])
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.id) return

      try {
        // Fetch user stats
        const statsResponse = await fetch(`/api/users/${session.user.id}`)
        if (statsResponse.ok) {
          const userData = await statsResponse.json()
          setStats({
            points: userData.user.points || 0,
            rank: 42, // TODO: Calculate from leaderboard
            challengesCompleted: userData.recentSubmissions?.length || 0,
            teamMembers: userData.teams?.length || 0
          })
        }

        // Fetch current challenge
        const challengesResponse = await fetch('/api/challenges?active=true')
        if (challengesResponse.ok) {
          const challenges = await challengesResponse.json()
          if (challenges.length > 0) {
            setCurrentChallenge({
              ...challenges[0],
              progress: 65 // TODO: Calculate from user progress
            })
          }
        }

        // Fetch recent activity
        const activityResponse = await fetch(`/api/submissions?userId=${session.user.id}&limit=5`)
        if (activityResponse.ok) {
          const submissions = await activityResponse.json()
          setRecentActivity(submissions.map((sub: any) => ({
            id: sub.id,
            type: 'submission',
            title: `Completed "${sub.challenge.title}" challenge`,
            description: `Earned ${sub.score || 0} points`,
            points: sub.score,
            date: sub.submittedAt
          })))
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [session])
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🔒 PROTECTED DASHBOARD - Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {session?.user?.name || session?.user?.username || 'Student'}
            </span>
          </h1>
          <p className="text-gray-400">Track your progress and stay ahead of the competition</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="ml-2 text-gray-400">Loading your dashboard...</span>
          </div>
        ) : (

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Points</p>
                <p className="text-2xl font-bold text-white">{stats?.points?.toLocaleString() || '0'}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rank</p>
                <p className="text-2xl font-bold text-white">#{stats?.rank || 'N/A'}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Challenges Completed</p>
                <p className="text-2xl font-bold text-white">{stats?.challengesCompleted || '0'}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Team Members</p>
                <p className="text-2xl font-bold text-white">{stats?.teamMembers || '0'}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Current Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Current Challenge</h2>
            <div className="flex items-center space-x-2 text-blue-400">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Ends in 3 days</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {currentChallenge?.title || 'No Active Challenge'}
              </h3>
              <p className="text-gray-300 mb-6">
                {currentChallenge?.description || 'Check back soon for new challenges!'}
              </p>
              
              {currentChallenge && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Difficulty: {currentChallenge.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-gray-300">Points: {currentChallenge.points}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Category: {currentChallenge.category}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {currentChallenge && (
                <>
                  <div className="bg-black/20 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Your Progress</h4>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: `${currentChallenge.progress}%` }}></div>
                    </div>
                    <p className="text-gray-400 text-sm">{currentChallenge.progress}% complete</p>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200">
                    Continue Challenge
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-sm">{activity.description} • {new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No recent activity. Start your first challenge!</p>
              </div>
            )}
          </div>
        </motion.div>
        )}
      </div>
    </div>
  )
} 