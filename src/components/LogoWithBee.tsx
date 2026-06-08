'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { COLOR_ACCENT } from '@/styles/forward-colors'

export function LogoWithBee() {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleHover = () => {
    setIsAnimating(true)
    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 3000)
  }

  return (
    <div
      className="relative w-12 h-12 cursor-pointer"
      onMouseEnter={handleHover}
      style={{ perspective: '1000px' }}
    >
      {/* Background Circle - represents the O in logo */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full absolute"
        animate={{
          filter: isAnimating ? ['drop-shadow(0 0 0px rgba(255,140,0,0))', 'drop-shadow(0 0 8px rgba(255,140,0,0.6))'] : 'drop-shadow(0 0 0px rgba(255,140,0,0))',
        }}
        transition={{ duration: 2.4 }}
      >
        {/* The "F" letter as background */}
        <circle cx="50" cy="50" r="45" fill={COLOR_ACCENT} />
        <text
          x="50"
          y="65"
          fontSize="60"
          fontWeight="900"
          fill="white"
          textAnchor="middle"
          fontFamily="system-ui"
        >
          F
        </text>
      </motion.svg>

      {/* Custom SVG Bee */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAnimating ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Bee Group with 3D-like motion */}
        <motion.g
          animate={isAnimating ? {
            // Coming from top-left
            x: [-80, -50, -20, 0, 20, 50],
            y: [-80, -50, -20, 0, -10, -40],
            // Rotation for movement direction
            rotateZ: [60, 40, 20, 0, -30, -60],
            // Scale for depth perception
            scale: [0.3, 0.6, 0.85, 1, 0.9, 0.5],
          } : {}}
          transition={{
            duration: 2.8,
            ease: 'easeInOut',
          }}
        >
          {/* Wings with flapping */}
          <motion.g
            animate={isAnimating ? {
              scaleY: [1, 0.2, 1],
              opacity: [0.7, 0.4, 0.7],
            } : {}}
            transition={{
              duration: 0.15,
              repeat: Infinity,
            }}
          >
            {/* Left Wing */}
            <ellipse
              cx="35"
              cy="50"
              rx="16"
              ry="22"
              fill="#FED7AA"
              opacity="0.8"
            />
            {/* Right Wing */}
            <ellipse
              cx="65"
              cy="50"
              rx="16"
              ry="22"
              fill="#FED7AA"
              opacity="0.8"
            />
          </motion.g>

          {/* Head */}
          <circle cx="50" cy="35" r="8" fill="#2D2D2D" />

          {/* Eyes */}
          <motion.circle
            cx="46"
            cy="33"
            r="2"
            fill="white"
            animate={isAnimating ? {
              r: [2, 3, 2],
              opacity: [1, 0.5, 1],
            } : {}}
            transition={{
              duration: 0.5,
              delay: 1.2,
              repeat: 1,
            }}
          />
          <circle cx="54" cy="33" r="2" fill="white" />

          {/* Body - three segments with stripes */}
          <ellipse cx="50" cy="50" rx="12" ry="16" fill="#FCD34D" />
          <ellipse cx="50" cy="68" rx="10" ry="12" fill="#F59E0B" />

          {/* Stripes */}
          <line x1="42" y1="45" x2="58" y2="45" stroke="#F59E0B" strokeWidth="2" />
          <line x1="42" y1="55" x2="58" y2="55" stroke="#F59E0B" strokeWidth="2" />
          <line x1="43" y1="65" x2="57" y2="65" stroke="#2D2D2D" strokeWidth="1.5" />

          {/* Legs */}
          <line x1="40" y1="65" x2="35" y2="75" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="65" x2="50" y2="75" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="65" x2="65" y2="75" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />

          {/* Antennae */}
          <line x1="48" y1="28" x2="42" y2="18" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52" y1="28" x2="58" y2="18" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        {/* Glow effect when bee passes through center */}
        <motion.circle
          cx="50"
          cy="50"
          r="0"
          fill="none"
          stroke={COLOR_ACCENT}
          strokeWidth="2"
          opacity="0"
          animate={isAnimating ? {
            r: [0, 30],
            opacity: [0.8, 0],
          } : {}}
          transition={{
            duration: 0.6,
            delay: 1,
          }}
        />
      </motion.svg>

      {/* Interaction Hint */}
      {!isAnimating && (
        <motion.div
          className="absolute -inset-1 rounded-lg border-2 opacity-0 pointer-events-none"
          style={{ borderColor: COLOR_ACCENT }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  )
}
