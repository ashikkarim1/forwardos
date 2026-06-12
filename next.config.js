/** @type {import('next').NextConfig} */

// Content-Security-Policy. Applied in production only (dev needs eval/ws for HMR).
// Inline styles/scripts are allowed because the app uses inline styles and inline
// JSON-LD without nonces; everything else is locked to same-origin + known CDNs.
const csp = [
  "default-src 'self'",
  // Allow Google Analytics gtag.js and Google Tag Manager.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  // GA4 sends pageviews/events to these endpoints.
  "connect-src 'self' https: https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

// Security headers applied to every response.
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), browsing-topics=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // HSTS: force HTTPS for 2 years (browsers ignore it on http/localhost).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  ...(process.env.NODE_ENV === 'production' ? [{ key: 'Content-Security-Policy', value: csp }] : []),
]

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  distDir: '.next',
  output: 'standalone',
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    return [
      // Editorial layout graduated from its preview route into the main
      // marketplace — proper edge-level redirect with a Location header.
      { source: '/marketplace/editorial', destination: '/marketplace', permanent: true },
    ]
  },
}

module.exports = nextConfig
