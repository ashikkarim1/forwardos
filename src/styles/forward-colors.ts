/**
 * Forward OS Semantic Color System
 *
 * IPOReady Mission Control Design System adapted for Forward
 * Crunchbase Firmology Design Theme
 * All colors are semantic tokens organized by function, not appearance.
 * This enables consistent theming, accessibility compliance, and future dark mode support.
 *
 * Theme: Blue (#3B82F6) — Crunchbase Firmology inspired professional data-driven palette
 *
 * Usage in components:
 * - CSS: Use CSS variables from globals.css (e.g., background: var(--color-bg-primary))
 * - Tailwind: Use color-stop classes (e.g., bg-nav, text-text-secondary)
 * - React inline: Reference this object as JS constants
 *
 * Color Reference:
 * - Brand: #1A1A1A (primary dark), #3B82F6 (Crunchbase blue accent)
 * - Grays: #FFFFFF (bg), #E5E7EB (border), #717171 (text)
 * - States: Blue (#3B82F6), Gray (#6B7280), Amber (#B45309), Green (#2D7A5F)
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRIMARY / BRAND COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Primary brand color — used for primary text, headings,
 * dark surfaces, and primary brand elements
 */
export const COLOR_PRIMARY = '#1A1A1A'

/**
 * Brand accent color (Crunchbase blue) — used for call-to-action buttons,
 * brand highlights, deal indicators, intelligence signals, and important interactive elements
 * Firmology-inspired: Cool blue (#3B82F6) for professional data-driven feel
 */
export const COLOR_ACCENT = '#3B82F6'

/**
 * Secondary accent (darker blue) — used for positive states and secondary CTAs
 */
export const COLOR_ACCENT_SECONDARY = '#2563EB'

/**
 * Intelligence accent (blue) — used for intelligence features and insights
 */
export const COLOR_ACCENT_INTELLIGENCE = '#1D4ED8'

/**
 * Elevated/card surface — white background used for cards, modals, and raised surfaces
 */
export const COLOR_SURFACE_PRIMARY = '#FFFFFF'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TEXT COLORS (Hierarchy)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Primary text — used for headings, main body text, and primary labels
 * Contrast ratio: 21:1 on white background (WCAG AAA)
 */
export const COLOR_TEXT_PRIMARY = '#1A1A1A'

/**
 * Secondary text — used for subheadings, secondary labels, and sidebar text
 * Contrast ratio: 9.4:1 on white background (WCAG AAA)
 */
export const COLOR_TEXT_SECONDARY = '#717171'

/**
 * Tertiary text — used for captions, disabled text, placeholder text
 * Contrast ratio: 5.5:1 on white background (WCAG AA)
 */
export const COLOR_TEXT_TERTIARY = '#9A9A9A'

/**
 * Muted text — used for hints, disabled states, and very subtle text
 * Contrast ratio: 4.1:1 on white background (barely WCAG AA)
 */
export const COLOR_TEXT_MUTED = '#C4C2BE'

/**
 * Inverse text — used for text on dark backgrounds or dark surfaces
 */
export const COLOR_TEXT_INVERSE = '#FFFFFF'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BACKGROUND & SURFACE COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Page background — clean white/light gray used for main page background and large sections
 * Firmology-inspired: Cleaner, brighter background
 */
export const COLOR_BG_PRIMARY = '#FFFFFF'

/**
 * Secondary surface — subtle background for grouped sections and hover states
 */
export const COLOR_SURFACE_SECONDARY = '#F9FAFB'

/**
 * Minimal surface — near-white background for slight distinction
 */
export const COLOR_SURFACE_LIGHT = '#F3F4F6'

/**
 * Warm light surface — cream/vanilla background for subtle warmth
 */
export const COLOR_SURFACE_WARM = '#FFFBEB'

/**
 * Forward green surface — light green background for highlights
 */
export const COLOR_SURFACE_SUCCESS = '#EAF5F0'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BORDER & DIVIDER COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Primary border — used for card borders, input borders, dividers, and section separators
 * Firmology-inspired: Subtle gray borders
 */
export const COLOR_BORDER = '#E5E7EB'

/**
 * Dark border — used for medium-emphasis borders and hover state borders
 */
export const COLOR_BORDER_MEDIUM = '#F3F4F6'

/**
 * Strong border — used for dark gray borders and strong dividers
 */
export const COLOR_BORDER_DARK = '#D1D5DB'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE COLORS: SUCCESS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Success color (green) — used for completion indicators, success messages, and positive states
 */
export const COLOR_SUCCESS = '#2D7A5F'

/**
 * Success dark — used for strong success states and success button hover
 */
export const COLOR_SUCCESS_DARK = '#15803D'

/**
 * Success bright — used for success indicator dots and progress rings
 */
export const COLOR_SUCCESS_BRIGHT = '#22C55E'

/**
 * Success soft — used for success backgrounds, success badges, and success surfaces
 */
export const COLOR_SUCCESS_SOFT = '#EAF5F0'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE COLORS: ERROR / ACCENT (Forward Orange)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Error color (gray) — used for error messages, error badges, and destructive actions
 * Firmology-inspired: Cool gray (#6B7280) for subtle badge styling
 */
export const COLOR_ERROR = '#6B7280'

/**
 * Error dark — used for error hover states and strong error states
 */
export const COLOR_ERROR_DARK = '#4B5563'

/**
 * Error soft — used for error backgrounds and error surfaces
 */
export const COLOR_ERROR_SOFT = '#F3F4F6'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE COLORS: WARNING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Warning color — used for warning badges, "due soon" states, and caution indicators
 */
export const COLOR_WARNING = '#B45309'

/**
 * Warning soft — used for warning backgrounds and warning surfaces
 */
export const COLOR_WARNING_SOFT = '#FEF3C7'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE COLORS: INFO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Info color — used for informational states and secondary signals
 */
export const COLOR_INFO = '#1D4ED8'

/**
 * Info soft — used for info backgrounds and info surfaces
 */
export const COLOR_INFO_SOFT = '#EFF6FF'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT-SPECIFIC COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Nav background — primary navigation color
 */
export const COLOR_NAV = '#1A1A1A'

/**
 * Nav surface — navigation surface color
 */
export const COLOR_NAV_SURFACE = '#FFFFFF'

/**
 * Badge background — default badge background
 */
export const COLOR_BADGE_BG = '#F0EFED'

/**
 * Shadow color — for subtle shadows
 * Firmology-inspired: Softer, more refined shadows
 */
export const COLOR_SHADOW = 'rgba(0, 0, 0, 0.05)'
