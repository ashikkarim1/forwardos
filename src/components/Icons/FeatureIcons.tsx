'use client'

import { COLOR_ACCENT } from '@/styles/forward-colors'

/**
 * Professional Feature Icons
 * Modern, minimal line-style icons with orange accents
 * Consistent styling across entire platform
 */

// Heat Maps - Fire
export function HeatMapIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="32" r="28" stroke={COLOR_ACCENT} strokeWidth="1.5" opacity="0.2" />
      <path
        d="M32 16C26 20 22 26 22 32C22 39.7 26.9 46.4 32 48.8C37.1 46.4 42 39.7 42 32C42 26 38 20 32 16Z"
        stroke={COLOR_ACCENT}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="32" cy="32" r="4" fill={COLOR_ACCENT} />
    </svg>
  )
}

// Predictions - Binoculars
export function PredictionsIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="20" cy="32" r="8" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="44" cy="32" r="8" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="28" y1="32" x2="36" y2="32" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="20" cy="32" r="4" fill={COLOR_ACCENT} opacity="0.5" />
      <circle cx="44" cy="32" r="4" fill={COLOR_ACCENT} opacity="0.5" />
    </svg>
  )
}

// Comparables - Chart Bar
export function ComparablesIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="16" y="36" width="6" height="12" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <rect x="29" y="28" width="6" height="20" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <rect x="42" y="20" width="6" height="28" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <line x1="12" y1="50" x2="52" y2="50" stroke={COLOR_ACCENT} strokeWidth="1.5" />
    </svg>
  )
}

// Real-Time Feeds - Eye
export function FeedsIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8 32C8 32 16 20 32 20C48 20 56 32 56 32C56 32 48 44 32 44C16 44 8 32 8 32Z" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="32" cy="32" r="8" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="32" cy="32" r="4" fill={COLOR_ACCENT} />
    </svg>
  )
}

// Market Trends - Trending Up
export function TrendsIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M12 48L22 36L32 40L52 16" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="48" r="2.5" fill={COLOR_ACCENT} />
      <circle cx="22" cy="36" r="2.5" fill={COLOR_ACCENT} />
      <circle cx="32" cy="40" r="2.5" fill={COLOR_ACCENT} />
      <circle cx="52" cy="16" r="2.5" fill={COLOR_ACCENT} />
    </svg>
  )
}

// Global Coverage - Globe
export function GlobalIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="32" r="20" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <ellipse cx="32" cy="32" rx="20" ry="6" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="32" y1="12" x2="32" y2="52" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <path d="M12 32C12 26 20 22 32 22C44 22 52 26 52 32" stroke={COLOR_ACCENT} strokeWidth="1.5" />
    </svg>
  )
}

// Data Room - Folder/Files
export function DataRoomIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M10 16H54V50C54 52 52.5 54 50 54H14C11.5 54 10 52 10 50V16Z" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="20" y1="25" x2="44" y2="25" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="20" y1="33" x2="44" y2="33" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="20" y1="41" x2="36" y2="41" stroke={COLOR_ACCENT} strokeWidth="1.5" />
    </svg>
  )
}

// Communication - Message
export function MessagingIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8 12H56C58.2 12 60 13.8 60 16V40C60 42.2 58.2 44 56 44H32L16 54V44H8C5.8 44 4 42.2 4 40V16C4 13.8 5.8 12 8 12Z" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="16" y1="28" x2="48" y2="28" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="16" y1="35" x2="36" y2="35" stroke={COLOR_ACCENT} strokeWidth="1.5" />
    </svg>
  )
}

// Deal/Transaction - Handshake
export function DealIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M12 40C12 35 15 30 20 28" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <path d="M52 40C52 35 49 30 44 28" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="26" r="4" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <circle cx="44" cy="26" r="4" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <path d="M24 30L40 30" stroke={COLOR_ACCENT} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// Analytics/Performance - Dashboard
export function AnalyticsIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="8" y="12" width="48" height="40" rx="2" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <rect x="14" y="20" width="8" height="24" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <rect x="28" y="24" width="8" height="20" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <rect x="42" y="16" width="8" height="28" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

// Success/Verification - Checkmark Circle
export function SuccessIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="32" r="24" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <path d="M24 32L30 40L44 24" stroke={COLOR_ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Security/Lock - Lock Icon
export function SecurityIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="16" y="28" width="32" height="24" rx="2" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <path d="M24 28C24 20 32 16 32 16C32 16 40 20 40 28" fill="none" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="32" cy="40" r="3" fill={COLOR_ACCENT} />
    </svg>
  )
}

// Network/Integration - Connected Nodes
export function IntegrationIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="16" cy="16" r="5" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="48" cy="16" r="5" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="32" cy="48" r="5" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="21" y1="18" x2="43" y2="18" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="20" y1="22" x2="28" y2="44" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="44" y1="22" x2="36" y2="44" stroke={COLOR_ACCENT} strokeWidth="1.5" />
    </svg>
  )
}

// Time/Timeline - Clock
export function TimelineIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="32" r="22" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="32" y1="12" x2="32" y2="22" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="32" y1="32" x2="32" y2="42" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="32" y1="32" x2="42" y2="32" stroke={COLOR_ACCENT} strokeWidth="1.5" />
    </svg>
  )
}

// Risk - Alert/Warning
export function RiskIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M32 8L56 50H8L32 8Z" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="42" r="2" fill={COLOR_ACCENT} />
      <line x1="32" y1="28" x2="32" y2="38" stroke={COLOR_ACCENT} strokeWidth="1.5" />
    </svg>
  )
}

// Pipeline/Progress - Steps
export function PipelineIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="14" cy="32" r="6" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="32" cy="32" r="6" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="50" cy="32" r="6" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="20" y1="32" x2="26" y2="32" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <line x1="38" y1="32" x2="44" y2="32" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="14" cy="32" r="3" fill={COLOR_ACCENT} />
    </svg>
  )
}

// Export/Download
export function ExportIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M10 36V50C10 52 12 54 14 54H50C52 54 54 52 54 50V36" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
      <path d="M32 12V40" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <path d="M22 30L32 40L42 30" stroke={COLOR_ACCENT} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

// Settings/Configuration
export function SettingsIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="32" r="6" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <path d="M40 32V20M24 32V20M40 32V44M24 32V44" stroke={COLOR_ACCENT} strokeWidth="1.5" />
      <circle cx="40" cy="20" r="2" fill={COLOR_ACCENT} />
      <circle cx="24" cy="20" r="2" fill={COLOR_ACCENT} />
      <circle cx="40" cy="44" r="2" fill={COLOR_ACCENT} />
      <circle cx="24" cy="44" r="2" fill={COLOR_ACCENT} />
    </svg>
  )
}

// Wrapper component for consistent styling
interface IconProps {
  size?: number
  className?: string
}

const iconComponents = {
  heatMap: HeatMapIcon,
  predictions: PredictionsIcon,
  comparables: ComparablesIcon,
  feeds: FeedsIcon,
  trends: TrendsIcon,
  global: GlobalIcon,
  dataRoom: DataRoomIcon,
  messaging: MessagingIcon,
  deal: DealIcon,
  analytics: AnalyticsIcon,
  success: SuccessIcon,
  security: SecurityIcon,
  integration: IntegrationIcon,
  timeline: TimelineIcon,
  risk: RiskIcon,
  pipeline: PipelineIcon,
  export: ExportIcon,
  settings: SettingsIcon,
}

export function FeatureIcon({ name, size = 64 }: { name: keyof typeof iconComponents; size?: number }) {
  const Component = iconComponents[name]
  if (!Component) return null

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `${COLOR_ACCENT}20`,
      }}
    >
      <div style={{ width: `${size * 0.6}px`, height: `${size * 0.6}px` }}>
        <Component />
      </div>
    </div>
  )
}

export default iconComponents
