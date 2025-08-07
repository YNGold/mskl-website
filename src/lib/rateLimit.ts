interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 900000 // 15 minutes
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier

  if (!store[key] || now > store[key].resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs
    }
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: store[key].resetTime
    }
  }

  if (store[key].count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: store[key].resetTime
    }
  }

  store[key].count++
  return {
    success: true,
    remaining: maxRequests - store[key].count,
    resetTime: store[key].resetTime
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  return forwarded?.split(',')[0] || realIP || cfConnectingIP || 'unknown'
} 