import { NextResponse } from 'next/server'
import { logoutAdmin } from '@/lib/auth-middleware'

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  )

  return logoutAdmin(response)
}
