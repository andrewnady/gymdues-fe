import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized deployments
  output: 'standalone',

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Allow trailing slashes in URLs
  trailingSlash: true,

  // Sitemap indexes (Next.js does not create these when using generateSitemaps)
  async rewrites() {
    return [
      { source: '/sitemap.xml', destination: '/api/sitemap-index' },
      { source: '/sitemap.xml/', destination: '/api/sitemap-index' },
      { source: '/sitemap/gyms.xml', destination: '/api/sitemap-gyms-index' },
      { source: '/sitemap/gyms.xml/', destination: '/api/sitemap-gyms-index' },
    ]
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
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
        protocol: 'https',
        hostname: 'cms.gymdues.staging-apps.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.staging.gymdues.com',
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
