interface JwtPayload {
  sub: string;
  email: string;
  rol: string;
  refugio: string;
  iat: number;
  exp: number;
}

export function getTokenPayload(): JwtPayload | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const base64Payload = token.split('.')[1];
    const decoded = atob(base64Payload);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function getRefugioId(): string {
  return getTokenPayload()?.refugio ?? '';
}

export function getUsuarioId(): string {
  return getTokenPayload()?.sub ?? '';
}