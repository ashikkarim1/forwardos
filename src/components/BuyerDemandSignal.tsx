'use client'

/**
 * Live buyer-demand signal — reduces the seller's "is anyone even here?"
 * objection on the seller landing surfaces. Reads from /api/buyer-demand
 * which counts recent searches + active buyer sessions from the DB.
 */
import { useEffect, useState } from 'react'
import { Users, Sparkles } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface DemandData {
  activeBuyers: number
  searchesThisWeek: number
  lastActivityMinutes: number
  topIndustriesSearched: string[]
}

export function BuyerDemandSignal({ industry }: { industry?: string } = {}) {
  const [data, setData] = useState<DemandData | null>(null)
  useEffect(() => {
    fetch(industry ? `/api/buyer-demand?industry=${industry}` : '/api/buyer-demand')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
  }, [industry])

  if (!data) return null

  return (
    <div className="rounded-xl border p-4 inline-flex items-center gap-3 bg-white" style={{ borderColor: COLOR_BORDER }}>
      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2D7A5F' }} />
      <div className="text-left">
        <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
          {data.activeBuyers.toLocaleString()} verified buyers active
        </p>
        <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
          {data.searchesThisWeek.toLocaleString()} searches this week
          {data.lastActivityMinutes <= 60 && ` · last activity ${data.lastActivityMinutes} min ago`}
        </p>
      </div>
    </div>
  )
}

/** A larger variant for hero sections — shows top searched industries. */
export function BuyerDemandHero({ industry }: { industry?: string } = {}) {
  const [data, setData] = useState<DemandData | null>(null)
  useEffect(() => {
    fetch(industry ? `/api/buyer-demand?industry=${industry}` : '/api/buyer-demand')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
  }, [industry])

  if (!data) return null

  return (
    <div className="rounded-2xl border p-5 bg-white max-w-md mx-auto" style={{ borderColor: COLOR_BORDER }}>
      <div className="flex items-center gap-2 mb-3">
        <Users size={18} style={{ color: '#2D7A5F' }} />
        <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>Active buyer demand</p>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#2D7A5F' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#2D7A5F' }} />
          live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Stat n={data.activeBuyers} label="verified buyers" />
        <Stat n={data.searchesThisWeek} label="searches / week" />
      </div>
      {data.topIndustriesSearched.length > 0 && (
        <div className="pt-3 border-t" style={{ borderColor: COLOR_BORDER }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={12} style={{ color: COLOR_TEXT_SECONDARY }} />
            <p className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>Most-searched industries this week:</p>
          </div>
          <p className="text-xs" style={{ color: COLOR_PRIMARY }}>{data.topIndustriesSearched.join(' · ')}</p>
        </div>
      )}
    </div>
  )
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>{n.toLocaleString()}</p>
      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
    </div>
  )
}
