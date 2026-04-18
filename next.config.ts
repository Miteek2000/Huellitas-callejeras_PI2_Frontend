import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiOrigin = (() => {
  try {
    return apiUrl ? new URL(apiUrl).origin : '';
  } catch {
    return '';
  }
})();

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: http:",
  `connect-src ${["'self'", apiOrigin, 'https:', 'http:'].filter(Boolean).join(' ')}`,
  "font-src 'self' data: https:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  // Security headers to reduce XSS and data injection risks.
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

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
        pathname: '/uploads/**',
      },
      // Permitir también HTTPS si se configura en el futuro
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/uploads/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;