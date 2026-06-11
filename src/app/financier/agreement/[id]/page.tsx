'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CheckCircle2, FileSignature } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { SignaturePad } from '@/components/SignaturePad'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface Partner {
  id: string; name: string; contactName: string | null; status: string
  referralFeePercent: number | null; referralPlan: string | null
  agreementSignedAt: string | null; agreementSignerName: string | null
}

export default function AgreementPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)
  const [signerName, setSignerName] = useState('')
  const [signerTitle, setSignerTitle] = useState('')
  const [signature, setSignature] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/finance/partners/${id}`).then((r) => r.json()).then((d) => {
      if (d.partner) { setPartner(d.partner); if (d.partner.contactName) setSignerName(d.partner.contactName) }
    }).finally(() => setLoading(false))
  }, [id])

  async function sign() {
    if (!agreed || !signerName || !signature) { setError('Please type your name, draw your signature, and accept the agreement.'); return }
    setState('sending'); setError('')
    try {
      const res = await fetch(`/api/finance/partners/${id}/sign`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerName, signerTitle, signatureDataUrl: signature, agreed: true }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Signing failed'); setState('error'); return }
      setState('done')
    } catch { setError('Request failed'); setState('error') }
  }

  if (loading) return <Shell><p className="px-6 py-16 text-center" style={{ color: COLOR_TEXT_SECONDARY }}>Loading…</p></Shell>
  if (!partner) return <Shell><p className="px-6 py-16 text-center" style={{ color: COLOR_TEXT_SECONDARY }}>Agreement not found.</p></Shell>

  const alreadySigned = partner.status === 'ACTIVE' || partner.agreementSignedAt
  if (state === 'done' || alreadySigned) {
    return (
      <Shell>
        <div className="max-w-xl mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#EAF5F0' }}>
            <CheckCircle2 size={32} style={{ color: '#2D7A5F' }} />
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Agreement signed</h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
            Thank you{partner.agreementSignerName ? `, ${partner.agreementSignerName}` : ''}. Your referral agreement is
            executed and on file. <strong>{partner.name}</strong> is now an active financing partner and is being
            marketed to qualified buyers in our Finance Center.
          </p>
          <Link href="/finance-center" className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
            View the Finance Center
          </Link>
        </div>
      </Shell>
    )
  }

  if (partner.status === 'PENDING') {
    return <Shell><div className="max-w-xl mx-auto px-6 py-20 text-center"><h1 className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Under review</h1><p style={{ color: COLOR_TEXT_SECONDARY }}>Your application is still being reviewed. You&apos;ll receive an email with your agreement once approved.</p></div></Shell>
  }
  if (partner.status === 'REJECTED') {
    return <Shell><div className="max-w-xl mx-auto px-6 py-20 text-center"><h1 className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Application closed</h1><p style={{ color: COLOR_TEXT_SECONDARY }}>This application was not approved. Contact partners@forwardos.ai with questions.</p></div></Shell>
  }

  const feeText = partner.referralFeePercent != null ? `${partner.referralFeePercent}%` : 'the agreed referral fee'

  return (
    <Shell>
      <section className="px-6 py-8 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 text-white" style={{ background: COLOR_ACCENT }}>
            <FileSignature size={13} /> REFERRAL AGREEMENT
          </span>
          <h1 className="text-3xl font-black mb-1" style={{ color: COLOR_PRIMARY }}>Sign your referral agreement</h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>Between <strong>{partner.name}</strong> and <strong>UpCapital Global FZCO</strong> (operator of the Forward OS platform).</p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Agreement body */}
          <div className="bg-white rounded-xl border p-6 md:p-8 mb-6 text-sm leading-relaxed space-y-4" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>
            <p className="text-xs italic" style={{ color: COLOR_TEXT_SECONDARY }}>Draft template — to be finalized by counsel before production use.</p>
            <p><strong>REFERRAL PARTNER AGREEMENT</strong></p>
            <p>This Referral Agreement (the “Agreement”) is entered into between <strong>UpCapital Global FZCO</strong>, a company registered in the UAE and operator of the Forward OS marketplace for buying and selling businesses (the “Platform”), and <strong>{partner.name}</strong> (the “Financing Partner”).</p>
            <p><strong>1. Referrals.</strong> The Platform may refer prospective borrowers (business buyers) to the Financing Partner. The Financing Partner will assess and, at its sole discretion, provide financing to referred parties subject to its own underwriting and applicable law.</p>
            <p><strong>2. Referral Fee.</strong> The Financing Partner agrees to pay the Platform {feeText} of funded loan/financing value (or as otherwise set out in the partner&apos;s submitted referral plan), payable on drawdown, unless the parties agree otherwise in writing.</p>
            <p><strong>3. Marketing.</strong> Upon execution, the Platform will list and market the Financing Partner in its Finance Center to qualified buyers across the USA, Canada, and the UAE.</p>
            <p><strong>4. Compliance.</strong> Each party will comply with all applicable laws, including AML/CFT, sanctions, and data-protection requirements. Nothing herein constitutes the Platform as a lender, broker-dealer, or adviser.</p>
            <p><strong>5. Independent parties; no exclusivity.</strong> The parties are independent contractors. This Agreement is non-exclusive and may be terminated by either party on written notice.</p>
            <p><strong>6. Confidentiality &amp; data.</strong> Each party will protect the other&apos;s confidential information and handle personal data per the Platform Privacy Policy and applicable law.</p>
            <p><strong>7. Governing law.</strong> This Agreement is governed by the laws applicable to UpCapital Global FZCO&apos;s jurisdiction (UAE), with disputes subject to the competent courts there.</p>
            <p>By signing below, the signatory represents they are authorized to bind the Financing Partner to this Agreement.</p>
          </div>

          {/* Signature block */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Sign electronically</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <label className="block"><span className="block text-xs font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>Full legal name *</span>
                <input value={signerName} onChange={(e) => setSignerName(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLOR_BORDER }} /></label>
              <label className="block"><span className="block text-xs font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>Title</span>
                <input value={signerTitle} onChange={(e) => setSignerTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLOR_BORDER }} placeholder="e.g. Director" /></label>
            </div>

            <span className="block text-xs font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>Signature *</span>
            <SignaturePad onChange={setSignature} />

            <label className="flex items-start gap-2 mt-4 cursor-pointer text-sm" style={{ color: COLOR_PRIMARY }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 accent-blue-600" />
              <span>I am authorized to sign on behalf of <strong>{partner.name}</strong>, and I agree to the Referral Partner Agreement with UpCapital Global FZCO. I understand this is a legally binding electronic signature.</span>
            </label>

            {error && <p className="text-sm font-semibold mt-3" style={{ color: '#DC2626' }}>{error}</p>}

            <button onClick={sign} disabled={state === 'sending'} className="mt-4 w-full px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: COLOR_ACCENT }}>
              {state === 'sending' ? 'Signing…' : 'Sign & activate my partnership'}
            </button>
            <p className="text-xs mt-2 text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
              Your signature, name, date, and IP are recorded for the agreement&apos;s audit trail.
            </p>
          </div>
        </div>
      </section>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}><PublicHeader />{children}</div>
}
