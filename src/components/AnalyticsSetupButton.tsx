'use client'

import { useState } from 'react'
import { Database, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function AnalyticsSetupButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const setupAnalytics = async () => {
    setIsLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/setup-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        // Refresh the page to show the new data
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to setup analytics')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Analytics Setup</h3>
            <p className="text-gray-400 text-sm">
              Initialize the analytics system with sample data to see charts and statistics
            </p>
          </div>
        </div>
        
        <button
          onClick={setupAnalytics}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
            isLoading
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Setting up...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Setup Complete</span>
            </>
          ) : status === 'error' ? (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>Retry Setup</span>
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              <span>Setup Analytics</span>
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          status === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-400'
            : status === 'error'
            ? 'bg-red-500/20 border border-red-500/30 text-red-400'
            : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
        }`}>
          <p className="text-sm">{message}</p>
          {status === 'success' && (
            <p className="text-xs mt-1 text-green-300">
              Page will refresh automatically to show the new data...
            </p>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Sample page views and user actions</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Challenge performance metrics</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>Geographic and engagement data</span>
        </div>
      </div>
    </div>
  )
}
