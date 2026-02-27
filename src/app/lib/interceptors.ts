export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  if (typeof window === 'undefined') {
    throw new Error('apiFetch solo puede ejecutarse en el cliente');
  }

  const token = localStorage.getItem('access_token'); // ← fix: era 'token'

  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('access_token'); // ← fix: era 'token'
    window.location.href = '/';
    throw new Error('No autorizado');
  }

  const data: unknown = await response.json();

  if (!response.ok) {
    const errorData = data as { message?: string };
    throw new Error(errorData.message || 'Error en la petición');
  }

  return data as T;
}