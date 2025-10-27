/**
 * Prisma Configuration
 * Note: Seed scripts are now automatically detected from prisma/seed.ts
 * No need to configure them in prisma.config.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local file
dotenv.config({ path: path.resolve(__dirname, '.env.local') })

