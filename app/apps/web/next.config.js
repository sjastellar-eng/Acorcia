/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig
