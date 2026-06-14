/**
 * /admin/listings — moderation queue for marketplace deals.
 *
 * Migrated from a 365-line hand-rolled table to the <DataTable> primitive.
 * Demonstrates the canonical pattern for every admin table going forward:
 *
 *   - <DataTable> handles search, sort, paginate, select, bulk actions
 *   - <Badge> for status pills (no more inline colored divs)
 *   - <Button> for row + bulk actions (no more hand-styled buttons)
 *   - <Card> + <Heading> + <Text> for chrome
 *   - 0 inline hex codes anywhere in this file
 *
 * Mock data lives at MOCK_LISTINGS until /api/admin/listings ships. Swap
 * the useState seed for a fetch + Skeleton variant when the API is ready.
 */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle, Download, Eye, Flag, XCircle } from 'lucide-react'
import {
  Badge, Button, Card, ColumnDef, DataTable, EmptyState,
  Heading, Mono, Overline, Text, toast,
} from '@/components/ui'
import { space } from '@/styles/tokens'

type ListingStatus = 'approved' | 'pending' | 'flagged' | 'rejected'
type ListingTier = 'premium' | 'standard' | 'free'

interface AdminListing {
  id: string
  name: string
  location: string
  owner: string
  status: ListingStatus
  tier: ListingTier
  revenue: string
  valuation: string
  views: number
  saves: number
  featured: boolean
  flagReason?: string
}

// Listings load from GET /api/admin/listings (real Neon data). No mock seed.

const STATUS_TONE: Record<ListingStatus, 'success' | 'warning' | 'danger' | 'default'> = {
  approved: 'success',
  pending:  'warning',
  flagged:  'danger',
  rejected: 'default',
}

const TIER_TONE: Record<ListingTier, 'brand' | 'default'> = {
  premium:  'brand',
  standard: 'default',
  free:     'default',
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<AdminListing[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/listings', { credentials: 'same-origin' })
      .then(async (r) => {
        const data = await r.json()
        if (cancelled) return
        if (!r.ok) {
          setLoadError(data?.error || 'Failed to load listings.')
          setListings([])
          return
        }
        setListings(Array.isArray(data.listings) ? data.listings : [])
      })
      .catch(() => { if (!cancelled) { setLoadError('Network error.'); setListings([]) } })
    return () => { cancelled = true }
  }, [])

  const update = (id: string, next: ListingStatus) => {
    setListings((rows) => (rows ?? []).map((r) => (r.id === id ? { ...r, status: next } : r)))
    toast.success(`Listing #${id} marked ${next}`)
  }

  const bulk = (ids: string[], next: ListingStatus) => {
    setListings((rows) => (rows ?? []).map((r) => (ids.includes(r.id) ? { ...r, status: next } : r)))
    toast.success(`${ids.length} listings marked ${next}`)
  }

  const columns = useMemo<ColumnDef<AdminListing>[]>(() => [
    {
      accessorKey: 'id',
      header: 'Ref',
      cell: ({ getValue }) => <Mono tone="tertiary">#{String(getValue() ?? '')}</Mono>,
      size: 64,
    },
    {
      accessorKey: 'name',
      header: 'Listing',
      cell: ({ row }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '240px' }}>
          <Text size="bodySm" tone="primary" style={{ fontWeight: 600 }}>{row.original.name}</Text>
          <Text size="caption" tone="tertiary">{row.original.location} · {row.original.owner}</Text>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Badge tone={STATUS_TONE[row.original.status]}>{row.original.status}</Badge>
          {row.original.flagReason && (
            <Text size="caption" tone="danger">{row.original.flagReason}</Text>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'tier',
      header: 'Tier',
      cell: ({ row }) => <Badge tone={TIER_TONE[row.original.tier]}>{row.original.tier}</Badge>,
    },
    {
      accessorKey: 'revenue',
      header: 'Revenue',
      cell: ({ getValue }) => <Text size="bodySm" tone="secondary">{String(getValue() ?? '—')}</Text>,
    },
    {
      accessorKey: 'valuation',
      header: 'Valuation',
      cell: ({ getValue }) => <Text size="bodySm" tone="primary">{String(getValue() ?? '—')}</Text>,
    },
    {
      accessorKey: 'views',
      header: 'Views',
      cell: ({ getValue }) => <Text size="bodySm" tone="tertiary">{Number(getValue() ?? 0).toLocaleString()}</Text>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const r = row.original
        return (
          <div style={{ display: 'flex', gap: space[1], justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
            {r.status !== 'approved' && (
              <Button variant="ghost" size="sm" leftIcon={<CheckCircle size={12} />} onClick={() => update(r.id, 'approved')}>
                Approve
              </Button>
            )}
            {r.status !== 'rejected' && (
              <Button variant="ghost" size="sm" leftIcon={<XCircle size={12} />} onClick={() => update(r.id, 'rejected')}>
                Reject
              </Button>
            )}
            {r.status !== 'flagged' && (
              <Button variant="ghost" size="sm" leftIcon={<Flag size={12} />} onClick={() => update(r.id, 'flagged')}>
                Flag
              </Button>
            )}
          </div>
        )
      },
    },
  ], [])

  function exportCsv(rows: AdminListing[]) {
    const header = ['Ref', 'Name', 'Location', 'Owner', 'Status', 'Tier', 'Revenue', 'Valuation', 'Views', 'Saves', 'Featured']
    const lines = rows.map((r) => [r.id, r.name, r.location, r.owner, r.status, r.tier, r.revenue, r.valuation, r.views, r.saves, r.featured].map((v) => {
      const s = String(v ?? '')
      return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
    }).join(','))
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forward-admin-listings-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${rows.length} ${rows.length === 1 ? 'listing' : 'listings'} to CSV`)
  }

  return (
    <div style={{ padding: space[8], display: 'flex', flexDirection: 'column', gap: space[6] }}>
      <div>
        <Overline tone="brand">Moderation</Overline>
        <div style={{ marginTop: space[2], display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: space[4], flexWrap: 'wrap' }}>
          <div>
            <Heading level={1}>Listings queue</Heading>
            <Text size="bodyLg" tone="secondary" style={{ marginTop: space[2] }}>
              Review, approve, flag, and manage every marketplace listing.
            </Text>
          </div>
          <div style={{ display: 'flex', gap: space[2] }}>
            <Button variant="ghost" leftIcon={<Eye size={14} />} onClick={() => toast.info('Reviewer log opens next iteration')}>
              Reviewer log
            </Button>
            <Button variant="secondary" leftIcon={<Download size={14} />} onClick={() => exportCsv(listings ?? [])}>
              Export all
            </Button>
          </div>
        </div>
      </div>

      <Card padding="none">
        <DataTable<AdminListing>
          data={listings ?? []}
          loading={listings === null}
          columns={columns}
          searchPlaceholder="Search by listing, owner, or city…"
          selectable
          pageSize={20}
          getRowId={(d) => d.id}
          bulkActions={(rows) => (
            <>
              <Button variant="ghost" size="sm" leftIcon={<CheckCircle size={14} />} onClick={() => bulk(rows.map((r) => r.id), 'approved')}>
                Approve {rows.length}
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Flag size={14} />} onClick={() => bulk(rows.map((r) => r.id), 'flagged')}>
                Flag {rows.length}
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Download size={14} />} onClick={() => exportCsv(rows)}>
                Export
              </Button>
            </>
          )}
          emptyState={
            <EmptyState
              title={loadError ?? 'No listings match your search'}
              body={loadError ? 'Make sure you are signed in as an admin, then reload.' : 'Adjust the filters or wait for the next listing to roll in.'}
            />
          }
        />
      </Card>
    </div>
  )
}
