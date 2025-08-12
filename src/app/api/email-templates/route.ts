import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const adminSession = await requireAdminAuth(request)
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching email templates:', error)
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
    const { name, type, subject, content, variables } = body

    if (!name || !type || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const template = await prisma.emailTemplate.create({
      data: {
        name,
        type,
        subject,
        content,
        variables: variables || []
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error creating email template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
