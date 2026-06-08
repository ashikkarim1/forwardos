import { COLOR_ACCENT } from '@/styles/forward-colors'

export function SellerIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Professional briefcase with chart */}
      <rect x="12" y="24" width="40" height="28" rx="3" fill="none" stroke={COLOR_ACCENT} strokeWidth="2" />
      {/* Handle */}
      <path d="M24 24C24 18 30 14 32 14C34 14 40 18 40 24" stroke={COLOR_ACCENT} strokeWidth="2" fill="none" />
      {/* Chart inside */}
      <path d="M18 40V36M28 40V32M38 40V34M48 40V30" stroke={COLOR_ACCENT} strokeWidth="2" strokeLinecap="round" />
      {/* Accent line */}
      <line x1="12" y1="52" x2="52" y2="52" stroke={COLOR_ACCENT} strokeWidth="2" />
    </svg>
  )
}

export function BuyerIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Magnifying glass with target */}
      <circle cx="26" cy="26" r="16" fill="none" stroke={COLOR_ACCENT} strokeWidth="2" />
      <line x1="40" y1="40" x2="52" y2="52" stroke={COLOR_ACCENT} strokeWidth="2" strokeLinecap="round" />
      {/* Concentric circles (target) */}
      <circle cx="45" cy="35" r="8" fill="none" stroke={COLOR_ACCENT} strokeWidth="1.5" opacity="0.6" />
      <circle cx="45" cy="35" r="4" fill={COLOR_ACCENT} opacity="0.8" />
    </svg>
  )
}

export function BrokerIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Network/connection nodes */}
      <circle cx="20" cy="20" r="6" fill="none" stroke={COLOR_ACCENT} strokeWidth="2" />
      <circle cx="44" cy="20" r="6" fill="none" stroke={COLOR_ACCENT} strokeWidth="2" />
      <circle cx="32" cy="44" r="6" fill="none" stroke={COLOR_ACCENT} strokeWidth="2" />
      {/* Connecting lines */}
      <line x1="26" y1="24" x2="38" y2="40" stroke={COLOR_ACCENT} strokeWidth="2" opacity="0.7" />
      <line x1="38" y1="24" x2="28" y2="40" stroke={COLOR_ACCENT} strokeWidth="2" opacity="0.7" />
      <line x1="20" y1="26" x2="44" y2="26" stroke={COLOR_ACCENT} strokeWidth="2" opacity="0.7" />
      {/* Center accent node */}
      <circle cx="32" cy="32" r="3" fill={COLOR_ACCENT} />
    </svg>
  )
}

export function HeartbeatIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ECG/heartbeat line */}
      <path d="M8 32H20L24 24L28 40L32 32H44L52 32" stroke={COLOR_ACCENT} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Pulse dots */}
      <circle cx="8" cy="32" r="2.5" fill={COLOR_ACCENT} />
      <circle cx="52" cy="32" r="2.5" fill={COLOR_ACCENT} />
    </svg>
  )
}

export function TrendIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ascending trend line */}
      <path d="M12 48L24 36L36 40L52 16" stroke={COLOR_ACCENT} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Data points */}
      <circle cx="12" cy="48" r="3" fill={COLOR_ACCENT} />
      <circle cx="24" cy="36" r="3" fill={COLOR_ACCENT} />
      <circle cx="36" cy="40" r="3" fill={COLOR_ACCENT} />
      <circle cx="52" cy="16" r="3" fill={COLOR_ACCENT} />
      {/* Grid background subtle */}
      <line x1="10" y1="52" x2="54" y2="52" stroke={COLOR_ACCENT} strokeWidth="0.5" opacity="0.2" />
      <line x1="10" y1="12" x2="10" y2="52" stroke={COLOR_ACCENT} strokeWidth="0.5" opacity="0.2" />
    </svg>
  )
}

export function LockIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lock body */}
      <rect x="16" y="28" width="32" height="24" rx="2" fill="none" stroke={COLOR_ACCENT} strokeWidth="2" />
      {/* Lock shackle */}
      <path d="M24 28C24 20 32 16 32 16C32 16 40 20 40 28" fill="none" stroke={COLOR_ACCENT} strokeWidth="2" strokeLinecap="round" />
      {/* Keyhole */}
      <circle cx="32" cy="40" r="3" fill={COLOR_ACCENT} />
    </svg>
  )
}

export function ShieldIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield shape */}
      <path d="M32 12L12 22V36C12 48 32 56 32 56C32 56 52 48 52 36V22L32 12Z" fill="none" stroke={COLOR_ACCENT} strokeWidth="2" strokeLinejoin="round" />
      {/* Checkmark inside */}
      <path d="M26 38L30 42L38 28" stroke={COLOR_ACCENT} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
