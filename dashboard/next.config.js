/** @type {import('next').NextConfig} */
const nextConfig = {
  minimumCacheTTL: 60 * 30,
  reactStrictMode: true,
  swcMinify: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    optimizePackageImports: [
      '@/ui/components',
      '@/ui/layout',
      '@/ui/providers',
      '@/ui/sections',
      '@/ui/themes',
      '@/ui/styles',
      '@/lib/constants',
      '@/lib/hooks',
      '@/lib/interfaces',
      '@/lib/mocks',
      '@/lib/services',
      '@/lib/stores',
      '@/lib/utils',
      'react-fast-compare',
      'react-icons/fs',
      'react-icons/md',
      'react-icons/rx',
      'react-icons/tb',
      'react-icons/io5',
      'react-icons/bs',
      'react-icons/fa',
      'react-icons/fa6',
      'react-icons/gr',
      'react-icons/hi2',
      'react-icons/pi',
      'react-icons/ti',
      'react-icons/ri',
      'react-icons/io',
      'react-hook-form',
      'axios',
      'react-big-calendar',
      'react-intersection-observer',
      'zustand',
      'dayjs',
      '@chakra-ui/icons',
      '@/ui/components/Icons',
      '@/ui/themes/bases',
    ],
  },

  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png |webp)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
