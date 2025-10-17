import { PrismaClient } from '@prisma/client'
import { env, isDevelopment } from '@/config/env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopment ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  })

if (!env.NODE_ENV.includes('production')) globalForPrisma.prisma = prisma

export default prisma

