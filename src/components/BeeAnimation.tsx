'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function BeeAnimation() {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className="relative w-12 h-12 flex items-center justify-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Logo Letter - F */}
      <motion.div
        className="text-2xl font-black text-white"
        animate={{ opacity: isHovering ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        F
      </motion.div>

      {/* Bee Animation Container */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            key="bee-animation"
            className="absolute"
            initial={{ x: -60, y: -60, opacity: 0, scale: 1 }}
            animate={{
              x: [
                -60, // Start far left and up
                -40, // Approaching
                -20, // Getting closer
                0, // At center, looking at us
                12, // Flying through to right
                25, // Exiting right
              ],
              y: [
                -60, // Start high
                -40, // Come down
                -10, // Eye level
                0, // Center (looking at us)
                -5, // Slight up as flying through
                -20, // Exit upward
              ],
              opacity: [0, 1, 1, 1, 1, 0],
              scale: [0.5, 0.8, 1, 1, 0.9, 0.7],
              rotateZ: [45, 20, 0, -20, -45, -60],
            }}
            transition={{
              duration: 2.4,
              ease: 'easeInOut',
              times: [0, 0.2, 0.4, 0.5, 0.75, 1],
            }}
          >
            {/* Bee Body */}
            <motion.div
              className="flex items-center gap-1"
              animate={{
                scaleY: [1, 0.8, 1, 0.8, 1],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
              }}
            >
              {/* Wings - flapping motion */}
              <motion.div
                className="absolute w-8 h-6 opacity-60"
                animate={{
                  scaleY: [1, 0.3, 1],
                  rotate: [0, -15, 0],
                }}
                transition={{
                  duration: 0.15,
                  repeat: Infinity,
                }}
              >
                <svg viewBox="0 0 100 60" className="w-full h-full fill-orange-300">
                  <ellipse cx="25" cy="30" rx="20" ry="25" />
                  <ellipse cx="75" cy="30" rx="20" ry="25" />
                </svg>
              </motion.div>

              {/* Bee Body */}
              <div className="relative z-10 text-2xl">🐝</div>

              {/* Eyes sparkle when looking at camera */}
              {isHovering && (
                <motion.div
                  className="absolute left-5 top-1 text-xs"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{
                    duration: 0.6,
                    delay: 0.9,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                  }}
                >
                  ✨
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Hint */}
      {!isHovering && (
        <motion.div
          className="absolute -bottom-8 text-xs font-medium text-orange-600 pointer-events-none whitespace-nowrap"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Hover to see magic ✨
        </motion.div>
      )}
    </div>
  )
}

// For import statement compatibility
import { AnimatePresence } from 'framer-motion'
