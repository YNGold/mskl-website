import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// Force dynamic rendering to prevent pre-rendering
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check for admin session cookie
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin-session')

  if (!adminSession) {
    redirect('/admin-login')
  }

  return <>{children}</>
}
