import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Don't create client during build time or when DATABASE_URL is missing
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found, Prisma client not initialized')
    return null
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

// Helper function to ensure prisma is available
export function getPrisma() {
  if (!prisma) {
    throw new Error('Database not available. Please check your DATABASE_URL environment variable.')
  }
  return prisma
}