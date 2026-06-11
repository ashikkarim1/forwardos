'use client'

import { useRef, useState, useEffect } from 'react'

/**
 * Lightweight canvas signature pad (no dependencies). Captures a drawn signature
 * and reports it as a PNG data URL via onChange. Supports mouse + touch.
 */
export function SignaturePad({ onChange, height = 160 }: { onChange: (dataUrl: string | null) => void; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Match the backing store to the displayed size for crisp lines.
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = height * ratio
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(ratio, ratio)
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#1A1A1A'
    }
  }, [height])

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const start = (e: React.PointerEvent) => {
    drawing.current = true
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    canvasRef.current!.setPointerCapture(e.pointerId)
  }
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    if (!hasInk) setHasInk(true)
  }
  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    onChange(hasInk ? canvasRef.current!.toDataURL('image/png') : null)
  }
  const clear = () => {
    const canvas = canvasRef.current!
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
    onChange(null)
  }

  return (
    <div>
      <div className="rounded-lg border bg-white" style={{ borderColor: '#D1D5DB' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height, touchAction: 'none', cursor: 'crosshair' }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-slate-400">Draw your signature above</span>
        <button type="button" onClick={clear} className="text-xs font-semibold text-slate-500 hover:text-slate-800">Clear</button>
      </div>
    </div>
  )
}
