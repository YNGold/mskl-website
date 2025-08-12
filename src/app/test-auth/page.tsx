'use client'

import { useSession } from 'next-auth/react'

export default function TestAuthPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Test</h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-400">Status:</p>
            <p className="text-white font-mono">{status}</p>
          </div>
          
          <div>
            <p className="text-gray-400">Session:</p>
            <pre className="text-white font-mono text-sm bg-black/50 p-2 rounded overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          
          <div>
            <p className="text-gray-400">User ID:</p>
            <p className="text-white font-mono">{session?.user?.id || 'None'}</p>
          </div>
          
          <div>
            <p className="text-gray-400">Email:</p>
            <p className="text-white font-mono">{session?.user?.email || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

