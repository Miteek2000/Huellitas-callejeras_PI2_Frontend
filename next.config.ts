import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
  unoptimized: process.env.NODE_ENV === 'development',
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3001',
      pathname: '/uploads/**',
    },
  ],
},
};

export default nextConfig;
