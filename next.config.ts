/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'exbbndtsr3.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io', // Add this line for utfs.io
      },
    ],
  },
  turbopack: {},

  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
