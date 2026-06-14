/**
 * /admin/activity — audit log viewer for compliance review.
 *
 * Pulls real AuditLog rows via /api/admin/audit. Token-disciplined; built
 * on <DataTable> + <Badge> + <Mono> for action codes. Supports:
 *
 *   - Search across action, actor, resourceId
 *   - Filter dropdown for top-level action prefix (stripe, auth, dsr…)
 *   - CSV export of the current filter
 *   - Pagination (50/page) with sort by createdAt
 *
 * Designed for the "show me who approved deal X / who triggered the
 * Stripe refund / who exported data on 2026-06-12" question that compliance
 * asks every time, from one page.
 */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, Shield } from 'lucide-react'
import {
  Badge, Button, Card, ColumnDef, DataTable, EmptyState,
  Heading, Mono, Overline, Select, Text, toast,
} from '@/components/ui'
import { space } from '@/styles/tokens'

interface AuditEntry {
  id: string
  action: string
  resourceType: string
  resourceId: string | null
  userId: string | null
  actor: string
  changes: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

function categoryTone(action: string): 'success' | 'warning' | 'danger' | 'brand' | 'default' {
  if (action.startsWith('stripe.')) return 'brand'
  if (action.startsWith('auth.')) return 'success'
  if (action.includes('delete') || action.includes('revoke')) return 'danger'
  if (action.startsWith('dsr.') || action.includes('export')) return 'warning'
  return 'default'
}

function fmtRelative(iso: string): string {
  const now = Date.now()
  const t = new Date(iso).getTime()
  const s = Math.round((now - t) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  if (s < 604800) return `${Math.round(s / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

const PREFIX_OPTIONS = [
  { value: '', label: 'All actions' },
  { value: 'stripe.', label: 'Stripe / billing' },
  { value: 'auth.', label: 'Auth / sessions' },
  { value: 'admin.', label: 'Admin actions' },
  { value: 'dsr.', label: 'Data subject requests' },
  { value: 'kyc.', label: 'KYC / verification' },
  { value: 'deal.', label: 'Deal lifecycle' },
]

export default function AdminActivityPage() {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [prefix, setPrefix] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    const q = prefix ? `?action=${encodeURIComponent(prefix)}` : ''
    setEntries(null)
    fetch(`/api/admin/audit${q}`, { credentials: 'same-origin' })
      .then(async (r) => {
        const data = await r.json()
        if (cancelled) return
        if (!r.ok) {
          setLoadError(data?.error || 'Failed to load audit log.')
          setEntries([])
          return
        }
        setLoadError(null)
        setEntries(Array.isArray(data.entries) ? data.entries : [])
      })
      .catch(() => { if (!cancelled) { setLoadError('Network error.'); setEntries([]) } })
    return () => { cancelled = true }
  }, [prefix])

  const columns = useMemo<ColumnDef<AuditEntry>[]>(() => [
    {
      accessorKey: 'createdAt',
      header: 'When',
      cell: ({ getValue }) => {
        const iso = String(getValue() ?? '')
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '120px' }}>
            <Text size="bodySm" tone="primary">{fmtRelative(iso)}</Text>
            <Text size="caption" tone="tertiary">{new Date(iso).toLocaleString()}</Text>
          </div>
        )
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '220px' }}>
          <Badge tone={categoryTone(row.original.action)}>{row.original.action.split('.')[0]}</Badge>
          <Mono tone="primary">{row.original.action}</Mono>
        </div>
      ),
    },
    {
      accessorKey: 'actor',
      header: 'Actor',
      cell: ({ getValue }) => <Text size="bodySm" tone="primary">{String(getValue() ?? 'system')}</Text>,
    },
    {
      accessorKey: 'resourceType',
      header: 'Resource',
      cell: ({ row }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Text size="bodySm" tone="secondary">{row.original.resourceType}</Text>
          {row.original.resourceId && <Mono tone="tertiary">{row.original.resourceId}</Mono>}
        </div>
      ),
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP',
      cell: ({ getValue }) => {
        const v = String(getValue() ?? '')
        return v ? <Mono tone="tertiary">{v}</Mono> : <Text size="bodySm" tone="muted">—</Text>
      },
    },
  ], [])

  function exportCsv(rows: AuditEntry[]) {
    const header = ['When', 'Action', 'Actor', 'ResourceType', 'ResourceId', 'IP', 'Changes']
    const lines = rows.map((r) => [
      r.createdAt, r.action, r.actor, r.resourceType, r.resourceId ?? '', r.ipAddress ?? '', r.changes ?? '',
    ].map((v) => {
      const s = String(v ?? '')
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
    }).join(','))
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forward-audit-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${rows.length} ${rows.length === 1 ? 'entry' : 'entries'}`)
  }

  return (
    <div style={{ padding: space[8], display: 'flex', flexDirection: 'column', gap: space[6] }}>
      <div>
        <Overline tone="brand">Compliance</Overline>
        <div style={{ marginTop: space[2], display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: space[4], flexWrap: 'wrap' }}>
          <div>
            <Heading level={1}>Audit log</Heading>
            <Text size="bodyLg" tone="secondary" style={{ marginTop: space[2] }}>
              Every privileged action — auth, billing, KYC, admin moderation — recorded for review.
            </Text>
          </div>
          <div style={{ display: 'flex', gap: space[2], alignItems: 'flex-end' }}>
            <div style={{ minWidth: '220px' }}>
              <Select
                label="Filter"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                options={PREFIX_OPTIONS}
              />
            </div>
            <Button variant="secondary" leftIcon={<Download size={14} />} onClick={() => exportCsv(entries ?? [])}>
              Export
            </Button>
          </div>
        </div>
      </div>

      <Card padding="none">
        <DataTable<AuditEntry>
          data={entries ?? []}
          loading={entries === null}
          columns={columns}
          searchPlaceholder="Search action, actor, resource ID…"
          pageSize={50}
          getRowId={(d) => d.id}
          selectable
          bulkActions={(rows) => (
            <Button variant="ghost" size="sm" leftIcon={<Download size={14} />} onClick={() => exportCsv(rows)}>
              Export {rows.length}
            </Button>
          )}
          emptyState={
            <EmptyState
              icon={<Shield size={28} />}
              title={loadError ?? 'No audit entries match'}
              body={loadError ? 'Make sure you are signed in as an admin.' : 'Try a different filter, or wait for the next privileged action.'}
            />
          }
        />
      </Card>
    </div>
  )
}
