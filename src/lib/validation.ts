import { z } from 'zod'

// User registration validation
export const userRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  grade: z.number().min(8).max(12, 'Grade must be between 8 and 12'),
  state: z.string().min(2, 'State is required'),
  school: z.string().optional(),
  parentEmail: z.string().email('Invalid parent email').optional(),
  parentApproved: z.boolean().default(false)
})

// Challenge creation validation
export const challengeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.enum(['Math', 'Science', 'Problem-Solving']),
  points: z.number().min(1, 'Points must be at least 1').max(1000, 'Points cannot exceed 1000'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean()
})

// Submission validation
export const submissionSchema = z.object({
  challengeId: z.string().min(1, 'Challenge ID is required'),
  answer: z.string().min(1, 'Answer is required').max(10000, 'Answer too long')
})

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Validate and sanitize user input
export function validateAndSanitizeUserInput(data: any) {
  try {
    const validated = userRegistrationSchema.parse(data)
    return {
      ...validated,
      firstName: sanitizeInput(validated.firstName),
      lastName: sanitizeInput(validated.lastName),
      username: sanitizeInput(validated.username).toLowerCase()
    }
  } catch (error) {
    throw new Error(`Validation failed: ${error}`)
  }
} 