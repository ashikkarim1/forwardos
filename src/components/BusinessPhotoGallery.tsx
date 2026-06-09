'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT } from '@/styles/forward-colors'

interface BusinessPhotoGalleryProps {
  isOpen: boolean
  onClose: () => void
  photos: string[]
  businessType: string
}

export function BusinessPhotoGallery({
  isOpen,
  onClose,
  photos,
  businessType,
}: BusinessPhotoGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-black rounded-2xl max-w-4xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Photo */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={photos[currentPhotoIndex]}
                alt={`${businessType} - Photo ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Photo Counter */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-semibold">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto bg-black/50">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPhotoIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentPhotoIndex ? `border-${COLOR_ACCENT}` : 'border-white/20'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
            >
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
