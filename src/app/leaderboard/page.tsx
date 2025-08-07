import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leaderboard - MSKL.io',
  description: 'See the top performers and track your progress in the MSKL challenge rankings.',
}

export default function LeaderboardPage() {
  const topStudents = [
    { rank: 1, name: "Sarah Mitchell", points: 2847, school: "St. Mary's Academy", city: "Boston, MA", avatar: "SM", streak: 8, challenges: 23 },
    { rank: 2, name: "Alex Chen", points: 2712, school: "Tech High School", city: "San Francisco, CA", avatar: "AC", streak: 6, challenges: 21 },
    { rank: 3, name: "Maria Rodriguez", points: 2654, school: "Science Academy", city: "Miami, FL", avatar: "MR", streak: 7, challenges: 19 },
    { rank: 4, name: "David Kim", points: 2518, school: "Innovation Prep", city: "Seattle, WA", avatar: "DK", streak: 5, challenges: 18 },
    { rank: 5, name: "Emma Thompson", points: 2432, school: "STEM Academy", city: "Austin, TX", avatar: "ET", streak: 4, challenges: 20 },
    { rank: 6, name: "James Wilson", points: 2387, school: "Math & Science", city: "Chicago, IL", avatar: "JW", streak: 9, challenges: 17 },
    { rank: 7, name: "Sophia Lee", points: 2312, school: "Future Leaders", city: "Denver, CO", avatar: "SL", streak: 3, challenges: 16 },
    { rank: 8, name: "Michael Brown", points: 2256, school: "Excellence Prep", city: "Phoenix, AZ", avatar: "MB", streak: 6, challenges: 15 },
    { rank: 9, name: "Isabella Garcia", points: 2198, school: "Discovery Academy", city: "Portland, OR", avatar: "IG", streak: 5, challenges: 14 },
    { rank: 10, name: "Lucas Anderson", points: 2143, school: "Achievement High", city: "Nashville, TN", avatar: "LA", streak: 4, challenges: 13 }
  ]

  const categories = [
    { name: "Overall", active: true },
    { name: "Math", active: false },
    { name: "Science", active: false },
    { name: "Innovation", active: false },
    { name: "This Month", active: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-orange-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Leaderboard</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              See the top performers and track your progress in the MSKL challenge rankings. 
              Compete with exceptional students nationwide and climb the ranks.
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                category.active
                  ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 2nd Place */}
          <div className="order-2 md:order-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                2
              </div>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xl mx-auto mb-4">
                {topStudents[1].avatar}
              </div>
              <div className="text-white font-semibold text-lg mb-1">{topStudents[1].name}</div>
              <div className="text-blue-400 font-bold text-2xl mb-2">{topStudents[1].points} pts</div>
              <div className="text-gray-400 text-sm mb-2">{topStudents[1].school}</div>
              <div className="text-gray-500 text-xs">{topStudents[1].city}</div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="order-1 md:order-2">
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                1
              </div>
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-4">
                {topStudents[0].avatar}
              </div>
              <div className="text-white font-semibold text-xl mb-1">{topStudents[0].name}</div>
              <div className="text-yellow-400 font-bold text-3xl mb-2">{topStudents[0].points} pts</div>
              <div className="text-gray-400 text-sm mb-2">{topStudents[0].school}</div>
              <div className="text-gray-500 text-xs">{topStudents[0].city}</div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                3
              </div>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xl mx-auto mb-4">
                {topStudents[2].avatar}
              </div>
              <div className="text-white font-semibold text-lg mb-1">{topStudents[2].name}</div>
              <div className="text-orange-400 font-bold text-2xl mb-2">{topStudents[2].points} pts</div>
              <div className="text-gray-400 text-sm mb-2">{topStudents[2].school}</div>
              <div className="text-gray-500 text-xs">{topStudents[2].city}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Full Rankings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Student</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">School</th>
                  <th className="px-6 py-4 text-center text-gray-300 font-semibold">Points</th>
                  <th className="px-6 py-4 text-center text-gray-300 font-semibold">Streak</th>
                  <th className="px-6 py-4 text-center text-gray-300 font-semibold">Challenges</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((student, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                                 student.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                         student.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                         student.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                         'bg-gradient-to-r from-blue-500 to-orange-500'
                      }`}>
                        {student.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                                               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                         {student.avatar}
                       </div>
                        <div>
                          <div className="text-white font-medium">{student.name}</div>
                          <div className="text-gray-400 text-sm">{student.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{student.school}</td>
                                         <td className="px-6 py-4 text-center">
                       <span className="text-blue-400 font-bold">{student.points}</span>
                     </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-400 font-semibold">{student.streak} 🔥</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">{student.challenges}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
             <div className="text-3xl font-bold text-blue-400 mb-2">2,847</div>
             <div className="text-gray-300">Highest Score</div>
           </div>
           <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
             <div className="text-3xl font-bold text-orange-400 mb-2">1,234</div>
             <div className="text-gray-300">Active Students</div>
           </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">156</div>
            <div className="text-gray-300">Schools Represented</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">89</div>
            <div className="text-gray-300">Cities</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-orange-600/20 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Compete?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join the competition and see your name on the leaderboard. 
            Take on challenges, earn points, and climb the ranks.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105">
            Start Competing
          </button>
        </div>
      </div>
    </div>
  )
} 