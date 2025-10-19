/**
 * Prisma Configuration
 * Migrated from package.json to prisma.config.ts (Prisma 7 requirement)
 */

import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  seed: 'tsx prisma/seed.ts',
})

