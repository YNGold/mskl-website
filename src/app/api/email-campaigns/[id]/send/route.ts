import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminSession = await requireAdminAuth(request)
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: params.id }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (campaign.status === 'sent') {
      return NextResponse.json({ error: 'Campaign already sent' }, { status: 400 })
    }

    // Parse filters to determine recipients
    const filters = campaign.filters ? JSON.parse(campaign.filters) : {}
    
    // Build query based on filters
    const whereClause: any = {
      role: 'student',
      isAdmin: false
    }

    if (filters.grade) {
      whereClause.grade = parseInt(filters.grade)
    }

    if (filters.state) {
      whereClause.state = filters.state
    }

    if (filters.school) {
      whereClause.school = { contains: filters.school, mode: 'insensitive' }
    }

    if (filters.selectedUsers && filters.selectedUsers.length > 0) {
      whereClause.id = { in: filters.selectedUsers }
    }

    // Get recipients
    const recipients = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    })

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients found' }, { status: 400 })
    }

    // Update campaign status
    await prisma.emailCampaign.update({
      where: { id: params.id },
      data: {
        status: 'sending',
        totalRecipients: recipients.length,
        sentAt: new Date()
      }
    })

    // Create email logs for each recipient
    const emailLogs = recipients.map(recipient => ({
      campaignId: params.id,
      userId: recipient.id,
      email: recipient.email,
      subject: campaign.subject,
      status: 'sent'
    }))

    await prisma.emailLog.createMany({
      data: emailLogs
    })

    // Update campaign with sent count
    await prisma.emailCampaign.update({
      where: { id: params.id },
      data: {
        status: 'sent',
        sentCount: recipients.length
      }
    })

    return NextResponse.json({
      message: `Campaign sent to ${recipients.length} recipients`,
      recipientsCount: recipients.length
    })
  } catch (error) {
    console.error('Error sending email campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
