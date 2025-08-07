import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community - MSKL.io',
  description: 'Connect with exceptional students nationwide and collaborate on real-world challenges.',
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-orange-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Join the <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">MSKL Community</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with exceptional students nationwide. Share ideas, collaborate on challenges, and build lasting friendships with like-minded peers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105">
                Join Discussion
              </button>
              <button className="px-8 py-3 border border-blue-500 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/10 transition-all duration-200">
                View Events
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
            <div className="text-gray-300">Active Students</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-orange-400 mb-2">25+</div>
            <div className="text-gray-300">Cities Represented</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-2">100+</div>
            <div className="text-gray-300">Teams Formed</div>
          </div>
        </div>
      </div>

      {/* Discussion Forums */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Discussion Forums</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
            <div className="text-purple-400 text-lg font-semibold mb-2">Math Challenges</div>
            <p className="text-gray-300 mb-4">Discuss mathematical concepts and problem-solving strategies</p>
            <div className="text-sm text-gray-400">1.2k posts • 3.4k members</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
            <div className="text-pink-400 text-lg font-semibold mb-2">Science Projects</div>
            <p className="text-gray-300 mb-4">Share experiments, research findings, and scientific discoveries</p>
            <div className="text-sm text-gray-400">856 posts • 2.1k members</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
            <div className="text-green-400 text-lg font-semibold mb-2">Innovation Hub</div>
            <p className="text-gray-300 mb-4">Brainstorm creative solutions to real-world problems</p>
            <div className="text-sm text-gray-400">1.5k posts • 4.2k members</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
            <div className="text-blue-400 text-lg font-semibold mb-2">Study Groups</div>
            <p className="text-gray-300 mb-4">Form study groups and prepare for competitions together</p>
            <div className="text-sm text-gray-400">623 posts • 1.8k members</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
            <div className="text-yellow-400 text-lg font-semibold mb-2">Career Paths</div>
            <p className="text-gray-300 mb-4">Explore future careers in STEM and get advice from mentors</p>
            <div className="text-sm text-gray-400">445 posts • 1.2k members</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
            <div className="text-orange-400 text-lg font-semibold mb-2">Events & Meetups</div>
            <p className="text-gray-300 mb-4">Organize and discuss local meetups and events</p>
            <div className="text-sm text-gray-400">234 posts • 890 members</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { user: "Sarah M.", action: "posted a solution to Challenge #42", time: "2 hours ago", avatar: "SM" },
            { user: "Alex K.", action: "formed a new team 'Quantum Solvers'", time: "4 hours ago", avatar: "AK" },
            { user: "Maria L.", action: "shared an interesting math problem", time: "6 hours ago", avatar: "ML" },
            { user: "David R.", action: "won first place in the Physics Challenge", time: "1 day ago", avatar: "DR" },
            { user: "Emma T.", action: "started a study group for Calculus", time: "2 days ago", avatar: "ET" }
          ].map((activity, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              {activity.avatar}
            </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{activity.user}</div>
                  <div className="text-gray-300">{activity.action}</div>
                </div>
                <div className="text-gray-400 text-sm">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-orange-600/20 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Connect?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of exceptional students who are already part of the MSKL community. 
            Share your knowledge, learn from others, and make lifelong connections.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  )
} 