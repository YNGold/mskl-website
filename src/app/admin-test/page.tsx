import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function AdminTestPage() {
  // Check for admin session cookie
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin-session')

  if (!adminSession) {
    redirect('/admin-login')
  }

  // Parse the session data
  let sessionData
  try {
    sessionData = JSON.parse(decodeURIComponent(adminSession.value))
  } catch (error) {
    console.error('Error parsing admin session:', error)
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-orange-900">
      <div className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">🔒 Admin Protection Test</h1>
        
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-semibold">✅ Admin Authentication SUCCESS!</p>
            <p className="text-gray-300 text-sm">You are logged in as: {sessionData.email}</p>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 font-semibold">🛡️ Server-Side Protection Working</p>
            <p className="text-gray-300 text-sm">This page was protected by server-side admin authentication check</p>
          </div>
          
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
            <p className="text-purple-400 font-semibold">Session Data:</p>
            <pre className="text-gray-300 text-xs bg-black/50 p-2 rounded overflow-auto">
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <a 
            href="/admin" 
            className="block w-full bg-gradient-to-r from-blue-600 to-orange-600 text-white px-4 py-2 rounded-lg text-center hover:from-blue-700 hover:to-orange-700 transition-all duration-200"
          >
            Go to Admin Dashboard
          </a>
                      <a 
              href="/admin-login" 
              className="block w-full bg-gray-600 text-white px-4 py-2 rounded-lg text-center hover:bg-gray-700 transition-all duration-200"
            >
              Go to Admin Login
            </a>
        </div>
      </div>
    </div>
  )
}
