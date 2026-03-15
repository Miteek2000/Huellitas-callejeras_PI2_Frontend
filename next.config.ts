import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      // Permitir imágenes desde el backend en AWS (54.80.70.161)
      {
        protocol: 'http',
        hostname: '54.80.70.161',
        port: '3001',
        pathname: '/uploads/**',
      },
      // Patrón genérico para cualquier hostname en puerto 3001
      {
        protocol: 'http',
        hostname: '**',
        port: '3001',
        pathname: '/uploads/**',
      },
      // Permitir también HTTPS si se configura en el futuro
      {
        protocol: 'https',
        hostname: '**',
        port: '3001',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;