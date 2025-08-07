'use client'

import { motion } from 'framer-motion'
import { Clock, Target, Zap, Calendar } from 'lucide-react'
import Countdown from 'react-countdown'

export function UpcomingChallenges() {
  // Set the next challenge date (example: 2 weeks from now)
  const nextChallengeDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

  const countdownRenderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <span className="text-2xl font-bold text-green-400">Challenge is Live!</span>
    }

    return (
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-blue-400">{days}</div>
          <div className="text-gray-400 text-sm">Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-orange-400">{hours}</div>
          <div className="text-gray-400 text-sm">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-blue-400">{minutes}</div>
          <div className="text-gray-400 text-sm">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-orange-400">{seconds}</div>
          <div className="text-gray-400 text-sm">Seconds</div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Next <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Challenge</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get ready for the next mission. The countdown is on!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Mission Countdown
              </h3>
              <p className="text-gray-400">
                Next challenge drops in:
              </p>
            </div>

            <div className="mb-8">
              <Countdown
                date={nextChallengeDate}
                renderer={countdownRenderer}
              />
            </div>

            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm">
                  {nextChallengeDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Challenge Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8"
          >
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-6 h-6 text-blue-400" />
                <span className="text-blue-300 font-medium">Mission Preview</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Quantum Computing Challenge
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Design and implement a quantum algorithm to solve a complex optimization problem. 
                This challenge will test your understanding of quantum mechanics, linear algebra, 
                and algorithmic thinking.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Difficulty: Advanced</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-gray-300">Category: Computer Science</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Points: 500</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-gray-300">Team Size: 1-3 students</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-semibold">Bonus Opportunity</span>
              </div>
              <p className="text-gray-300 text-sm">
                First place winners get exclusive access to our Quantum Computing Workshop 
                with industry experts from leading tech companies.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Don't Miss Out!
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of students preparing for this challenge. 
              Start studying now and be ready when the mission drops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                Get Notified
              </button>
              <button className="border-2 border-blue-500/50 hover:border-blue-400 text-blue-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                View Past Challenges
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 