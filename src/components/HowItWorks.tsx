'use client'

import { motion } from 'framer-motion'
import { UserPlus, Target, Users, Trophy, TrendingUp } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your account and get ready to join the challenge',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Target,
    title: 'Solve Missions & Earn Points',
    description: 'Tackle exciting challenges and earn points for your solutions',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Trophy,
    title: 'Win Prizes & Climb Leaderboard',
    description: 'Compete with peers, win amazing prizes, and see your ranking rise',
    color: 'from-purple-500 to-pink-500'
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join students from across the country in solving exciting challenges. 
            Here's how you can get started and make your mark.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#08c1be]/50 to-[#059595]/50 z-0 transform -translate-y-1/2">
                  <div className="absolute right-0 w-2 h-2 bg-[#08c1be] rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                </div>
              )}

              <div className="relative z-10 bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-500/40 transition-all duration-300 group">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Connection Lines */}
        <div className="lg:hidden mt-8">
          <div className="flex justify-center">
            <div className="w-0.5 h-32 bg-gradient-to-b from-purple-500/50 to-pink-500/50"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 