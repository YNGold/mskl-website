'use client'

import { motion } from 'framer-motion'
import { Award, GraduationCap, Building, Globe, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Advisor {
  id: string
  name: string
  title: string
  company: string
  expertise: string
  bio: string
  achievements: string[]
  imageUrl: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export function AdvisoryBoard() {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await fetch('/api/advisors?active=true')
        if (response.ok) {
          const data = await response.json()
          setAdvisors(data)
        }
      } catch (error) {
        console.error('Error fetching advisors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdvisors()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading advisory board...</p>
          </div>
        </div>
      </section>
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
            Meet Our <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Advisory Circle</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn from industry leaders, researchers, and innovators who are shaping the future of STEM education.
          </p>
        </motion.div>

        {advisors.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No advisors available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advisors.map((advisor, index) => (
              <motion.div
                key={advisor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300 group"
              >
                {/* Profile Image Placeholder */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {advisor.imageUrl ? (
                    <img 
                      src={advisor.imageUrl} 
                      alt={advisor.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="w-12 h-12 text-white" />
                  )}
                </div>

                {/* Name and Title */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{advisor.name}</h3>
                  <p className="text-blue-400 font-medium mb-1">{advisor.title}</p>
                  <div className="flex items-center justify-center space-x-1 text-gray-400 text-sm">
                    <Building className="w-4 h-4" />
                    <span>{advisor.company}</span>
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-4">
                  <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-sm font-medium">{advisor.expertise}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {advisor.bio}
                </p>

                {/* Achievements */}
                <div className="space-y-2">
                  {advisor.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <Award className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-gray-400">{achievement}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Learn from the Best
            </h3>
            <p className="text-gray-300 mb-6">
              Our advisory board members regularly host exclusive workshops, mentor students, 
              and provide insights into cutting-edge STEM fields.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              Join Mentor Sessions
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 