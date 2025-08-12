import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth, getAdminSession } from '@/lib/auth-middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const authError = requireAdminAuth(request)
    if (authError) {
      return authError
    }
    
    const adminSession = getAdminSession(request)
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
      include: {
        template: true,
        emailLogs: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          },
          orderBy: { sentAt: 'desc' }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error fetching email campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const authError = requireAdminAuth(request)
    if (authError) {
      return authError
    }
    
    const adminSession = getAdminSession(request)
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, templateId, subject, content, scheduledAt, filters, status } = body

    const campaign = await prisma.emailCampaign.update({
      where: { id },
      data: {
        name,
        templateId,
        subject,
        content,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        filters: filters ? JSON.stringify(filters) : null,
        status
      },
      include: {
        template: true
      }
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error updating email campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const authError = requireAdminAuth(request)
    if (authError) {
      return authError
    }
    
    const adminSession = getAdminSession(request)
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.emailCampaign.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Campaign deleted successfully' })
  } catch (error) {
    console.error('Error deleting email campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
