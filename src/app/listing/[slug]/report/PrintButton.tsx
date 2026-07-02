'use client'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
      style={{ background: '#0F1419' }}
    >
      Download PDF
    </button>
  )
}
