'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, TrendingUp, MapPin, GraduationCap } from 'lucide-react'
import Link from 'next/link'

const topScorers = [
  {
    rank: 1,
    username: 'sarah_science',
    grade: 11,
    state: 'California',
    points: 2840,
    medal: '🥇'
  },
  {
    rank: 2,
    username: 'marcus_coder',
    grade: 10,
    state: 'Texas',
    points: 2715,
    medal: '🥈'
  },
  {
    rank: 3,
    username: 'emma_math',
    grade: 12,
    state: 'New York',
    points: 2650,
    medal: '🥉'
  },
  {
    rank: 4,
    username: 'alex_innovator',
    grade: 11,
    state: 'Washington',
    points: 2580,
    medal: '🏅'
  },
  {
    rank: 5,
    username: 'jordan_tech',
    grade: 10,
    state: 'Florida',
    points: 2495,
    medal: '🏅'
  }
]

export function LeaderboardPreview() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900/20 to-orange-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Top <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Performers</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See who's leading the competition and get inspired to climb the ranks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Leaderboard</h3>
              </div>
              <Link href="/leaderboard" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View Full →
              </Link>
            </div>

            <div className="space-y-4">
              {topScorers.map((scorer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' 
                      : index === 1 
                      ? 'bg-gradient-to-r from-gray-500/10 to-gray-400/10 border border-gray-500/20'
                      : index === 2
                      ? 'bg-gradient-to-r from-amber-600/10 to-yellow-500/10 border border-amber-500/20'
                      : 'bg-black/20 border border-blue-500/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{scorer.medal}</div>
                    <div className="text-2xl font-bold text-gray-400">#{scorer.rank}</div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-white">@{scorer.username}</h4>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <GraduationCap className="w-3 h-3" />
                        <span className="text-xs">Grade {scorer.grade}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{scorer.state}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-400">{scorer.points}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats and Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Competition Stats */}
            <div className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <span>Competition Stats</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">2,847</div>
                  <div className="text-gray-400 text-sm">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">47</div>
                  <div className="text-gray-400 text-sm">States Represented</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">156</div>
                  <div className="text-gray-400 text-sm">Challenges Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">$127K</div>
                  <div className="text-gray-400 text-sm">Total Prizes Awarded</div>
                </div>
              </div>
            </div>

            {/* How to Climb */}
            <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                How to Climb the Ranks
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
<span className="text-white text-xs font-bold">1</span>
</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Complete Challenges</h4>
                    <p className="text-gray-400 text-sm">Solve problems correctly to earn points</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
<span className="text-white text-xs font-bold">2</span>
</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Speed Matters</h4>
                    <p className="text-gray-400 text-sm">Faster solutions earn bonus points</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
<span className="text-white text-xs font-bold">3</span>
</div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Team Up</h4>
                    <p className="text-gray-400 text-sm">Collaborate for higher scores</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Link href="/signup">
                <button className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Join the Competition
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 