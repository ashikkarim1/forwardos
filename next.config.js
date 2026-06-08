/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  distDir: '.next',
  output: 'standalone',
}

module.exports = nextConfig
