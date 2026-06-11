/**
 * Zod schemas + a helper for validating API request bodies.
 *
 * Usage in a route:
 *   const parsed = await parseBody(request, loginSchema)
 *   if (!parsed.ok) return parsed.response
 *   const { email, password } = parsed.data
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200),
})

export const registerSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().max(254),
  companyName: z.string().min(1).max(200),
  password: z.string().min(8).max(200),
  planTier: z.enum(['freemium', 'premium']).optional(),
})

export const financingInquirySchema = z.object({
  userId: z.string().max(64).optional().nullable(),
  dealId: z.string().max(64).optional().nullable(),
  lenderId: z.string().max(64).optional().nullable(),
  region: z.enum(['USA', 'CANADA', 'UAE', 'GLOBAL']),
  requestedAmount: z.number().nonnegative().max(1e13),
  currency: z.string().max(8).optional(),
  downPaymentPct: z.number().min(0).max(100).optional(),
  termMonths: z.number().int().positive().max(600).optional(),
  contactName: z.string().max(120).optional().nullable(),
  contactEmail: z.string().email().max(254).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
})

export const savedSearchSchema = z.object({
  userId: z.string().min(1).max(64),
  name: z.string().min(1).max(120),
  filters: z.union([z.string().max(5000), z.record(z.string(), z.any())]),
  country: z.string().max(64).optional(),
  alertFrequency: z.enum(['INSTANT', 'DAILY', 'WEEKLY']).optional(),
})

export const reviewSchema = z.object({
  authorId: z.string().min(1).max(64),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(160),
  comment: z.string().min(1).max(5000),
  dealId: z.string().max(64).optional().nullable(),
  communicationScore: z.number().int().min(1).max(5).optional(),
  transparencyScore: z.number().int().min(1).max(5).optional(),
  outcomeScore: z.number().int().min(1).max(5).optional(),
})

type ParseResult<T> = { ok: true; data: T } | { ok: false; response: NextResponse }

/** Parse + validate a JSON request body against a schema; returns a 400 on failure. */
export async function parseBody<T>(request: Request, schema: z.ZodType<T>): Promise<ParseResult<T>> {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return { ok: false, response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }
  }
  const result = schema.safeParse(json)
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.') || 'body'}: ${i.message}`)
    return { ok: false, response: NextResponse.json({ error: 'Validation failed', issues }, { status: 400 }) }
  }
  return { ok: true, data: result.data }
}
