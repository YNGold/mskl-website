import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(categories)

  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        color: color || '#6366f1' // Default purple color
      }
    })

    return NextResponse.json({
      message: 'Category created successfully',
      category
    }, { status: 201 })

  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete multiple categories
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryIds = searchParams.get('ids')

    if (!categoryIds) {
      return NextResponse.json(
        { error: 'Category IDs are required' },
        { status: 400 }
      )
    }

    const ids = categoryIds.split(',')

    // Check if categories are being used by challenges
    const challengesUsingCategories = await prisma.challenge.findMany({
      where: {
        categoryId: {
          in: ids
        }
      }
    })

    if (challengesUsingCategories.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete categories that are being used by challenges' },
        { status: 400 }
      )
    }

    const deletedCategories = await prisma.category.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    return NextResponse.json({
      message: `${deletedCategories.count} category(ies) deleted successfully`
    })

  } catch (error) {
    console.error('Delete categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
