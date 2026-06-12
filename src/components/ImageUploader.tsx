'use client'

/**
 * Up-to-5 image uploader with cover selection and per-image delete.
 *
 * Behavior:
 *  - Click an empty slot OR drag images onto the dropzone to add them
 *  - Each file uploads immediately to /api/upload (bucket=photos) so the user
 *    sees thumbnails fast; URLs come back and are held in state
 *  - "Set as cover" radio promotes any image to the marketplace cover
 *  - X button removes (uploaded URL stays orphaned in storage — cheap, fine
 *    for now; future cron can sweep unreferenced uploads)
 *  - Recommendation banner: listings with photos get ~3x more inquiries
 *
 * Parent owns the photo list — submit it with the form.
 */
import { useCallback, useRef, useState } from 'react'
import { Camera, Loader, Star, X, AlertCircle, Image as ImageIcon, Plus } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export interface UploadedPhoto {
  url: string
  name: string
}

interface Props {
  photos: UploadedPhoto[]
  setPhotos: (p: UploadedPhoto[]) => void
  coverIndex: number
  setCoverIndex: (i: number) => void
  max?: number
}

export function ImageUploader({ photos, setPhotos, coverIndex, setCoverIndex, max = 5 }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const remaining = max - photos.length

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return
      setError('')
      const toTake = files.slice(0, remaining)
      if (toTake.length === 0) return

      setBusy(true)
      const successes: UploadedPhoto[] = []
      for (const file of toTake) {
        if (!file.type.startsWith('image/')) {
          setError(`"${file.name}" isn't an image — JPG, PNG, or WEBP only.`)
          continue
        }
        if (file.size > 15 * 1024 * 1024) {
          setError(`"${file.name}" is over 15MB — please resize first.`)
          continue
        }
        try {
          const form = new FormData()
          form.append('file', file)
          form.append('bucket', 'photos')
          const r = await fetch('/api/upload', { method: 'POST', body: form })
          const data = await r.json()
          if (!r.ok) throw new Error(data.error || 'Upload failed')
          successes.push({ url: data.url, name: file.name })
        } catch (e) {
          setError(`Couldn't upload "${file.name}": ${e instanceof Error ? e.message : 'failed'}`)
        }
      }
      if (successes.length) setPhotos([...photos, ...successes])
      setBusy(false)
    },
    [photos, setPhotos, remaining],
  )

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    void uploadFiles(files)
    e.target.value = '' // allow re-picking the same file
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    void uploadFiles(files)
  }

  function remove(i: number) {
    const next = photos.filter((_, idx) => idx !== i)
    setPhotos(next)
    if (coverIndex === i) setCoverIndex(0)
    else if (coverIndex > i) setCoverIndex(coverIndex - 1)
  }

  function nudge() {
    if (busy || remaining === 0) return
    inputRef.current?.click()
  }

  return (
    <div>
      <div className="flex items-start gap-2 mb-3">
        <Camera size={16} style={{ color: '#B8956A' }} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
            Add photos <span className="font-normal" style={{ color: COLOR_TEXT_SECONDARY }}>(up to {max})</span>
          </p>
          <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
            Recommended: at least 1 photo. Listings with photos receive roughly 3× more buyer inquiries.
          </p>
        </div>
      </div>

      {/* Grid: filled slots + (one) "add" slot when room remains */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className="rounded-2xl border-2 border-dashed p-3 transition-colors"
        style={{
          borderColor: dragOver ? '#B8956A' : COLOR_BORDER,
          background: dragOver ? '#FAF6EF' : 'white',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={onPick} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {photos.map((p, i) => (
            <PhotoTile
              key={p.url}
              photo={p}
              isCover={i === coverIndex}
              onSetCover={() => setCoverIndex(i)}
              onRemove={() => remove(i)}
            />
          ))}
          {remaining > 0 && (
            <button
              type="button"
              onClick={nudge}
              disabled={busy}
              className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-colors disabled:opacity-50"
              style={{
                borderColor: dragOver ? '#B8956A' : COLOR_BORDER,
                color: dragOver ? '#B8956A' : COLOR_TEXT_SECONDARY,
                background: dragOver ? 'rgba(184,149,106,0.06)' : 'white',
              }}
            >
              {busy ? <Loader size={18} className="animate-spin" /> : <Plus size={18} />}
              {busy ? 'Uploading…' : photos.length === 0 ? 'Add photos' : `Add more (${remaining} left)`}
              {!busy && photos.length === 0 && (
                <span className="text-[10px] font-medium" style={{ color: COLOR_TEXT_SECONDARY }}>
                  or drop here
                </span>
              )}
            </button>
          )}
        </div>

        {photos.length > 0 && (
          <p className="text-[11px] mt-3 flex items-center gap-1.5" style={{ color: COLOR_TEXT_SECONDARY }}>
            <Star size={11} style={{ color: '#B8956A' }} className="fill-current" />
            The starred photo is the cover image shown on the marketplace.
          </p>
        )}
      </div>

      {error && (
        <div className="mt-2 rounded-lg border p-2.5 text-xs flex items-start gap-2" style={{ borderColor: '#FCA5A5', background: '#FEE2E2', color: '#991B1B' }}>
          <AlertCircle size={13} className="mt-0.5 flex-shrink-0" /> {error}
        </div>
      )}

      {photos.length === 0 && !error && (
        <p className="mt-2 text-xs flex items-center gap-1.5" style={{ color: COLOR_TEXT_SECONDARY }}>
          <ImageIcon size={11} /> JPG, PNG, or WEBP · max 15MB each
        </p>
      )}
    </div>
  )
}

function PhotoTile({
  photo, isCover, onSetCover, onRemove,
}: {
  photo: UploadedPhoto
  isCover: boolean
  onSetCover: () => void
  onRemove: () => void
}) {
  return (
    <div
      className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100"
      style={{ outline: isCover ? '3px solid #B8956A' : '1px solid #E5E7EB', outlineOffset: isCover ? -3 : -1 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />

      {/* Cover badge */}
      {isCover && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-black tracking-wide text-white inline-flex items-center gap-1" style={{ background: '#B8956A' }}>
          <Star size={10} className="fill-current" /> COVER
        </div>
      )}

      {/* Hover/touch action bar */}
      <div className="absolute inset-0 flex items-end p-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(15,20,25,0.85) 100%)' }}>
        <div className="flex items-center justify-between w-full">
          {!isCover ? (
            <button
              type="button"
              onClick={onSetCover}
              className="px-2.5 py-1.5 rounded-md text-[10px] font-bold bg-white/95 text-black hover:bg-white inline-flex items-center gap-1"
            >
              <Star size={10} /> Set as cover
            </button>
          ) : <span />}
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove photo"
            className="p-1.5 rounded-md bg-white/95 text-black hover:bg-white"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
