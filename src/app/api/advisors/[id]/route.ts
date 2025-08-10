import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get single advisor
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const advisor = await prisma.advisor.findUnique({
      where: { id }
    })

    if (!advisor) {
      return NextResponse.json(
        { error: 'Advisor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(advisor)
  } catch (error) {
    console.error('Get advisor error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update advisor
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { 
      name, 
      title, 
      company, 
      expertise, 
      bio, 
      achievements, 
      imageUrl,
      isActive,
      order
    } = body

    // Validate required fields
    if (!name || !title || !company || !expertise || !bio) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update advisor
    const advisor = await prisma.advisor.update({
      where: { id },
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
      message: 'Advisor updated successfully',
      advisor
    })

  } catch (error) {
    console.error('Update advisor error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete advisor
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await prisma.advisor.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Advisor deleted successfully'
    })

  } catch (error) {
    console.error('Delete advisor error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
