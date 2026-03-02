import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized deployments
  output: 'standalone',

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Allow trailing slashes in URLs
  trailingSlash: true,

  // Redirect spam/legacy single-segment word+number slug URLs directly to homepage.
  // These run before trailingSlash auto-redirects, so the browser receives a single
  // 301 hop instead of: /look205 → /look205/ (trailingSlash) → / (middleware).
  // e.g. /look205?kg=36238, /isolation153, /duck93, /penalty11
  async redirects() {
    const spamSlugPattern = ':slug([a-zA-Z][a-zA-Z0-9-]*\\d+)'
    return [
      { source: `/${spamSlugPattern}`,  destination: '/', permanent: true },
      { source: `/${spamSlugPattern}/`, destination: '/', permanent: true },
    ]
  },

  // Sitemap indexes (Next.js does not create these when using generateSitemaps)
  async rewrites() {
    return [
      { source: '/sitemap.xml', destination: '/api/sitemap-index' },
      { source: '/sitemap.xml/', destination: '/api/sitemap-index' },
      { source: '/sitemap/gyms.xml', destination: '/api/sitemap-gyms-index' },
      { source: '/sitemap/gyms.xml/', destination: '/api/sitemap-gyms-index' },
{ source: '/best-:city-gyms', destination: '/best-gyms/:city' },
      { source: '/best-:city-gyms/', destination: '/best-gyms/:city' },
    ]
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.gymdues.com',
        pathname: '/**',
      },
    ],
  },

  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/themes'],
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
      // Allow robots.txt to be accessed
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
