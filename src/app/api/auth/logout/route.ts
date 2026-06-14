import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookie, getSession } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

/** POST /api/auth/logout — clears the session cookie. */
export async function POST(request: NextRequest) {
  const session = await getSession()
  await clearAuthCookie()
  await logAudit({
    req: request,
    userId: session?.userId ?? null,
    action: 'auth.logout',
    resourceType: 'user',
    resourceId: session?.userId ?? null,
  })
  return NextResponse.json({ success: true })
}
