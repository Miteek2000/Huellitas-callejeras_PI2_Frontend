import { ENDPOINTS } from '../app/lib/endpoints';
import { apiFetch } from '../app/lib/interceptors';
import type {
  LoginDTO,
  AuthResponse,
  RegistroCompletoData,
} from '@/schemas/auth.schema';

const TOKEN_KEY = 'access_token';

export const AuthService = {
  async registroCompleto(data: RegistroCompletoData): Promise<AuthResponse> {
    const payload = {
      nombre: data.refugio.nombre,
      capacidad_max: data.refugio.capacidad_max,
      estado: data.refugio.estado,
      municipio: data.refugio.municipio,
      colonia: data.refugio.colonia,
      calle: data.refugio.calle,
      num_exterior: data.refugio.num_exterior,
      num_interior: data.refugio.num_interior,
      nombre_usuario: data.usuario.nombre,
      apellido_p: data.usuario.apellido_p,
      apellido_m: data.usuario.apellido_m,
      email: data.usuario.email,
      contrasena: data.usuario.contrasena,
      acepta_terminos: data.usuario.acepta_terminos,
    };

    const response = await apiFetch<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    this.saveToken(response.access_token);
    return response;
  },

  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await apiFetch<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.saveToken(response.access_token);
    return response;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};