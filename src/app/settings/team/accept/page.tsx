/**
 * /settings/team/accept?token=... — click-through landing for team invites.
 *
 * Click-to-confirm pattern (same as the email-verify flow): we DON'T accept
 * automatically on page load because email scanners (Microsoft Safe Links,
 * Mimecast) prefetch links and would burn the token before the human ever
 * sees this page. The user has to click "Accept" themselves.
 */
'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { Button, Card, Heading, Overline, Text, toast } from '@/components/ui'
import { semantic, space } from '@/styles/tokens'

export const dynamic = 'force-dynamic'

function AcceptContent() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params?.get('token') ?? ''
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function accept() {
    if (!token) return
    setBusy(true)
    try {
      const r = await fetch('/api/team/accept', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || 'Failed to accept.')
      setDone(true)
      toast.success('You joined the team')
      setTimeout(() => router.push('/settings/team'), 1200)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to accept.')
    } finally { setBusy(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: semantic.surface.cream }}>
      <PublicHeader />
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: `${space[16]} ${space[6]}` }}>
        <Card>
          {done ? (
            <div style={{ textAlign: 'center', padding: space[6] }}>
              <CheckCircle2 size={48} style={{ color: semantic.action.success, margin: '0 auto' }} />
              <Heading level={3} style={{ marginTop: space[4] }}>Welcome aboard</Heading>
              <Text size="bodySm" tone="secondary" style={{ marginTop: space[2] }}>Redirecting to your team workspace…</Text>
            </div>
          ) : !token ? (
            <div>
              <Heading level={3}>Invite link missing its token</Heading>
              <Text size="bodySm" tone="secondary" style={{ marginTop: space[2] }}>
                Ask the person who invited you to resend the email — that link should include a token.
              </Text>
            </div>
          ) : (
            <div>
              <Overline tone="brand">Team invite</Overline>
              <Heading level={2} style={{ marginTop: space[2] }}>You've been invited to join a team</Heading>
              <Text size="bodyLg" tone="secondary" style={{ marginTop: space[3], marginBottom: space[5] }}>
                Click below to accept. The link expires 7 days after it was sent.
              </Text>
              <Button variant="primary" size="lg" onClick={accept} loading={busy} rightIcon={<ArrowRight size={16} />}>
                Accept invitation
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default function AcceptPage() {
  return (
    <Suspense fallback={null}>
      <AcceptContent />
    </Suspense>
  )
}
