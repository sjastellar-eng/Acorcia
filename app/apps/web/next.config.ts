import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@soc/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
}

export default nextConfig
