/**
 * Forward Intelligence — Design Tokens
 *
 * The single source of truth for color, typography, spacing, radius, shadow,
 * and motion. Nothing in src/ should reference a hex code, a px value, or a
 * font-size that isn't sourced from here.
 *
 * Brand philosophy:
 *   - Champagne is the BRAND color — it carries identity, premium moments,
 *     selection states, premium-tier badges, brand storytelling.
 *   - Ink is the PRIMARY ACTION color — every primary CTA, every heading.
 *     Luxury reads through ink-on-cream restraint, not loud color.
 *   - Cream is the editorial BACKGROUND tone for marketing surfaces.
 *     White (#FFFFFF) is the operational background for in-app surfaces.
 *   - Emerald / Amber / Crimson are functional only (success / warning / danger).
 *     Never use them for brand expression.
 *
 * If a shade is missing from a scale, extend the scale here — never invent
 * a one-off hex in a component file.
 */

// ━━━ COLOR PALETTE — 50→900 scales ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const palette = {
  // Champagne — brand identity. 500 is the historical brand hex.
  champagne: {
    50:  '#FAF6EF',
    100: '#F2EAD9',
    200: '#E5D5B5',
    300: '#D4BB8C',
    400: '#C4A475',
    500: '#B8956A',  // canonical brand hex
    600: '#A3805A',
    700: '#8C6D45',
    800: '#6E5535',
    900: '#4D3A22',
  },
  // Ink — primary text, primary CTAs, dark UI surfaces. Editorial near-black.
  ink: {
    50:  '#F7F8F9',
    100: '#E8EAED',
    200: '#C7CCD3',
    300: '#9CA3AE',
    400: '#6C7480',
    500: '#454D58',
    600: '#2D343C',
    700: '#1A1F26',
    800: '#0F1419',  // canonical ink hex
    900: '#070A0D',
  },
  // Cream — editorial background tone. Used on marketing surfaces and as a
  // subtle in-app section background.
  cream: {
    50:  '#FFFDF9',
    100: '#FAF6EF',  // canonical cream hex
    200: '#F4F2EE',
    300: '#EDE8DF',
    400: '#E0D8C9',
    500: '#CFC4AE',
    600: '#A89C82',
    700: '#7A6F58',
    800: '#52483A',
    900: '#2F291F',
  },
  // Emerald — success only.
  emerald: {
    50:  '#EAF5F0',
    100: '#C8E3D3',
    200: '#9CCBB0',
    300: '#6DB088',
    400: '#4A9A6E',
    500: '#2D7A5F',  // canonical success hex
    600: '#256451',
    700: '#1B4D3F',
    800: '#13362C',
    900: '#0B2018',
  },
  // Amber — warning / advisory. Never decorative.
  amber: {
    50:  '#FFFAE6',
    100: '#FFEEB5',
    200: '#FFDE7A',
    300: '#F5C44A',
    400: '#E5A82C',
    500: '#B45309',
    600: '#974309',
    700: '#7A3608',
    800: '#5C2706',
    900: '#3F1A03',
  },
  // Crimson — danger / destructive only.
  crimson: {
    50:  '#FEEEEC',
    100: '#FCCAC6',
    200: '#F89B94',
    300: '#F26960',
    400: '#E73E31',
    500: '#C42816',
    600: '#9F1F10',
    700: '#7C170A',
    800: '#5A1006',
    900: '#3D0A03',
  },
} as const

// ━━━ SEMANTIC LAYER — reference these in components, not the palette ━━━

export const semantic = {
  surface: {
    default:   '#FFFFFF',
    muted:     palette.ink[50],
    cream:     palette.cream[100],
    raised:    '#FFFFFF',
    inverse:   palette.ink[800],
    overlay:   'rgba(15,20,25,0.55)',
  },
  text: {
    primary:   palette.ink[800],
    secondary: palette.ink[500],
    tertiary:  palette.ink[400],
    muted:     palette.ink[300],
    inverse:   '#FFFFFF',
    brand:     palette.champagne[700],   // champagne text reads premium at 700
    link:      palette.champagne[700],
  },
  border: {
    subtle:    palette.ink[100],
    default:   palette.ink[200],
    strong:    palette.ink[400],
    brand:     palette.champagne[400],
    inverse:   palette.ink[700],
  },
  action: {
    // Primary actions are ink — luxurious, confident, premium.
    primary:        palette.ink[800],
    primaryHover:   palette.ink[700],
    primaryActive:  palette.ink[900],
    // Brand / accent moments — champagne. Use for premium tiers, brand CTAs,
    // featured-placement highlights.
    accent:         palette.champagne[500],
    accentHover:    palette.champagne[600],
    accentActive:   palette.champagne[700],
    // Functional states.
    success:        palette.emerald[500],
    warning:        palette.amber[500],
    danger:         palette.crimson[500],
    dangerHover:    palette.crimson[600],
  },
  status: {
    info:           palette.champagne[500],
    success:        palette.emerald[500],
    warning:        palette.amber[500],
    danger:         palette.crimson[500],
    infoSoft:       palette.champagne[50],
    successSoft:    palette.emerald[50],
    warningSoft:    palette.amber[50],
    dangerSoft:     palette.crimson[50],
  },
  focus: {
    ring:           palette.champagne[400],
    ringInset:      palette.champagne[200],
  },
} as const

// ━━━ TYPOGRAPHY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const typography = {
  fontFamily: {
    sans: '"Hanken Grotesk", system-ui, -apple-system, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',  // editorial accent only
    mono: '"IBM Plex Mono", ui-monospace, monospace',
  },
  // Named text styles — there are exactly 11. If you need a 12th, add it here.
  style: {
    display:  { fontSize: '64px', lineHeight: '72px', fontWeight: 700, letterSpacing: '-0.02em' },
    h1:       { fontSize: '48px', lineHeight: '56px', fontWeight: 700, letterSpacing: '-0.02em' },
    h2:       { fontSize: '32px', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em' },
    h3:       { fontSize: '24px', lineHeight: '32px', fontWeight: 600, letterSpacing: '0' },
    h4:       { fontSize: '20px', lineHeight: '28px', fontWeight: 600, letterSpacing: '0' },
    h5:       { fontSize: '16px', lineHeight: '24px', fontWeight: 600, letterSpacing: '0' },
    bodyLg:   { fontSize: '17px', lineHeight: '26px', fontWeight: 400, letterSpacing: '0' },
    body:     { fontSize: '14px', lineHeight: '20px', fontWeight: 400, letterSpacing: '0' },
    bodySm:   { fontSize: '13px', lineHeight: '18px', fontWeight: 400, letterSpacing: '0' },
    caption:  { fontSize: '12px', lineHeight: '16px', fontWeight: 500, letterSpacing: '0.02em' },
    overline: { fontSize: '11px', lineHeight: '16px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const },
  },
} as const

// ━━━ SPACING — only these. CI will lint against gap-[13px] etc. ━━━

export const space = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const

// ━━━ RADIUS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const radius = {
  none: '0px',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  '2xl': '24px',
  full: '999px',
} as const

// ━━━ SHADOW — restrained, luxurious. No "glow" effects. ━━━━━━━━━━━━━━

export const shadow = {
  none:   'none',
  sm:     '0 1px 2px 0 rgba(15,20,25,0.05)',
  base:   '0 1px 3px 0 rgba(15,20,25,0.08), 0 1px 2px -1px rgba(15,20,25,0.04)',
  md:     '0 4px 8px -2px rgba(15,20,25,0.08), 0 2px 4px -2px rgba(15,20,25,0.04)',
  lg:     '0 12px 24px -8px rgba(15,20,25,0.10), 0 4px 8px -4px rgba(15,20,25,0.04)',
  xl:     '0 24px 48px -12px rgba(15,20,25,0.14)',
  // Soft inner shadow for inputs in focus state — replaces harsh outlines.
  focus:  `0 0 0 3px ${palette.champagne[200]}`,
} as const

// ━━━ MOTION — Apple-feel, restrained. ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const motion = {
  duration: {
    fast:   '120ms',
    base:   '180ms',
    slow:   '260ms',
    glacial: '420ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
    enter:    'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    exit:     'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
  },
} as const

// ━━━ Z-INDEX ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const z = {
  base:        0,
  raised:      1,
  sticky:      10,
  drawer:      50,
  modal:       100,
  popover:     200,
  toast:       300,
  tooltip:     400,
} as const

// ━━━ LEGACY ALIASES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Re-export the old token names so existing components keep compiling
// while we migrate them. New code should NEVER import from forward-colors.ts.
export const COLOR_PRIMARY = semantic.text.primary
export const COLOR_ACCENT = semantic.action.accent
export const COLOR_ACCENT_HOVER = semantic.action.accentHover
export const COLOR_TEXT_PRIMARY = semantic.text.primary
export const COLOR_TEXT_SECONDARY = semantic.text.secondary
export const COLOR_TEXT_TERTIARY = semantic.text.tertiary
export const COLOR_BORDER = semantic.border.subtle
export const COLOR_BORDER_STRONG = semantic.border.default
export const COLOR_BG_PRIMARY = semantic.surface.default
export const COLOR_BG_CREAM = semantic.surface.cream
export const COLOR_SUCCESS = semantic.status.success
export const COLOR_WARNING = semantic.status.warning
export const COLOR_DANGER = semantic.status.danger
