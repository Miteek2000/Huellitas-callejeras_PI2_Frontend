import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hc-backend.duckdns.org',
        port: '3001',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;