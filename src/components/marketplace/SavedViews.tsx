/**
 * SavedViews — localStorage-backed named view manager for the marketplace.
 *
 * PE / family-office buyers run the same searches every morning. Saving a
 * named view (e.g. "UAE SaaS · $1-5M · Heat 70+") and one-clicking it back
 * later is the #1 retention feature on Affinity / Carta deal-flow surfaces.
 *
 * Storage:
 *   localStorage key 'fw.savedViews.v1' → JSON [{ id, name, query, createdAt }]
 *
 * Query is the URL search string captured at save time. Re-applying a view
 * just calls router.push() with that query — the marketplace page already
 * reads filters from URL params, so this works without changing marketplace
 * filter logic.
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, BookmarkPlus, Star, Trash2 } from 'lucide-react'
import {
  Button, EmptyState, Modal, ModalActions, TextField,
  Text, toast,
} from '@/components/ui'
import { palette, semantic, radius, space, typography } from '@/styles/tokens'

interface SavedView {
  id: string
  name: string
  query: string
  createdAt: number
}

const STORAGE_KEY = 'fw.savedViews.v1'

function loadViews(): SavedView[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((v) => v && typeof v.id === 'string' && typeof v.name === 'string' && typeof v.query === 'string')
  } catch {
    return []
  }
}

function persist(views: SavedView[]): void {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(views)) } catch {}
}

export function SavedViewsMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [name, setName] = useState('')
  const [views, setViews] = useState<SavedView[]>([])
  // Read the URL search string directly from the browser instead of via
  // useSearchParams(), which would force the page into a Suspense boundary
  // and break static prerender on Next 14. Updates whenever Save is opened.
  const [currentQuery, setCurrentQuery] = useState('')

  useEffect(() => {
    setViews(loadViews())
    if (typeof window !== 'undefined') {
      setCurrentQuery(window.location.search.replace(/^\?/, ''))
    }
  }, [saveOpen, open])

  const hasActiveFilters = currentQuery.length > 0

  function apply(view: SavedView) {
    router.push(`/marketplace?${view.query}`)
    setOpen(false)
    toast.success(`Applied "${view.name}"`)
  }

  function remove(id: string) {
    const next = views.filter((v) => v.id !== id)
    setViews(next)
    persist(next)
    toast.success('View removed')
  }

  function save() {
    const trimmed = name.trim()
    if (!trimmed) return
    const view: SavedView = {
      id: `v_${Math.random().toString(36).slice(2, 10)}`,
      name: trimmed.slice(0, 80),
      query: currentQuery,
      createdAt: Date.now(),
    }
    const next = [view, ...views].slice(0, 25)   // soft cap
    setViews(next)
    persist(next)
    setName('')
    setSaveOpen(false)
    toast.success(`Saved view "${view.name}"`)
  }

  return (
    <>
      <div style={{ display: 'inline-flex', gap: space[2] }}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Bookmark size={14} />}
          onClick={() => setOpen(true)}
        >
          Saved views{views.length > 0 ? ` · ${views.length}` : ''}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<BookmarkPlus size={14} />}
            onClick={() => setSaveOpen(true)}
          >
            Save this view
          </Button>
        )}
      </div>

      {/* List modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Saved views"
        description="One-click jump back to a search you've named. Stored on this device."
        size="md"
      >
        {views.length === 0 ? (
          <EmptyState
            icon={<Star size={28} />}
            title="No saved views yet"
            body="Apply filters on the marketplace and click 'Save this view' to keep them."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
            {views.map((v) => (
              <div
                key={v.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: space[3],
                  padding: `${space[3]} ${space[4]}`,
                  border: `1px solid ${semantic.border.subtle}`,
                  borderRadius: radius.md,
                  background: semantic.surface.default,
                  cursor: 'pointer',
                }}
                onClick={() => apply(v)}
                onMouseEnter={(e) => { e.currentTarget.style.background = palette.cream[50] }}
                onMouseLeave={(e) => { e.currentTarget.style.background = semantic.surface.default }}
              >
                <Bookmark size={16} style={{ color: semantic.text.brand, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Text size="bodySm" tone="primary" style={{ fontWeight: 600 }}>{v.name}</Text>
                  <Text size="caption" tone="tertiary" style={{
                    fontFamily: typography.fontFamily.mono,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '380px',
                    display: 'block',
                  }}>
                    {v.query || '(no filters)'}
                  </Text>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 size={12} />}
                  onClick={(e) => { e.stopPropagation(); remove(v.id) }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Save modal */}
      <Modal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        title="Save this view"
        description="Give the current filter set a name so you can apply it later in one click."
        size="sm"
      >
        <TextField
          autoFocus
          label="View name"
          placeholder="e.g. UAE SaaS · $1-5M · Heat 70+"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save() }}
        />
        <ModalActions>
          <Button variant="secondary" onClick={() => setSaveOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!name.trim()}>Save</Button>
        </ModalActions>
      </Modal>
    </>
  )
}
