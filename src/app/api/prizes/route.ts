import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get all prizes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    let where: any = {}

    if (active === 'true') {
      where.isActive = true
    }

    const prizes = await prisma.prize.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(prizes)

  } catch (error) {
    console.error('Get prizes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new prize
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, imageUrl, value, isActive } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Prize name is required' },
        { status: 400 }
      )
    }

    const prize = await prisma.prize.create({
      data: {
        name,
        description,
        imageUrl,
        value: value ? parseFloat(value) : 0,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json({
      message: 'Prize created successfully',
      prize
    }, { status: 201 })

  } catch (error) {
    console.error('Create prize error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete multiple prizes
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prizeIds = searchParams.get('ids')

    if (!prizeIds) {
      return NextResponse.json(
        { error: 'Prize IDs are required' },
        { status: 400 }
      )
    }

    const ids = prizeIds.split(',')

    const deletedPrizes = await prisma.prize.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    return NextResponse.json({
      message: `${deletedPrizes.count} prize(s) deleted successfully`
    })

  } catch (error) {
    console.error('Delete prizes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
