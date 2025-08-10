import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get all advisors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const advisors = await prisma.advisor.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(advisors)
  } catch (error) {
    console.error('Get advisors error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new advisor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      title, 
      company, 
      expertise, 
      bio, 
      achievements = [], 
      imageUrl,
      isActive = true,
      order = 0
    } = body

    // Validate required fields
    if (!name || !title || !company || !expertise || !bio) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create advisor
    const advisor = await prisma.advisor.create({
      data: {
        name,
        title,
        company,
        expertise,
        bio,
        achievements,
        imageUrl,
        isActive,
        order
      }
    })

    return NextResponse.json({
      message: 'Advisor created successfully',
      advisor
    }, { status: 201 })

  } catch (error) {
    console.error('Create advisor error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Bulk delete advisors
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')

    if (!ids) {
      return NextResponse.json(
        { error: 'No advisor IDs provided' },
        { status: 400 }
      )
    }

    const advisorIds = ids.split(',')
    
    await prisma.advisor.deleteMany({
      where: {
        id: {
          in: advisorIds
        }
      }
    })

    return NextResponse.json({
      message: 'Advisors deleted successfully'
    })

  } catch (error) {
    console.error('Delete advisors error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
