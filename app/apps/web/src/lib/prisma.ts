import { PrismaClient } from '@prisma/client'

// Fallback: use DATABASE_URL if DIRECT_URL is not set (Railway PostgreSQL)
if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
