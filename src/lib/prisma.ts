/**
 * Prisma client singleton.
 *
 * Re-exports the shared PrismaClient instance defined in `database.ts` under the
 * `prisma` name, which is what API routes import (`import { prisma } from '@/lib/prisma'`).
 * Keeping a single instance avoids exhausting the connection pool during Next.js
 * hot-reloads in development.
 */
import { db } from './database'

export const prisma = db
export default prisma
