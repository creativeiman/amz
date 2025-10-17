/**
 * Separate Auth Configuration for Server-Side (with Prisma)
 * Use this in API routes where Node.js runtime is available
 */

import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/db/client'

export const authConfig = {
  adapter: PrismaAdapter(prisma),
}

