import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const session = getAdminSession(request)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
