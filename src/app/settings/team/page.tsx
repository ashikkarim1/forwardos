/**
 * /settings/team — workspace management.
 *
 * If you don't have a team yet, surfaces the create-team form.
 * If you do, shows members + pending invites + invite form, all gated by
 * your role (OWNER / ADMIN can invite, MEMBER reads only).
 */
'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, Mail, Plus, ShieldCheck, Users } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import {
  Badge, Button, Card, EmptyState, Heading, Mono, Overline,
  TextField, Select, Text, toast,
} from '@/components/ui'
import { semantic, space } from '@/styles/tokens'

interface Member {
  id: string
  userId: string
  role: string
  joinedAt: string
  name: string | null
  email: string | null
}

interface PendingInvite {
  id: string
  email: string
  role: string
  expiresAt: string
  createdAt: string
}

interface TeamState {
  team: { id: string; name: string; createdAt: string } | null
  role?: string
  members?: Member[]
  invites?: PendingInvite[]
}

export default function TeamSettingsPage() {
  const [state, setState] = useState<TeamState | null>(null)
  const [busy, setBusy] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('MEMBER')

  async function refresh() {
    const r = await fetch('/api/team', { credentials: 'same-origin' })
    const data = await r.json()
    if (!r.ok) {
      toast.error(data?.error || 'Failed to load team')
      return
    }
    setState(data)
  }

  useEffect(() => { refresh() }, [])

  async function createTeam() {
    if (!teamName.trim()) return
    setBusy(true)
    try {
      const r = await fetch('/api/team', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName.trim() }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || 'Failed to create team.')
      toast.success(`Team "${teamName.trim()}" created`)
      setTeamName('')
      refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create team.')
    } finally { setBusy(false) }
  }

  async function sendInvite() {
    if (!inviteEmail.trim()) return
    setBusy(true)
    try {
      const r = await fetch('/api/team/invite', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.trim().toLowerCase(), role: inviteRole }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || 'Failed to invite.')
      toast.success(`Invite sent to ${inviteEmail.trim().toLowerCase()}`)
      setInviteEmail('')
      refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to invite.')
    } finally { setBusy(false) }
  }

  const canInvite = state?.role === 'OWNER' || state?.role === 'ADMIN'

  return (
    <div style={{ minHeight: '100vh', background: semantic.surface.cream }}>
      <PublicHeader />
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: `${space[8]} ${space[6]} ${space[16]}` }}>
        <Overline tone="brand">Settings</Overline>
        <Heading level={1} style={{ marginTop: space[2] }}>Team workspace</Heading>
        <Text size="bodyLg" tone="secondary" style={{ marginTop: space[2], marginBottom: space[8] }}>
          Add teammates so analyst and partner work happens in one Forward account — with a shared deal history, shared saved views, and one billing surface.
        </Text>

        {state === null ? (
          <Card><Text tone="tertiary">Loading…</Text></Card>
        ) : state.team === null ? (
          <Card>
            <Heading level={3}>Create your team</Heading>
            <Text size="bodySm" tone="secondary" style={{ marginTop: space[2], marginBottom: space[5] }}>
              You're the OWNER. You can add ADMINs (who can also invite) and MEMBERs (who can read + act on their own).
            </Text>
            <div style={{ display: 'flex', gap: space[3], alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Team name"
                  placeholder="e.g. UpCapital Partners"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') createTeam() }}
                />
              </div>
              <Button variant="primary" onClick={createTeam} loading={busy} disabled={!teamName.trim()} leftIcon={<Plus size={14} />}>
                Create team
              </Button>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[6] }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space[3] }}>
                <div>
                  <Overline tone="brand">Team</Overline>
                  <Heading level={3} style={{ marginTop: space[1] }}>{state.team.name}</Heading>
                  <Text size="bodySm" tone="tertiary" style={{ marginTop: space[2] }}>
                    Created {new Date(state.team.createdAt).toLocaleDateString()} · You are {state.role}.
                  </Text>
                </div>
                <Badge tone={state.role === 'OWNER' ? 'brand' : 'default'} size="md" leftIcon={<ShieldCheck size={12} />}>{state.role}</Badge>
              </div>
            </Card>

            {canInvite && (
              <Card>
                <Heading level={4}>Invite a teammate</Heading>
                <Text size="bodySm" tone="secondary" style={{ marginTop: space[2], marginBottom: space[4] }}>
                  We'll send a one-time link to their email. The invite expires in 7 days.
                </Text>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: space[3], alignItems: 'flex-end' }}>
                  <TextField
                    label="Email"
                    type="email"
                    placeholder="teammate@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendInvite() }}
                    leftIcon={<Mail size={14} />}
                  />
                  <Select
                    label="Role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    options={[
                      { value: 'MEMBER', label: 'Member' },
                      { value: 'ADMIN',  label: 'Admin'  },
                    ]}
                  />
                  <Button variant="primary" onClick={sendInvite} loading={busy} disabled={!inviteEmail.trim()} rightIcon={<ChevronRight size={14} />}>
                    Send invite
                  </Button>
                </div>
              </Card>
            )}

            <Card padding="none">
              <div style={{ padding: `${space[5]} ${space[6]}`, borderBottom: `1px solid ${semantic.border.subtle}` }}>
                <Heading level={4}>Members ({state.members?.length ?? 0})</Heading>
              </div>
              {!state.members?.length ? (
                <EmptyState icon={<Users size={28} />} title="Just you here for now" body="Invite a teammate to expand the workspace." />
              ) : (
                <div>
                  {state.members.map((m) => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${space[4]} ${space[6]}`, borderBottom: `1px solid ${semantic.border.subtle}` }}>
                      <div>
                        <Text size="bodySm" tone="primary" style={{ fontWeight: 600 }}>{m.name || m.email || 'Unnamed user'}</Text>
                        {m.email && <Mono tone="tertiary">{m.email}</Mono>}
                      </div>
                      <Badge tone={m.role === 'OWNER' ? 'brand' : m.role === 'ADMIN' ? 'success' : 'default'}>{m.role}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {state.invites && state.invites.length > 0 && (
              <Card padding="none">
                <div style={{ padding: `${space[5]} ${space[6]}`, borderBottom: `1px solid ${semantic.border.subtle}` }}>
                  <Heading level={4}>Pending invites ({state.invites.length})</Heading>
                </div>
                {state.invites.map((inv) => (
                  <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${space[4]} ${space[6]}`, borderBottom: `1px solid ${semantic.border.subtle}` }}>
                    <div>
                      <Text size="bodySm" tone="primary" style={{ fontWeight: 600 }}>{inv.email}</Text>
                      <Text size="caption" tone="tertiary">Invited {new Date(inv.createdAt).toLocaleDateString()} · Expires {new Date(inv.expiresAt).toLocaleDateString()}</Text>
                    </div>
                    <Badge tone={inv.role === 'ADMIN' ? 'success' : 'default'}>{inv.role}</Badge>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
