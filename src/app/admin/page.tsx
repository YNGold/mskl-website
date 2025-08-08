'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Target, 
  Trophy, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  UserCheck,
  Award,
  X
} from 'lucide-react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  grade: number
  state: string
  school: string
  parentEmail: string
  parentApproved: boolean
  points: number
  level: number
  createdAt: string
}

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: string
  category: {
    id: string
    name: string
    color: string
  }
  grade: number
  points: number
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
}

interface Category {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
}

interface Prize {
  id: string
  name: string
  description: string
  imageUrl: string
  value: number
  isActive: boolean
  createdAt: string
}

interface Submission {
  id: string
  userId: string
  challengeId: string
  answer: string
  score: number
  submittedAt: string
  user: {
    firstName: string
    lastName: string
    username: string
  }
  challenge: {
    title: string
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<User[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [deleting, setDeleting] = useState(false)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null)
  const [showPrizeModal, setShowPrizeModal] = useState(false)
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)
  const [settings, setSettings] = useState({
    challengeReleaseSchedule: 'Bi-weekly',
    scoringSystem: 'Point-based',
    backupStatus: 'Ready',
    resetStatus: 'Ready'
  })
  
  // Date dropdown states
  const [startDateParts, setStartDateParts] = useState(() => {
    const today = new Date()
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    }
  })
  
  const [endDateParts, setEndDateParts] = useState(() => {
    const future = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
    return {
      year: future.getFullYear(),
      month: future.getMonth() + 1,
      day: future.getDate()
    }
  })
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChallenges: 0,
    totalSubmissions: 0,
    activeChallenges: 0
  })

  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    categoryId: '',
    grade: 9,
    points: 50,
    startDate: new Date().toISOString().split('T')[0], // Today's date
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    isActive: true
  })

  // Helper functions for date dropdowns
  const getCurrentYear = () => new Date().getFullYear()
  const getYears = () => {
    const currentYear = getCurrentYear()
    const years = []
    for (let i = currentYear; i <= currentYear + 5; i++) {
      years.push(i)
    }
    return years
  }

  const getMonths = () => [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const getDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month)
    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const formatDateForAPI = (year: number, month: number, day: number) => {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  }

  const parseDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  }

  const calculateTwoWeeksLater = (year: number, month: number, day: number) => {
    const startDate = new Date(year, month - 1, day) // month is 0-indexed in Date constructor
    const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000) // Add 14 days
    return {
      year: endDate.getFullYear(),
      month: endDate.getMonth() + 1,
      day: endDate.getDate()
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, challengesRes, categoriesRes, submissionsRes, prizesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/challenges'),
        fetch('/api/categories'),
        fetch('/api/submissions'),
        fetch('/api/prizes')
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
        setStats(prev => ({ ...prev, totalUsers: usersData.length }))
      }

      if (challengesRes.ok) {
        const challengesData = await challengesRes.json()
        setChallenges(challengesData)
        setStats(prev => ({ 
          ...prev, 
          totalChallenges: challengesData.length,
          activeChallenges: challengesData.filter((c: Challenge) => c.isActive).length
        }))
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }

      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json()
        setSubmissions(submissionsData)
        setStats(prev => ({ ...prev, totalSubmissions: submissionsData.length }))
      }

      if (prizesRes.ok) {
        const prizesData = await prizesRes.json()
        setPrizes(prizesData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    // Format dates from dropdowns
    const formattedStartDate = formatDateForAPI(startDateParts.year, startDateParts.month, startDateParts.day)
    const formattedEndDate = formatDateForAPI(endDateParts.year, endDateParts.month, endDateParts.day)
    
    // Validate dates
    if (new Date(formattedStartDate) >= new Date(formattedEndDate)) {
      alert('End date must be after start date')
      setCreating(false)
      return
    }

    const challengeData = {
      ...newChallenge,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    }

    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challengeData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Challenge created:', result)
        
        // Reset form and close modal
        setNewChallenge({
          title: '',
          description: '',
          difficulty: 'Medium',
          categoryId: '',
          grade: 9,
          points: 50,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isActive: true
        })
        
        // Reset date dropdowns
        const today = new Date()
        const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        setStartDateParts({
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
        })
        setEndDateParts({
          year: twoWeeksLater.getFullYear(),
          month: twoWeeksLater.getMonth() + 1,
          day: twoWeeksLater.getDate()
        })
        
        setShowCreateModal(false)
        
        // Refresh challenges data
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error creating challenge: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating challenge:', error)
      alert('Error creating challenge. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleLogout = () => {
    // Add logout logic here
    window.location.href = '/'
  }

  const handleCreateUser = async (userData: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('User created:', result)
        setShowUserModal(false)
        setEditingUser(null)
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error creating user: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user. Please try again.')
    }
  }

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('User updated:', result)
        setShowUserModal(false)
        setEditingUser(null)
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error updating user: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user. Please try again.')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('User deleted successfully')
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error deleting user: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteMultipleUsers = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select users to delete')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/users?ids=${selectedUsers.join(',')}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result.message)
        setSelectedUsers([])
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error deleting users: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting users:', error)
      alert('Error deleting users. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(user => user.id))
    }
  }

  const handleCreateCategory = async (categoryData: any) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Category created:', result)
        setShowCategoryModal(false)
        setEditingCategory(null)
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error creating category: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Error creating category. Please try again.')
    }
  }

  const handleUpdateCategory = async (categoryData: any) => {
    if (!editingCategory) return

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Category updated:', result)
        setShowCategoryModal(false)
        setEditingCategory(null)
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error updating category: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Error updating category. Please try again.')
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('Category deleted successfully')
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error deleting category: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category. Please try again.')
    }
  }

  const handleUpdateChallenge = async (challengeData: any) => {
    if (!editingChallenge) return

    try {
      const response = await fetch(`/api/challenges/${editingChallenge.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challengeData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Challenge updated:', result)
        setShowChallengeModal(false)
        setEditingChallenge(null)
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error updating challenge: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating challenge:', error)
      alert('Error updating challenge. Please try again.')
    }
  }

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('Challenge deleted successfully')
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error deleting challenge: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting challenge:', error)
      alert('Error deleting challenge. Please try again.')
    }
  }

  const handleUpdateSubmission = async (submissionData: any) => {
    if (!editingSubmission) return

    try {
      const response = await fetch(`/api/submissions/${editingSubmission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Submission updated:', result)
        setShowSubmissionModal(false)
        setEditingSubmission(null)
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error updating submission: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating submission:', error)
      alert('Error updating submission. Please try again.')
    }
  }

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('Submission deleted successfully')
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error deleting submission: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
      alert('Error deleting submission. Please try again.')
    }
  }

  const handleBackupDatabase = async () => {
    if (!confirm('This will create a backup of the current database. Continue?')) {
      return
    }

    setSettings(prev => ({ ...prev, backupStatus: 'Backing up...' }))

    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Database backup created successfully: ${result.filename}`)
        setSettings(prev => ({ ...prev, backupStatus: 'Ready' }))
      } else {
        const error = await response.json()
        alert(`Error creating backup: ${error.error}`)
        setSettings(prev => ({ ...prev, backupStatus: 'Error' }))
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      alert('Error creating backup. Please try again.')
      setSettings(prev => ({ ...prev, backupStatus: 'Error' }))
    }
  }

  const handleResetSampleData = async () => {
    if (!confirm('This will reset all data to sample data. This action cannot be undone. Continue?')) {
      return
    }

    setSettings(prev => ({ ...prev, resetStatus: 'Resetting...' }))

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        alert('Sample data reset successfully!')
        setSettings(prev => ({ ...prev, resetStatus: 'Ready' }))
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error resetting data: ${error.error}`)
        setSettings(prev => ({ ...prev, resetStatus: 'Error' }))
      }
    } catch (error) {
      console.error('Error resetting data:', error)
      alert('Error resetting data. Please try again.')
      setSettings(prev => ({ ...prev, resetStatus: 'Error' }))
    }
  }

  const handleClearAllData = async () => {
    if (!confirm('WARNING: This will delete ALL data including users, challenges, and submissions. This action cannot be undone. Are you absolutely sure?')) {
      return
    }

    if (!confirm('Final confirmation: This will permanently delete all data. Type "DELETE" to confirm.')) {
      return
    }

    setSettings(prev => ({ ...prev, resetStatus: 'Clearing...' }))

    try {
      const response = await fetch('/api/clear-data', {
        method: 'POST',
      })

      if (response.ok) {
        alert('All data has been cleared successfully.')
        setSettings(prev => ({ ...prev, resetStatus: 'Ready' }))
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error clearing data: ${error.error}`)
        setSettings(prev => ({ ...prev, resetStatus: 'Error' }))
      }
    } catch (error) {
      console.error('Error clearing data:', error)
      alert('Error clearing data. Please try again.')
      setSettings(prev => ({ ...prev, resetStatus: 'Error' }))
    }
  }

  const handleSettingsChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleCreatePrize = async (prizeData: any) => {
    try {
      const response = await fetch('/api/prizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prizeData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Prize created:', result)
        setShowPrizeModal(false)
        setEditingPrize(null)
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error creating prize: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating prize:', error)
      alert('Error creating prize. Please try again.')
    }
  }

  const handleUpdatePrize = async (prizeData: any) => {
    if (!editingPrize) return

    try {
      const response = await fetch(`/api/prizes/${editingPrize.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prizeData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Prize updated:', result)
        setShowPrizeModal(false)
        setEditingPrize(null)
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error updating prize: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating prize:', error)
      alert('Error updating prize. Please try again.')
    }
  }

  const handleDeletePrize = async (prizeId: string) => {
    if (!confirm('Are you sure you want to delete this prize? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/prizes/${prizeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('Prize deleted successfully')
        fetchData()
      } else {
        const error = await response.json()
        alert(`Error deleting prize: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting prize:', error)
      alert('Error deleting prize. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Admin Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">MSKL.io Admin</h1>
              <span className="text-purple-400 text-sm">Backend Management</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Challenges</p>
                <p className="text-3xl font-bold text-white">{stats.activeChallenges}</p>
              </div>
              <Target className="w-8 h-8 text-pink-400" />
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Submissions</p>
                <p className="text-3xl font-bold text-white">{stats.totalSubmissions}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Challenges</p>
                <p className="text-3xl font-bold text-white">{stats.totalChallenges}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'challenges', label: 'Challenges', icon: Target },
            { id: 'categories', label: 'Categories', icon: Award },
            { id: 'prizes', label: 'Prizes', icon: Award },
            { id: 'submissions', label: 'Submissions', icon: Trophy },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-purple-600/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                                         {submissions.slice(0, 5).map((submission) => (
                       <div key={submission.id} className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                         <div>
                           <p className="text-white font-medium">@{submission.user.username}</p>
                           <p className="text-gray-400 text-sm">Submitted: {submission.challenge.title}</p>
                         </div>
                         <span className="text-purple-400 font-semibold">{submission.score} pts</span>
                       </div>
                     ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Top Users</h3>
                  <div className="space-y-3">
                                         {users
                       .sort((a, b) => b.points - a.points)
                       .slice(0, 5)
                       .map((user, index) => (
                         <div key={user.id} className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                           <div className="flex items-center space-x-3">
                             <span className="text-purple-400 font-bold">#{index + 1}</span>
                             <div>
                               <p className="text-white font-medium">@{user.username}</p>
                               <p className="text-gray-400 text-sm">Grade {user.grade} • {user.state}</p>
                             </div>
                           </div>
                           <span className="text-purple-400 font-semibold">{user.points} pts</span>
                         </div>
                       ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <div className="flex space-x-2">
                  {selectedUsers.length > 0 && (
                    <button 
                      onClick={handleDeleteMultipleUsers}
                      disabled={deleting}
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Selected ({selectedUsers.length})</span>
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setEditingUser(null)
                      setShowUserModal(true)
                    }}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-purple-500/20">
                      <th className="text-gray-300 font-semibold py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onChange={handleSelectAllUsers}
                          className="rounded border-purple-500/20 bg-black/50 text-purple-500 focus:ring-purple-500"
                        />
                      </th>
                      <th className="text-gray-300 font-semibold py-3">User</th>
                      <th className="text-gray-300 font-semibold py-3">Email</th>
                      <th className="text-gray-300 font-semibold py-3">Grade</th>
                      <th className="text-gray-300 font-semibold py-3">State</th>
                      <th className="text-gray-300 font-semibold py-3">Points</th>
                      <th className="text-gray-300 font-semibold py-3">Level</th>
                      <th className="text-gray-300 font-semibold py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-purple-500/10">
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                            className="rounded border-purple-500/20 bg-black/50 text-purple-500 focus:ring-purple-500"
                          />
                        </td>
                        <td className="py-3">
                          <div>
                            <p className="text-white font-medium">@{user.username}</p>
                            <p className="text-gray-400 text-sm">{user.firstName} {user.lastName}</p>
                          </div>
                        </td>
                        <td className="py-3 text-gray-300">{user.email}</td>
                        <td className="py-3 text-gray-300">{user.grade}</td>
                        <td className="py-3 text-gray-300">{user.state}</td>
                        <td className="py-3 text-purple-400 font-semibold">{user.points}</td>
                        <td className="py-3 text-gray-300">{user.level}</td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingUser(user)
                                setShowUserModal(true)
                              }}
                              className="text-green-400 hover:text-green-300"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={deleting}
                              className="text-red-400 hover:text-red-300 disabled:opacity-50"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Challenge Management</h2>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Challenge</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-purple-500/20">
                      <th className="text-gray-300 font-semibold py-3">Title</th>
                      <th className="text-gray-300 font-semibold py-3">Category</th>
                      <th className="text-gray-300 font-semibold py-3">Grade</th>
                      <th className="text-gray-300 font-semibold py-3">Difficulty</th>
                      <th className="text-gray-300 font-semibold py-3">Points</th>
                      <th className="text-gray-300 font-semibold py-3">Status</th>
                      <th className="text-gray-300 font-semibold py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {challenges.map((challenge) => (
                      <tr key={challenge.id} className="border-b border-purple-500/10">
                        <td className="py-3">
                          <p className="text-white font-medium">{challenge.title}</p>
                        </td>
                        <td className="py-3">
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${challenge.category.color}20`, color: challenge.category.color }}
                          >
                            {challenge.category.name}
                          </span>
                        </td>
                        <td className="py-3 text-gray-300">Grade {challenge.grade}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {challenge.difficulty}
                          </span>
                        </td>
                        <td className="py-3 text-purple-400 font-semibold">{challenge.points}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            challenge.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {challenge.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingChallenge(challenge)
                                setShowChallengeModal(true)
                              }}
                              className="text-green-400 hover:text-green-300"
                              title="Edit Challenge"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteChallenge(challenge.id)}
                              className="text-red-400 hover:text-red-300"
                              title="Delete Challenge"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Category Management</h2>
                <button 
                  onClick={() => {
                    setEditingCategory(null)
                    setShowCategoryModal(true)
                  }}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-purple-500/20">
                      <th className="text-gray-300 font-semibold py-3">Name</th>
                      <th className="text-gray-300 font-semibold py-3">Description</th>
                      <th className="text-gray-300 font-semibold py-3">Color</th>
                      <th className="text-gray-300 font-semibold py-3">Challenges</th>
                      <th className="text-gray-300 font-semibold py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b border-purple-500/10">
                        <td className="py-3">
                          <p className="text-white font-medium">{category.name}</p>
                        </td>
                        <td className="py-3 text-gray-300">{category.description}</td>
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-6 h-6 rounded-full border border-gray-600"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="text-gray-300">{category.color}</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-300">
                          {challenges.filter(c => c.category.id === category.id).length} challenges
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingCategory(category)
                                setShowCategoryModal(true)
                              }}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'prizes' && (
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Prize Management</h2>
                <button 
                  onClick={() => {
                    setEditingPrize(null)
                    setShowPrizeModal(true)
                  }}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Prize</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-purple-500/20">
                      <th className="text-gray-300 font-semibold py-3">Prize</th>
                      <th className="text-gray-300 font-semibold py-3">Description</th>
                      <th className="text-gray-300 font-semibold py-3">Value</th>
                      <th className="text-gray-300 font-semibold py-3">Status</th>
                      <th className="text-gray-300 font-semibold py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prizes.map((prize) => (
                      <tr key={prize.id} className="border-b border-purple-500/10">
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            {prize.imageUrl && (
                              <img 
                                src={prize.imageUrl} 
                                alt={prize.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="text-white font-medium">{prize.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-gray-300">{prize.description}</td>
                        <td className="py-3 text-purple-400 font-semibold">${prize.value}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            prize.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {prize.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingPrize(prize)
                                setShowPrizeModal(true)
                              }}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePrize(prize.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Submission Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-purple-500/20">
                      <th className="text-gray-300 font-semibold py-3">Student</th>
                      <th className="text-gray-300 font-semibold py-3">Challenge</th>
                      <th className="text-gray-300 font-semibold py-3">Score</th>
                      <th className="text-gray-300 font-semibold py-3">Submitted</th>
                      <th className="text-gray-300 font-semibold py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-purple-500/10">
                        <td className="py-3">
                          <p className="text-white font-medium">@{submission.user.username}</p>
                          <p className="text-gray-400 text-sm">Grade {users.find(u => u.id === submission.userId)?.grade} • {users.find(u => u.id === submission.userId)?.state}</p>
                        </td>
                        <td className="py-3 text-gray-300">{submission.challenge.title}</td>
                        <td className="py-3 text-purple-400 font-semibold">{submission.score}</td>
                        <td className="py-3 text-gray-300">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingSubmission(submission)
                                setShowSubmissionModal(true)
                              }}
                              className="text-green-400 hover:text-green-300"
                              title="Edit Submission"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSubmission(submission.id)}
                              className="text-red-400 hover:text-red-300"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Platform Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Challenge Release Schedule</label>
                      <select className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3">
                        <option>Bi-weekly</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Scoring System</label>
                      <select className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3">
                        <option>Point-based</option>
                        <option>Percentage-based</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Database Management</h3>
                  <div className="space-y-4">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors">
                      Backup Database
                    </button>
                    <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg transition-colors">
                      Reset Sample Data
                    </button>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors">
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 w-full max-w-2xl mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Challenge</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Challenge Title</label>
                <input
                  type="text"
                  required
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                  className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
                  placeholder="Enter challenge title"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
                  placeholder="Enter challenge description"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Category</label>
                  <select
                    value={newChallenge.categoryId}
                    onChange={(e) => setNewChallenge({...newChallenge, categoryId: e.target.value})}
                    className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Grade</label>
                  <select
                    value={newChallenge.grade}
                    onChange={(e) => setNewChallenge({...newChallenge, grade: parseInt(e.target.value)})}
                    className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                    <option value={12}>Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Difficulty</label>
                  <select
                    value={newChallenge.difficulty}
                    onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                    className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Points</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newChallenge.points}
                    onChange={(e) => setNewChallenge({...newChallenge, points: parseInt(e.target.value)})}
                    className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Status</label>
                  <select
                    value={newChallenge.isActive ? 'true' : 'false'}
                    onChange={(e) => setNewChallenge({...newChallenge, isActive: e.target.value === 'true'})}
                    className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Date Range Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Start Date</label>
                  <div className="grid grid-cols-3 gap-1">
                    <select
                      value={startDateParts.month}
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value)
                        const newStartDate = {
                          ...startDateParts,
                          month: newMonth,
                          day: Math.min(startDateParts.day, getDaysInMonth(startDateParts.year, newMonth))
                        }
                        setStartDateParts(newStartDate)
                        
                        // Auto-calculate end date to 2 weeks later
                        const newEndDate = calculateTwoWeeksLater(newStartDate.year, newStartDate.month, newStartDate.day)
                        setEndDateParts(newEndDate)
                      }}
                      className="bg-black/50 border border-purple-500/20 rounded-lg text-white p-2 text-sm focus:outline-none focus:border-purple-500"
                    >
                      {getMonths().map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                    
                    <select
                      value={startDateParts.day}
                      onChange={(e) => {
                        const newDay = parseInt(e.target.value)
                        const newStartDate = {...startDateParts, day: newDay}
                        setStartDateParts(newStartDate)
                        
                        // Auto-calculate end date to 2 weeks later
                        const newEndDate = calculateTwoWeeksLater(newStartDate.year, newStartDate.month, newStartDate.day)
                        setEndDateParts(newEndDate)
                      }}
                      className="bg-black/50 border border-purple-500/20 rounded-lg text-white p-2 text-sm focus:outline-none focus:border-purple-500"
                    >
                      {getDays(startDateParts.year, startDateParts.month).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    
                    <select
                      value={startDateParts.year}
                      onChange={(e) => {
                        const newYear = parseInt(e.target.value)
                        const newStartDate = {
                          ...startDateParts,
                          year: newYear,
                          day: Math.min(startDateParts.day, getDaysInMonth(newYear, startDateParts.month))
                        }
                        setStartDateParts(newStartDate)
                        
                        // Auto-calculate end date to 2 weeks later
                        const newEndDate = calculateTwoWeeksLater(newStartDate.year, newStartDate.month, newStartDate.day)
                        setEndDateParts(newEndDate)
                      }}
                      className="bg-black/50 border border-purple-500/20 rounded-lg text-white p-2 text-sm focus:outline-none focus:border-purple-500"
                    >
                      {getYears().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    End Date <span className="text-purple-400 text-xs">(auto: 2 weeks)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <select
                      value={endDateParts.month}
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value)
                        setEndDateParts({
                          ...endDateParts,
                          month: newMonth,
                          day: Math.min(endDateParts.day, getDaysInMonth(endDateParts.year, newMonth))
                        })
                      }}
                      className="bg-black/50 border border-purple-500/20 rounded-lg text-white p-2 text-sm focus:outline-none focus:border-purple-500"
                    >
                      {getMonths().map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                    
                    <select
                      value={endDateParts.day}
                      onChange={(e) => setEndDateParts({...endDateParts, day: parseInt(e.target.value)})}
                      className="bg-black/50 border border-purple-500/20 rounded-lg text-white p-2 text-sm focus:outline-none focus:border-purple-500"
                    >
                      {getDays(endDateParts.year, endDateParts.month).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    
                    <select
                      value={endDateParts.year}
                      onChange={(e) => {
                        const newYear = parseInt(e.target.value)
                        setEndDateParts({
                          ...endDateParts,
                          year: newYear,
                          day: Math.min(endDateParts.day, getDaysInMonth(newYear, endDateParts.month))
                        })
                      }}
                      className="bg-black/50 border border-purple-500/20 rounded-lg text-white p-2 text-sm focus:outline-none focus:border-purple-500"
                    >
                      {getYears().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Date Range Display */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <p className="text-sm text-gray-300">
                  <span className="text-purple-400 font-medium">Duration:</span> {
                    `${Math.ceil((new Date(formatDateForAPI(endDateParts.year, endDateParts.month, endDateParts.day)).getTime() - new Date(formatDateForAPI(startDateParts.year, startDateParts.month, startDateParts.day)).getTime()) / (1000 * 60 * 60 * 24))} days`
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDateForAPI(startDateParts.year, startDateParts.month, startDateParts.day)} to {formatDateForAPI(endDateParts.year, endDateParts.month, endDateParts.day)}
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Challenge'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button
                onClick={() => {
                  setShowUserModal(false)
                  setEditingUser(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <UserForm 
              user={editingUser}
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              onCancel={() => {
                setShowUserModal(false)
                setEditingUser(null)
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button
                onClick={() => {
                  setShowCategoryModal(false)
                  setEditingCategory(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <CategoryForm 
              category={editingCategory}
              onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
              onCancel={() => {
                setShowCategoryModal(false)
                setEditingCategory(null)
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Challenge Edit Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
              </h2>
              <button
                onClick={() => {
                  setShowChallengeModal(false)
                  setEditingChallenge(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <ChallengeForm 
              challenge={editingChallenge}
              categories={categories}
              onSubmit={editingChallenge ? handleUpdateChallenge : handleCreateChallenge}
              onCancel={() => {
                setShowChallengeModal(false)
                setEditingChallenge(null)
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Submission Edit Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Edit Submission
              </h2>
              <button
                onClick={() => {
                  setShowSubmissionModal(false)
                  setEditingSubmission(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <SubmissionForm 
              submission={editingSubmission}
              onSubmit={handleUpdateSubmission}
              onCancel={() => {
                setShowSubmissionModal(false)
                setEditingSubmission(null)
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Prize Modal */}
      {showPrizeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingPrize ? 'Edit Prize' : 'Create New Prize'}
              </h2>
              <button
                onClick={() => {
                  setShowPrizeModal(false)
                  setEditingPrize(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <PrizeForm 
              prize={editingPrize}
              onSubmit={editingPrize ? handleUpdatePrize : handleCreatePrize}
              onCancel={() => {
                setShowPrizeModal(false)
                setEditingPrize(null)
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Prize Form Component
function PrizeForm({ prize, onSubmit, onCancel }: { 
  prize: Prize | null, 
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: prize?.name || '',
    description: prize?.description || '',
    imageUrl: prize?.imageUrl || '',
    value: prize?.value || 0,
    isActive: prize?.isActive ?? true
  })

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-300 text-sm mb-2">Prize Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="Prize Name"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Description</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="Prize Description"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Image URL</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Value ($)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.value}
          onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="0.00"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="rounded border-purple-500/20 bg-black/50 text-purple-500 focus:ring-purple-500"
        />
        <label className="text-gray-300 text-sm">Active Prize</label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving...' : (prize ? 'Update Prize' : 'Create Prize')}
        </button>
      </div>
    </form>
  )
}

// Submission Form Component
function SubmissionForm({ submission, onSubmit, onCancel }: { 
  submission: Submission | null, 
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    answer: submission?.answer || '',
    score: submission?.score || 0
  })

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-300 text-sm mb-2">Student</label>
        <div className="bg-black/50 border border-purple-500/20 rounded-lg p-3 text-white">
          @{submission?.user.username} - {submission?.user.firstName} {submission?.user.lastName}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Challenge</label>
        <div className="bg-black/50 border border-purple-500/20 rounded-lg p-3 text-white">
          {submission?.challenge.title}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Answer *</label>
        <textarea
          required
          rows={6}
          value={formData.answer}
          onChange={(e) => setFormData({...formData, answer: e.target.value})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="Student's answer"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Score</label>
        <input
          type="number"
          min="0"
          max="100"
          value={formData.score}
          onChange={(e) => setFormData({...formData, score: parseInt(e.target.value) || 0})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="Score (0-100)"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Submitted</label>
        <div className="bg-black/50 border border-purple-500/20 rounded-lg p-3 text-white">
          {submission?.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'N/A'}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Update Submission'}
        </button>
      </div>
    </form>
  )
}

// Challenge Form Component
function ChallengeForm({ challenge, categories, onSubmit, onCancel }: { 
  challenge: Challenge | null, 
  categories: Category[],
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    title: challenge?.title || '',
    description: challenge?.description || '',
    difficulty: challenge?.difficulty || 'Medium',
    categoryId: challenge?.category.id || '',
    grade: challenge?.grade || 9,
    points: challenge?.points || 50,
    startDate: challenge?.startDate ? new Date(challenge.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: challenge?.endDate ? new Date(challenge.endDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: challenge?.isActive ?? true
  })

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-300 text-sm mb-2">Challenge Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="Enter challenge title"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Description</label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="Enter challenge description"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Category *</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Grade *</label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: parseInt(e.target.value)})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            required
          >
            <option value={9}>Grade 9</option>
            <option value={10}>Grade 10</option>
            <option value={11}>Grade 11</option>
            <option value={12}>Grade 12</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Points</label>
          <input
            type="number"
            required
            min="1"
            value={formData.points}
            onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Status</label>
          <select
            value={formData.isActive ? 'true' : 'false'}
            onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Start Date</label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">End Date</label>
          <input
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving...' : (challenge ? 'Update Challenge' : 'Create Challenge')}
        </button>
      </div>
    </form>
  )
}

// Category Form Component
function CategoryForm({ category, onSubmit, onCancel }: { 
  category: Category | null, 
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#6366f1'
  })

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-300 text-sm mb-2">Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="Category Name"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Description</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="Category Description"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Color</label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            className="w-12 h-12 rounded-lg border border-purple-500/20 bg-black/50"
          />
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            className="flex-1 bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            placeholder="#6366f1"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
        </button>
      </div>
    </form>
  )
}

// User Form Component
function UserForm({ user, onSubmit, onCancel }: { 
  user: User | null, 
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
    password: '',
    grade: user?.grade || 9,
    state: user?.state || '',
    school: user?.school || '',
    parentEmail: user?.parentEmail || '',
    parentApproved: user?.parentApproved || false,
    points: user?.points || 0,
    level: user?.level || 1
  })

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Remove password if not provided (for updates)
      const submitData: any = { ...formData }
      if (!submitData.password && user) {
        delete submitData.password
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">First Name *</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            placeholder="First Name"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Last Name *</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            placeholder="Last Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            placeholder="Email"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Username *</label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            placeholder="Username"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">
          Password {user ? '(leave blank to keep current)' : '*'}
        </label>
        <input
          type="password"
          required={!user}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          placeholder="Password"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Grade *</label>
          <select
            required
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: parseInt(e.target.value)})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
          >
            {[9, 10, 11, 12].map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">State *</label>
          <input
            type="text"
            required
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            placeholder="State"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">School</label>
          <input
            type="text"
            value={formData.school}
            onChange={(e) => setFormData({...formData, school: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            placeholder="School"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Parent Email</label>
          <input
            type="email"
            value={formData.parentEmail}
            onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            placeholder="Parent Email"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.parentApproved}
            onChange={(e) => setFormData({...formData, parentApproved: e.target.checked})}
            className="rounded border-purple-500/20 bg-black/50 text-purple-500 focus:ring-purple-500"
          />
          <label className="text-gray-300 text-sm">Parent Approved</label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Points</label>
          <input
            type="number"
            min="0"
            value={formData.points}
            onChange={(e) => setFormData({...formData, points: parseInt(e.target.value) || 0})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            placeholder="Points"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Level</label>
          <input
            type="number"
            min="1"
            value={formData.level}
            onChange={(e) => setFormData({...formData, level: parseInt(e.target.value) || 1})}
            className="w-full bg-black/50 border border-purple-500/20 rounded-lg text-white p-3 focus:outline-none focus:border-purple-500"
            placeholder="Level"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving...' : (user ? 'Update User' : 'Create User')}
        </button>
      </div>
    </form>
  )
} 