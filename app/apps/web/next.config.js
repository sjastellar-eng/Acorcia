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
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'jsonwebtoken'],
  },
}

module.exports = nextConfig
