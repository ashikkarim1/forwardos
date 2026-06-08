/**
 * WEEK 1: CENTRALIZED DESIGN TOKENS
 * Single source of truth for all design values
 *
 * Usage: import { tokens } from '@/styles/design-tokens'
 */

export const tokens = {
  // ============================================
  // COLOR SYSTEM (36 colors)
  // ============================================
  colors: {
    // Primary Palette - Forward Green
    primary: {
      50: '#f0f7f4',
      100: '#d4ebe6',
      200: '#a8dccf',
      300: '#6ec7b5',
      400: '#4fb5a0',
      500: '#2D7A5F',  // PRIMARY
      600: '#1f5a45',
      700: '#154235',
      800: '#0f2a23',
      900: '#081815',
    },

    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Text Hierarchy
    text: {
      primary: '#1A1A1A',      // Main text
      secondary: '#666666',    // Secondary text (5.1:1 contrast)
      tertiary: '#9ca3af',     // Tertiary text
      muted: '#d1d5db',        // Disabled text
    },

    // Backgrounds
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },

    // Borders & Dividers
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      dark: '#9ca3af',
    },

    // Interactive
    link: {
      default: '#0066cc',
      visited: '#6600cc',
      hover: '#0052a3',
    },

    // Status backgrounds
    statusBg: {
      success: '#ecfdf5',
      warning: '#fffbeb',
      error: '#fef2f2',
      info: '#dbeafe',
    },

    // Status text
    statusText: {
      success: '#065f46',
      warning: '#92400e',
      error: '#7f1d1d',
      info: '#0c4a6e',
    },
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    fontFamily: {
      sans: 'Hanken Grotesk, system-ui, sans-serif',
      mono: 'Menlo, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    letterSpacing: {
      tight: '-0.5px',
      normal: '0px',
      wide: '0.5px',
    },
  },

  // ============================================
  // SPACING (4px grid)
  // ============================================
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
    '5xl': '80px',
  },

  // ============================================
  // COMPONENT-SPECIFIC SPACING
  // ============================================
  componentSpacing: {
    // Page padding by device
    pagePadding: {
      mobile: '16px',
      tablet: '24px',
      desktop: '32px',
    },
    // Space between major sections
    sectionGap: '32px',
    // Card padding
    cardPadding: '24px',
    // Input padding
    inputPadding: '12px 16px',
    // Button padding
    buttonPadding: '12px 24px',
    // Top nav height
    topNavHeight: '64px',
    // Sidebar width
    sidebarWidth: '280px',
  },

  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },

  // ============================================
  // BORDER RADIUS
  // ============================================
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // ============================================
  // TRANSITIONS
  // ============================================
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // ============================================
  // ANIMATIONS
  // ============================================
  animations: {
    timing: {
      fast: 150,
      base: 200,
      slow: 300,
    },
    easing: {
      easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // ============================================
  // RESPONSIVE BREAKPOINTS
  // ============================================
  breakpoints: {
    mobile: '375px',
    tablet: '640px',
    md: '768px',
    lg: '1024px',
    desktop: '1440px',
  },

  // ============================================
  // Z-INDEX SCALE
  // ============================================
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    backdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
  },

  // ============================================
  // BUTTON SPECIFICATIONS
  // ============================================
  buttons: {
    sizes: {
      sm: {
        padding: '8px 12px',
        fontSize: '12px',
        borderRadius: '4px',
      },
      base: {
        padding: '12px 16px',
        fontSize: '14px',
        borderRadius: '6px',
      },
      lg: {
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '8px',
      },
    },
    states: {
      default: 'cursor-pointer transition-all 150ms ease-out',
      hover: 'transform translateY(-2px) shadow-md',
      active: 'transform translateY(0) shadow-sm',
      focus: 'outline-2px outline-offset-2px outline-primary-500',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },

  // ============================================
  // TOUCH TARGETS
  // ============================================
  touchTargets: {
    minimum: '48px',  // WCAG AA minimum
    recommended: '56px',
  },

  // ============================================
  // CONTAINER WIDTHS
  // ============================================
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '1440px',
  },
} as const;

// Export type for strict typing
export type DesignTokens = typeof tokens;
