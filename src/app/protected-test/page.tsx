import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function ProtectedTestPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">✅ Protected Page Test</h1>
        
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-semibold">Authentication SUCCESS!</p>
            <p className="text-gray-300 text-sm">You are logged in as: {session.user?.email}</p>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 font-semibold">Server-Side Protection Working</p>
            <p className="text-gray-300 text-sm">This page was protected by server-side authentication check</p>
          </div>
          
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
            <p className="text-purple-400 font-semibold">Session Data:</p>
            <pre className="text-gray-300 text-xs bg-black/50 p-2 rounded overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <a 
            href="/dashboard" 
            className="block w-full bg-gradient-to-r from-blue-600 to-orange-600 text-white px-4 py-2 rounded-lg text-center hover:from-blue-700 hover:to-orange-700 transition-all duration-200"
          >
            Go to Dashboard
          </a>
          <a 
            href="/login" 
            className="block w-full bg-gray-600 text-white px-4 py-2 rounded-lg text-center hover:bg-gray-700 transition-all duration-200"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  )
}
