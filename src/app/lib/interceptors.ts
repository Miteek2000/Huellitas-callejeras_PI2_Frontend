export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  if (typeof window === 'undefined') {
    throw new Error('apiFetch solo puede ejecutarse en el cliente');
  }

  const token = localStorage.getItem('access_token'); 

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
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data: unknown = await response.json();
      const errorData = data as { message?: string };
      const isLoginPage = window.location.pathname === '/' || window.location.pathname.includes('login');
      
      if (!isLoginPage) {
        localStorage.removeItem('access_token');
        window.location.href = '/';
      }
      
      throw new Error(errorData.message || 'Credenciales inválidas');
    } else {
      localStorage.removeItem('access_token');
      window.location.href = '/';
      throw new Error('Credenciales inválidas');
    }
  }
  
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  
  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    console.error('Response is not JSON:', { status: response.status, contentType, text: text.substring(0, 200) });
    throw new Error(`La API retornó una respuesta no JSON (${response.status}). Verifica que el servidor está funcionando correctamente.`);
  }

  const data: unknown = await response.json().catch((err) => {
    console.error('Failed to parse JSON:', err, { url, status: response.status });
    throw new Error('Error al procesar la respuesta del servidor. Intenta de nuevo.');
  });

  if (!response.ok) {
    const errorData = data as { message?: string };
    throw new Error(errorData.message || 'Error en la petición');
  }

  return data as T;
}