import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const adminSession = await requireAdminAuth(request)
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const campaigns = await prisma.emailCampaign.findMany({
        include: {
          template: true
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(campaigns)
    } catch (dbError) {
      console.error('EmailCampaign table not found:', dbError)
      return NextResponse.json([]) // Return empty array if table doesn't exist
    }
  } catch (error) {
    console.error('Error fetching email campaigns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminSession = await requireAdminAuth(request)
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, templateId, subject, content, scheduledAt, filters } = body

    if (!name || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
      const campaign = await prisma.emailCampaign.create({
        data: {
          name,
          templateId,
          subject,
          content,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          filters: filters ? JSON.stringify(filters) : null,
          createdBy: adminSession.id
        },
        include: {
          template: true
        }
      })
      return NextResponse.json(campaign)
    } catch (dbError) {
      console.error('EmailCampaign table not found:', dbError)
      return NextResponse.json({ error: 'Database schema not ready. Please contact administrator.' }, { status: 503 })
    }
  } catch (error) {
    console.error('Error creating email campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
