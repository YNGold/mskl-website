'use client'

import { motion } from 'framer-motion'
import { Users, MessageCircle, Globe, Heart, Star, Zap } from 'lucide-react'
import Link from 'next/link'

const communityFeatures = [
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Form teams with students nationwide and solve challenges together',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: MessageCircle,
    title: 'Discussion Forums',
    description: 'Share ideas, ask questions, and learn from peers across the country',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Globe,
    title: 'National Network',
    description: 'Connect with bright minds from all 50 states and beyond',
    color: 'from-blue-500 to-orange-500'
  }
]

const testimonials = [
  {
    name: 'Alex Kim',
    grade: 11,
    state: 'Washington',
    content: 'MSKL.io connected me with amazing teammates from across the country. We won the quantum computing challenge together!',
    rating: 5
  },
  {
    name: 'Maria Garcia',
    grade: 10,
    state: 'Texas',
    content: 'The community here is incredible. I\'ve learned so much from other students and made friends for life.',
    rating: 5
  },
  {
    name: 'David Park',
    grade: 12,
    state: 'California',
    content: 'Being part of this community has opened so many doors. I got my internship through connections I made here.',
    rating: 5
  }
]

export function CommunitySection() {
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
            Join the <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Community</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with thousands of bright minds nationwide. Collaborate, learn, and grow together.
          </p>
        </motion.div>

        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {communityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 rounded-xl p-8 mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">2,847</div>
              <div className="text-gray-400">Active Students</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">156</div>
              <div className="text-gray-400">Teams Formed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">47</div>
              <div className="text-gray-400">States Represented</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">12.5K</div>
              <div className="text-gray-400">Messages Shared</div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            What Students Are Saying
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">Grade {testimonial.grade}, {testimonial.state}</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 rounded-xl p-8 max-w-3xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-orange-500 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Connect?
            </h3>
            
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already collaborating, learning, and growing together. 
              Your next great connection is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Join the Community
                </button>
              </Link>
              <Link href="/community">
                <button className="border-2 border-blue-500/50 hover:border-blue-400 text-blue-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                  Explore Forums
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 