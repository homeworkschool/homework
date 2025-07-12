import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Check if we're in a build environment without database URL
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL

let prisma

if (isBuildTime) {
  // Mock client for build time
  prisma = {
    user: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve(null),
      update: () => Promise.resolve(null),
      delete: () => Promise.resolve(null),
    },
    homework: {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve(null),
      update: () => Promise.resolve(null),
      delete: () => Promise.resolve(null),
    },
  }
} else {
  // Normal Prisma client for runtime
  prisma = globalForPrisma.prisma || new PrismaClient()
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
}

export { prisma } 