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
    await prisma.advisor.deleteMany()

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
    const adminPassword = await bcrypt.hash('admin123', 12)
    
    const users = [
      // Admin Users
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mskl.io',
        username: 'admin',
        password: adminPassword,
        grade: 12,
        state: 'California',
        school: 'MSKL Admin',
        points: 0,
        level: 1,
        role: 'super_admin',
        permissions: ['full_access'],
        isAdmin: true
      },
      {
        firstName: 'Moderator',
        lastName: 'User',
        email: 'moderator@mskl.io',
        username: 'moderator',
        password: adminPassword,
        grade: 12,
        state: 'California',
        school: 'MSKL Admin',
        points: 0,
        level: 1,
        role: 'moderator',
        permissions: ['manage_submissions', 'view_analytics'],
        isAdmin: true
      },
      {
        firstName: 'Viewer',
        lastName: 'User',
        email: 'viewer@mskl.io',
        username: 'viewer',
        password: adminPassword,
        grade: 12,
        state: 'California',
        school: 'MSKL Admin',
        points: 0,
        level: 1,
        role: 'viewer',
        permissions: ['view_analytics'],
        isAdmin: true
      },
      // Student Users
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
        level: 2,
        role: 'student',
        permissions: [],
        isAdmin: false
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
        level: 3,
        role: 'student',
        permissions: [],
        isAdmin: false
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
        level: 4,
        role: 'student',
        permissions: [],
        isAdmin: false
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
        level: 5,
        role: 'student',
        permissions: [],
        isAdmin: false
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

    // Create sample email templates
    const emailTemplates = [
      {
        name: 'Welcome Email',
        type: 'welcome',
        subject: 'Welcome to MSKL - Your STEM Journey Begins!',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Welcome to MSKL, {{userName}}!</h2>
            <p>We're excited to have you join our community of exceptional students!</p>
            <p>Here's what you can do to get started:</p>
            <ul>
              <li>Browse current challenges</li>
              <li>Connect with other students</li>
              <li>Start earning points and climbing the leaderboard</li>
            </ul>
            <p>Ready to take on your first challenge? <a href="{{challengeUrl}}">Click here to get started!</a></p>
            <p>Best regards,<br>The MSKL Team</p>
          </div>
        `,
        variables: ['userName', 'challengeUrl'],
        isActive: true
      },
      {
        name: 'New Challenge Notification',
        type: 'new_challenge',
        subject: 'New Challenge Available: {{challengeTitle}}',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">New Challenge Alert!</h2>
            <p>Hello {{userName}},</p>
            <p>A new challenge is now available: <strong>{{challengeTitle}}</strong></p>
            <p><strong>Challenge Details:</strong></p>
            <ul>
              <li>Category: {{challengeCategory}}</li>
              <li>Difficulty: {{challengeDifficulty}}</li>
              <li>Points: {{challengePoints}}</li>
              <li>Deadline: {{challengeDeadline}}</li>
            </ul>
            <p><a href="{{challengeUrl}}">View Challenge Details</a></p>
            <p>Good luck!</p>
            <p>Best regards,<br>The MSKL Team</p>
          </div>
        `,
        variables: ['userName', 'challengeTitle', 'challengeCategory', 'challengeDifficulty', 'challengePoints', 'challengeDeadline', 'challengeUrl'],
        isActive: true
      },
      {
        name: 'Newsletter Template',
        type: 'newsletter',
        subject: 'MSKL Monthly Newsletter - {{month}} {{year}}',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">MSKL Monthly Newsletter</h2>
            <p>Hello {{userName}},</p>
            <p>Here's what's happening this month at MSKL:</p>
            <h3>📊 Leaderboard Updates</h3>
            <p>{{leaderboardUpdates}}</p>
            <h3>🏆 Recent Winners</h3>
            <p>{{recentWinners}}</p>
            <h3>🎯 Upcoming Challenges</h3>
            <p>{{upcomingChallenges}}</p>
            <h3>📚 Tips & Resources</h3>
            <p>{{tipsAndResources}}</p>
            <p><a href="{{newsletterUrl}}">Read Full Newsletter</a></p>
            <p>Best regards,<br>The MSKL Team</p>
          </div>
        `,
        variables: ['userName', 'month', 'year', 'leaderboardUpdates', 'recentWinners', 'upcomingChallenges', 'tipsAndResources', 'newsletterUrl'],
        isActive: true
      }
    ]

    for (const templateData of emailTemplates) {
      await prisma.emailTemplate.create({
        data: templateData
      })
    }

    // Create sample advisors
    const advisors = [
      {
        name: 'Dr. Sarah Chen',
        title: 'AI Research Director',
        company: 'Google DeepMind',
        expertise: 'Machine Learning & AI',
        bio: 'Leading researcher in quantum machine learning with 15+ years experience in AI development.',
        achievements: ['PhD Stanford', '50+ Publications', 'TEDx Speaker'],
        imageUrl: '/images/mentor1.jpg',
        isActive: true,
        order: 1
      },
      {
        name: 'Marcus Rodriguez',
        title: 'Chief Technology Officer',
        company: 'SpaceX',
        expertise: 'Aerospace Engineering',
        bio: 'Former NASA engineer now leading SpaceX\'s propulsion systems development.',
        achievements: ['MIT Graduate', 'NASA Veteran', 'Patent Holder'],
        imageUrl: '/images/mentor2.jpg',
        isActive: true,
        order: 2
      },
      {
        name: 'Dr. Emma Thompson',
        title: 'Research Scientist',
        company: 'MIT CSAIL',
        expertise: 'Computer Science',
        bio: 'Pioneering work in distributed systems and blockchain technology.',
        achievements: ['MIT Faculty', 'NSF Award', 'Industry Advisor'],
        imageUrl: '/images/mentor3.jpg',
        isActive: true,
        order: 3
      },
      {
        name: 'Alex Kim',
        title: 'VP of Engineering',
        company: 'Microsoft',
        expertise: 'Software Engineering',
        bio: 'Leading Microsoft\'s cloud infrastructure and developer tools teams.',
        achievements: ['Stanford CS', '20+ Years Experience', 'Open Source Contributor'],
        imageUrl: '/images/mentor4.jpg',
        isActive: true,
        order: 4
      },
      {
        name: 'Jordan Williams',
        title: 'Quantum Computing Lead',
        company: 'IBM Research',
        expertise: 'Quantum Computing',
        bio: 'Developing next-generation quantum algorithms and quantum-safe cryptography.',
        achievements: ['PhD Caltech', 'IBM Fellow', 'Quantum Pioneer'],
        imageUrl: '/images/mentor5.jpg',
        isActive: true,
        order: 5
      },
      {
        name: 'Maria Garcia',
        title: 'Data Science Director',
        company: 'Netflix',
        expertise: 'Data Science & ML',
        bio: 'Leading Netflix\'s recommendation systems and content optimization.',
        achievements: ['UC Berkeley PhD', 'Netflix Innovation', 'ML Expert'],
        imageUrl: '/images/mentor6.jpg',
        isActive: true,
        order: 6
      }
    ]

    for (const advisorData of advisors) {
      await prisma.advisor.create({
        data: advisorData
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
      message: 'Database seeded successfully with categories, challenges, users, prizes, advisors, email templates, and submissions',
      stats: {
        categories: createdCategories.length,
        challenges: createdChallenges.length,
        users: createdUsers.length,
        prizes: prizes.length,
        advisors: advisors.length,
        submissions: submissions.length
      }
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 