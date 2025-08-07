'use client'

import { motion } from 'framer-motion'
import { Award, DollarSign, Users, Star, Zap, Gift } from 'lucide-react'

const prizes = [
  {
    icon: DollarSign,
    title: 'Cash Prizes',
    description: 'Win up to $5,000 in cash prizes for top performers',
    value: '$5,000',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Users,
    title: 'Exclusive Events',
    description: 'Access to workshops with industry leaders and tech companies',
    value: 'VIP Access',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Star,
    title: 'Scholarships',
    description: 'College scholarships and educational opportunities',
    value: '$25,000',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Tech Gadgets',
    description: 'Latest laptops, tablets, and STEM equipment',
    value: 'Latest Tech',
    color: 'from-yellow-500 to-orange-500'
  }
]

const events = [
  {
    title: 'Google AI Workshop',
    description: 'Learn from Google engineers about machine learning and AI',
    date: 'March 15, 2024',
    attendees: '50 students'
  },
  {
    title: 'NASA Space Camp',
    description: 'Exclusive 3-day space exploration experience',
    date: 'April 20, 2024',
    attendees: '25 students'
  },
  {
    title: 'MIT Research Lab Tour',
    description: 'Behind-the-scenes tour of cutting-edge research facilities',
    date: 'May 10, 2024',
    attendees: '30 students'
  }
]

export function PrizesSection() {
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
            Prizes & <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Events</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Win amazing prizes and unlock exclusive events that will shape your future in STEM.
          </p>
        </motion.div>

        {/* Prizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {prizes.map((prize, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${prize.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <prize.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {prize.title}
              </h3>
              
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                {prize.description}
              </p>

              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                <Award className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-semibold text-sm">
                  {prize.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Exclusive Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Exclusive <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Events</span>
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Unlock access to exclusive events and workshops with industry leaders, 
              researchers, and tech companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Gift className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-medium text-sm">Exclusive Event</span>
                </div>
                
                <h4 className="text-xl font-semibold text-white mb-3">
                  {event.title}
                </h4>
                
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-300">{event.attendees}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Past Winners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Recent Winners
            </h3>
            <p className="text-gray-300">
              Meet some of our recent challenge winners and see what they've accomplished.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">🥇</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Sarah Chen</h4>
              <p className="text-gray-400 text-sm mb-2">Grade 11, California</p>
              <p className="text-purple-300 text-sm font-medium">Won $5,000 + Google Internship</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">🥈</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Marcus Rodriguez</h4>
              <p className="text-gray-400 text-sm mb-2">Grade 10, Texas</p>
              <p className="text-purple-300 text-sm font-medium">Won $3,000 + MIT Workshop</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">🥉</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Emma Thompson</h4>
              <p className="text-gray-400 text-sm mb-2">Grade 12, New York</p>
              <p className="text-purple-300 text-sm font-medium">Won $1,000 + NASA Tour</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 