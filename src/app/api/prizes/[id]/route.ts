import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get a specific prize by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const prize = await prisma.prize.findUnique({
      where: { id }
    })

    if (!prize) {
      return NextResponse.json(
        { error: 'Prize not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(prize)

  } catch (error) {
    console.error('Get prize error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update a prize
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, imageUrl, value, isActive } = body

    const prize = await prisma.prize.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        value: value ? parseFloat(value) : undefined,
        isActive
      }
    })

    return NextResponse.json({
      message: 'Prize updated successfully',
      prize
    })

  } catch (error) {
    console.error('Update prize error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a prize
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.prize.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Prize deleted successfully'
    })

  } catch (error) {
    console.error('Delete prize error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
