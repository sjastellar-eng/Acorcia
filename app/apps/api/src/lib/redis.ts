import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Key helpers
export const keys = {
  refreshToken: (token: string) => `refresh:${token}`,
  rateLimitAuth: (ip: string) => `rl:auth:${ip}`,
  sessionMessages: (sessionId: string) => `session:msgs:${sessionId}`,
  userActive: (userId: string) => `user:active:${userId}`,
}
