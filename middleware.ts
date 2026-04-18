import { NextRequest, NextResponse } from 'next/server';

const MALICIOUS_QUERY_PATTERNS = [
  /<\s*script\b/i,
  /javascript:/i,
  /\bon\w+\s*=/i,
  /\beval\s*\(/i,
];

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const hasMaliciousInput = (value: string) =>
  MALICIOUS_QUERY_PATTERNS.some((pattern) => pattern.test(value));

export function middleware(request: NextRequest) {
  // Block obvious script injection patterns in query parameters.
  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    const decodedKey = safeDecode(key);
    const decodedValue = safeDecode(value);
    if (hasMaliciousInput(decodedKey) || hasMaliciousInput(decodedValue)) {
      return NextResponse.json(
        { error: 'Solicitud rechazada: contenido malicioso en parametros.' },
        { status: 400 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
