'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Trophy, Users, Target, Award, GraduationCap } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo_transparent.png"
              alt="MSKL.io Logo"
              width={160}
              height={160}
              className="w-28 h-28 md:w-32 md:h-32"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/challenges" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>Challenges</span>
            </Link>
            <Link href="/leaderboard" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </Link>
            <Link href="/prizes" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>Prizes</span>
            </Link>
            <Link href="/advisory-circle" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
              <GraduationCap className="w-4 h-4" />
              <span>Advisory Circle</span>
            </Link>
            <Link href="/community" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Community</span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Join Challenge
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/50 backdrop-blur-md rounded-lg mt-2">
              <Link href="/challenges" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Challenges
              </Link>
              <Link href="/leaderboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Leaderboard
              </Link>
              <Link href="/prizes" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Prizes
              </Link>
              <Link href="/advisory-circle" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Advisory Circle
              </Link>
              <Link href="/community" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Community
              </Link>
              {session ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-orange-600 text-white block px-3 py-2 rounded-md text-base font-medium">
                    Join Challenge
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 