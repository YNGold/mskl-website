import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prizes & Rewards - MSKL.io',
  description: 'Discover the amazing prizes, scholarships, and opportunities available to MSKL challenge winners.',
}

export default function PrizesPage() {
  const prizes = [
    {
      category: "Grand Prizes",
      items: [
        {
          name: "Full STEM Scholarship",
          value: "$50,000",
          description: "Complete scholarship to top STEM universities including MIT, Stanford, and CalTech",
          icon: "🎓",
          requirements: "Top 3 overall winners"
        },
        {
          name: "Summer Research Program",
          value: "$15,000",
          description: "8-week research internship at leading universities with renowned professors",
          icon: "🔬",
          requirements: "Top 10 science category"
        },
        {
          name: "Innovation Grant",
          value: "$10,000",
          description: "Funding to develop and patent your innovative solutions",
          icon: "💡",
          requirements: "Most innovative solution"
        }
      ]
    },
    {
      category: "Monthly Rewards",
      items: [
        {
          name: "Gaming Laptop",
          value: "$2,500",
          description: "High-performance laptop for coding, design, and gaming",
          icon: "💻",
          requirements: "Monthly champion"
        },
        {
          name: "Science Kit",
          value: "$500",
          description: "Complete laboratory equipment for home experiments",
          icon: "🧪",
          requirements: "Top 5 science challenges"
        },
        {
          name: "Math Competition Entry",
          value: "$300",
          description: "Paid entry to international math competitions",
          icon: "📐",
          requirements: "Top 5 math challenges"
        }
      ]
    },
    {
      category: "Special Opportunities",
      items: [
        {
          name: "Mentorship Program",
          value: "Priceless",
          description: "1-on-1 mentorship with industry leaders and Nobel laureates",
          icon: "👨‍🏫",
          requirements: "Consistent top performers"
        },
        {
          name: "Conference Attendance",
          value: "$1,500",
          description: "All-expenses-paid trip to STEM conferences worldwide",
          icon: "✈️",
          requirements: "Innovation award winners"
        },
        {
          name: "Patent Filing",
          value: "$5,000",
          description: "Legal assistance to file patents for your inventions",
          icon: "📄",
          requirements: "Original inventions"
        }
      ]
    }
  ]

  const upcomingEvents = [
    {
      name: "National STEM Summit",
      date: "March 15-17, 2024",
      location: "Washington, DC",
      description: "Meet with policymakers and present your solutions",
      prize: "Presidential recognition"
    },
    {
      name: "International Science Fair",
      date: "May 20-25, 2024",
      location: "Phoenix, AZ",
      description: "Compete with students from 80+ countries",
      prize: "$75,000 grand prize"
    },
    {
      name: "Innovation Showcase",
      date: "July 10-12, 2024",
      location: "San Francisco, CA",
      description: "Present to Silicon Valley investors and tech leaders",
      prize: "Startup funding opportunities"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-orange-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Prizes & Rewards</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover the amazing prizes, scholarships, and opportunities available to MSKL challenge winners. 
              From full scholarships to mentorship programs, your success opens doors to incredible opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105">
                View Current Challenges
              </button>
              <button className="px-8 py-3 border border-blue-500 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/10 transition-all duration-200">
                Past Winners
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prize Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {prizes.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((prize, prizeIndex) => (
                <div key={prizeIndex} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="text-4xl mb-4">{prize.icon}</div>
                  <div className="text-white font-semibold text-xl mb-2">{prize.name}</div>
                  <div className="text-blue-400 font-bold text-2xl mb-3">{prize.value}</div>
                  <p className="text-gray-300 mb-4">{prize.description}</p>
                                      <div className="text-sm text-gray-400 bg-white/5 rounded-lg p-3">
                      <span className="font-semibold text-blue-300">Requirements:</span> {prize.requirements}
                    </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total Prize Pool */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-orange-600/20 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Total Prize Pool</h2>
          <div className="text-6xl font-bold text-blue-400 mb-4">$500,000+</div>
          <p className="text-gray-300 text-lg mb-6">
            In scholarships, grants, and opportunities distributed annually
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-gray-300">Scholarships Awarded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-gray-300">Students Supported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">25+</div>
              <div className="text-gray-300">Partner Universities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Upcoming Events & Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="text-blue-400 font-semibold text-sm mb-2">{event.date}</div>
              <div className="text-white font-semibold text-xl mb-2">{event.name}</div>
              <div className="text-gray-400 text-sm mb-3">{event.location}</div>
              <p className="text-gray-300 mb-4">{event.description}</p>
              <div className="text-green-400 font-semibold">Prize: {event.prize}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              SM
            </div>
              <div>
                <div className="text-white font-semibold">Sarah Mitchell</div>
                <div className="text-gray-400 text-sm">2023 Grand Prize Winner</div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              "Winning the MSKL challenge opened doors I never thought possible. I'm now studying at MIT with a full scholarship, 
              and I've already started my own research project on sustainable energy solutions."
            </p>
            <div className="text-blue-400 font-semibold">$50,000 Scholarship to MIT</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              AC
            </div>
              <div>
                <div className="text-white font-semibold">Alex Chen</div>
                <div className="text-gray-400 text-sm">2023 Innovation Award</div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              "My invention for clean water filtration is now patented and being used in developing countries. 
              The MSKL platform gave me the resources and mentorship to turn my idea into reality."
            </p>
            <div className="text-blue-400 font-semibold">Patent Filed • $10,000 Grant</div>
          </div>
        </div>
      </div>

      {/* How to Win */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">How to Win</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              1
            </div>
            <div className="text-white font-semibold text-lg mb-2">Participate Regularly</div>
            <div className="text-gray-300">Complete challenges consistently to build your score</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              2
            </div>
            <div className="text-white font-semibold text-lg mb-2">Show Innovation</div>
            <div className="text-gray-300">Think creatively and propose unique solutions</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              3
            </div>
            <div className="text-white font-semibold text-lg mb-2">Collaborate</div>
            <div className="text-gray-300">Work with teams to tackle complex problems</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              4
            </div>
            <div className="text-white font-semibold text-lg mb-2">Stay Persistent</div>
            <div className="text-gray-300">Keep learning and improving with each challenge</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-orange-600/20 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Win Big?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Start your journey to success today. Take on challenges, showcase your skills, 
            and compete for life-changing prizes and opportunities.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105">
            Start Competing Now
          </button>
        </div>
      </div>
    </div>
  )
} 