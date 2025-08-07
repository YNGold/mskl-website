import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Clear existing data
    await prisma.submission.deleteMany()
    await prisma.challenge.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // Create default categories
    const categories = [
      { name: 'Math', description: 'Mathematics challenges', color: '#ef4444' },
      { name: 'Science', description: 'Science and technology challenges', color: '#3b82f6' },
      { name: 'Problem-Solving', description: 'Logic and problem-solving challenges', color: '#10b981' },
      { name: 'Technology', description: 'Computer science and technology challenges', color: '#8b5cf6' },
      { name: 'Engineering', description: 'Engineering and design challenges', color: '#f59e0b' }
    ]

    const createdCategories = []
    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: categoryData
      })
      createdCategories.push(category)
    }

    // Create sample challenges for each grade
    const challenges = [
      // Grade 9 Challenges
      {
        title: 'Algebra Basics',
        description: 'Solve basic algebraic equations and expressions',
        difficulty: 'Easy',
        categoryId: createdCategories[0].id, // Math
        grade: 9,
        points: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        title: 'Scientific Method',
        description: 'Design and conduct a simple scientific experiment',
        difficulty: 'Medium',
        categoryId: createdCategories[1].id, // Science
        grade: 9,
        points: 75,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      // Grade 10 Challenges
      {
        title: 'Geometry Problems',
        description: 'Solve geometric problems using theorems and formulas',
        difficulty: 'Medium',
        categoryId: createdCategories[0].id, // Math
        grade: 10,
        points: 75,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        title: 'Chemistry Lab',
        description: 'Analyze chemical reactions and molecular structures',
        difficulty: 'Hard',
        categoryId: createdCategories[1].id, // Science
        grade: 10,
        points: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      // Grade 11 Challenges
      {
        title: 'Calculus Introduction',
        description: 'Learn the basics of calculus and derivatives',
        difficulty: 'Hard',
        categoryId: createdCategories[0].id, // Math
        grade: 11,
        points: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        title: 'Physics Experiments',
        description: 'Conduct physics experiments and analyze results',
        difficulty: 'Hard',
        categoryId: createdCategories[1].id, // Science
        grade: 11,
        points: 125,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      // Grade 12 Challenges
      {
        title: 'Advanced Calculus',
        description: 'Solve complex calculus problems and applications',
        difficulty: 'Hard',
        categoryId: createdCategories[0].id, // Math
        grade: 12,
        points: 150,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        title: 'Research Project',
        description: 'Conduct an independent research project',
        difficulty: 'Hard',
        categoryId: createdCategories[2].id, // Problem-Solving
        grade: 12,
        points: 200,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ]

    const createdChallenges = []
    for (const challengeData of challenges) {
      const challenge = await prisma.challenge.create({
        data: challengeData
      })
      createdChallenges.push(challenge)
    }

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const users = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: hashedPassword,
        grade: 9,
        state: 'California',
        school: 'Sample High School',
        points: 150,
        level: 2
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        username: 'janesmith',
        password: hashedPassword,
        grade: 10,
        state: 'New York',
        school: 'Sample High School',
        points: 275,
        level: 3
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        username: 'mikejohnson',
        password: hashedPassword,
        grade: 11,
        state: 'Texas',
        school: 'Sample High School',
        points: 400,
        level: 4
      },
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@example.com',
        username: 'sarahwilson',
        password: hashedPassword,
        grade: 12,
        state: 'Florida',
        school: 'Sample High School',
        points: 600,
        level: 5
      }
    ]

    const createdUsers = []
    for (const userData of users) {
      const user = await prisma.user.create({
        data: userData
      })
      createdUsers.push(user)
    }

    // Create sample prizes
    const prizes = [
      {
        name: 'First Place Trophy',
        description: 'Exclusive trophy for the top performer',
        imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200',
        value: 500.00,
        isActive: true
      },
      {
        name: 'Second Place Medal',
        description: 'Silver medal for second place',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
        value: 250.00,
        isActive: true
      },
      {
        name: 'Third Place Certificate',
        description: 'Certificate of achievement for third place',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
        value: 100.00,
        isActive: true
      },
      {
        name: 'Participation Badge',
        description: 'Special badge for all participants',
        imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200',
        value: 25.00,
        isActive: true
      }
    ]

    for (const prizeData of prizes) {
      await prisma.prize.create({
        data: prizeData
      })
    }

    // Create sample submissions
    const submissions = [
      {
        userId: createdUsers[0].id,
        challengeId: createdChallenges[0].id,
        answer: 'I solved the algebra problem by isolating the variable x.',
        score: 45
      },
      {
        userId: createdUsers[1].id,
        challengeId: createdChallenges[2].id,
        answer: 'I used the Pythagorean theorem to solve this geometry problem.',
        score: 70
      },
      {
        userId: createdUsers[2].id,
        challengeId: createdChallenges[4].id,
        answer: 'I calculated the derivative using the power rule.',
        score: 85
      },
      {
        userId: createdUsers[3].id,
        challengeId: createdChallenges[6].id,
        answer: 'I solved the complex calculus problem using integration by parts.',
        score: 120
      }
    ]

    for (const submissionData of submissions) {
      await prisma.submission.create({
        data: submissionData
      })
    }

    return NextResponse.json({
      message: 'Database seeded successfully with categories, challenges, users, prizes, and submissions',
      stats: {
        categories: createdCategories.length,
        challenges: createdChallenges.length,
        users: createdUsers.length,
        prizes: prizes.length,
        submissions: submissions.length
      }
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
} 