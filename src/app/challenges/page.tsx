'use client'

import { Metadata } from 'next'
import { useActionHandler } from '@/utils/actionHandler'

export default function ChallengesPage() {
  const { handleAction } = useActionHandler()
  const currentChallenges = [
    {
      id: 1,
      title: "Sustainable Energy Solutions",
      category: "Science",
      difficulty: "Advanced",
      points: 500,
      deadline: "2024-02-15",
      participants: 234,
      description: "Design an innovative solution for renewable energy storage that can be implemented in urban areas.",
      tags: ["Physics", "Engineering", "Sustainability"],
      status: "active"
    },
    {
      id: 2,
      title: "Mathematical Modeling Challenge",
      category: "Math",
      difficulty: "Intermediate",
      points: 300,
      deadline: "2024-02-10",
      participants: 156,
      description: "Create a mathematical model to predict traffic patterns and optimize city planning.",
      tags: ["Calculus", "Statistics", "Optimization"],
      status: "active"
    },
    {
      id: 3,
      title: "AI-Powered Healthcare",
      category: "Innovation",
      difficulty: "Advanced",
      points: 600,
      deadline: "2024-02-20",
      participants: 89,
      description: "Develop an AI algorithm to assist in early disease detection using medical imaging.",
      tags: ["Machine Learning", "Healthcare", "Computer Vision"],
      status: "active"
    }
  ]

  const upcomingChallenges = [
    {
      id: 4,
      title: "Climate Change Mitigation",
      category: "Science",
      difficulty: "Expert",
      points: 800,
      startDate: "2024-02-25",
      description: "Propose comprehensive strategies to reduce carbon emissions in your community.",
      tags: ["Environmental Science", "Policy", "Innovation"]
    },
    {
      id: 5,
      title: "Quantum Computing Applications",
      category: "Innovation",
      difficulty: "Advanced",
      points: 700,
      startDate: "2024-03-01",
      description: "Explore practical applications of quantum computing in cryptography or optimization.",
      tags: ["Quantum Physics", "Computer Science", "Cryptography"]
    },
    {
      id: 6,
      title: "Mathematical Art",
      category: "Math",
      difficulty: "Intermediate",
      points: 400,
      startDate: "2024-03-05",
      description: "Create beautiful mathematical art using fractals, tessellations, or geometric patterns.",
      tags: ["Geometry", "Art", "Creative Math"]
    }
  ]

  const challengeCategories = [
    { name: "All", count: 6, active: true },
    { name: "Math", count: 2, active: false },
    { name: "Science", count: 2, active: false },
    { name: "Innovation", count: 2, active: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-orange-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Challenges</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Take on real-world STEM challenges and compete with exceptional students nationwide. 
              Solve complex problems, showcase your skills, and earn points towards amazing prizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105">
                Start a Challenge
              </button>
              <button className="px-8 py-3 border border-blue-500 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/10 transition-all duration-200">
                View Past Solutions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2">
          {challengeCategories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                category.active
                  ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Current Challenges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Current Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  challenge.category === "Math" ? "bg-blue-500/20 text-blue-300" :
                  challenge.category === "Science" ? "bg-green-500/20 text-green-300" :
                  "bg-purple-500/20 text-purple-300"
                }`}>
                  {challenge.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  challenge.difficulty === "Advanced" ? "bg-orange-500/20 text-orange-300" :
                  challenge.difficulty === "Expert" ? "bg-red-500/20 text-red-300" :
                  "bg-green-500/20 text-green-300"
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">{challenge.title}</h3>
              <p className="text-gray-300 mb-4">{challenge.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {challenge.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-blue-400 font-bold">{challenge.points} pts</div>
                <div className="text-gray-400 text-sm">{challenge.participants} participants</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400 text-sm">Deadline: {challenge.deadline}</div>
                <div className="text-green-400 text-sm">● Active</div>
              </div>
              <button 
                onClick={() => handleAction('start challenge', `/challenges/${challenge.id}`)}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-orange-700 transition-all duration-200"
              >
                Start Challenge
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Challenges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Upcoming Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  challenge.category === "Math" ? "bg-blue-500/20 text-blue-300" :
                  challenge.category === "Science" ? "bg-green-500/20 text-green-300" :
                  "bg-purple-500/20 text-purple-300"
                }`}>
                  {challenge.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  challenge.difficulty === "Advanced" ? "bg-orange-500/20 text-orange-300" :
                  challenge.difficulty === "Expert" ? "bg-red-500/20 text-red-300" :
                  "bg-green-500/20 text-green-300"
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">{challenge.title}</h3>
              <p className="text-gray-300 mb-4">{challenge.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {challenge.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-blue-400 font-bold">{challenge.points} pts</div>
                <div className="text-gray-400 text-sm">Starts: {challenge.startDate}</div>
              </div>
              <button 
                onClick={() => handleAction('set reminder for upcoming challenge', `/challenges/${challenge.id}`)}
                className="w-full px-4 py-2 border border-blue-500 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/10 transition-all duration-200"
              >
                Set Reminder
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
             <div className="text-3xl font-bold text-blue-400 mb-2">479</div>
             <div className="text-gray-300">Active Participants</div>
           </div>
           <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
             <div className="text-3xl font-bold text-orange-400 mb-2">156</div>
             <div className="text-gray-300">Solutions Submitted</div>
           </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">2,847</div>
            <div className="text-gray-300">Total Points Awarded</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">23</div>
            <div className="text-gray-300">Challenges Completed</div>
          </div>
        </div>
      </div>

      {/* How Challenges Work */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">How Challenges Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              1
            </div>
            <div className="text-white font-semibold text-lg mb-2">Choose a Challenge</div>
            <div className="text-gray-300">Browse available challenges and select one that interests you</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              2
            </div>
            <div className="text-white font-semibold text-lg mb-2">Research & Plan</div>
            <div className="text-gray-300">Study the problem and develop your approach</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              3
            </div>
            <div className="text-white font-semibold text-lg mb-2">Create Solution</div>
            <div className="text-gray-300">Develop your solution with detailed explanations</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              4
            </div>
            <div className="text-white font-semibold text-lg mb-2">Submit & Compete</div>
            <div className="text-gray-300">Submit your solution and compete for prizes</div>
          </div>
        </div>
      </div>

      {/* Tips for Success */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Tips for Success</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-purple-400 font-semibold text-lg mb-3">Research Thoroughly</div>
            <p className="text-gray-300">Take time to understand the problem completely. Look at similar solutions and learn from past approaches.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-pink-400 font-semibold text-lg mb-3">Think Creatively</div>
            <p className="text-gray-300">Don't be afraid to propose innovative solutions. Original thinking is highly valued.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-green-400 font-semibold text-lg mb-3">Show Your Work</div>
            <p className="text-gray-300">Document your process clearly. Judges want to understand your reasoning and methodology.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-blue-400 font-semibold text-lg mb-3">Collaborate</div>
            <p className="text-gray-300">Form teams when possible. Different perspectives often lead to better solutions.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-orange-600/20 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Take on a Challenge?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of exceptional students who are already solving real-world problems. 
            Start your journey to success today.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105">
            Start Your First Challenge
          </button>
        </div>
      </div>
    </div>
  )
} 