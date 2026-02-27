import { ENDPOINTS } from '../lib/endpoints';
import { apiFetch } from '../lib/interceptors';
import { RefugiosService } from './refugios.service';
import type {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  RegistroCompletoData,
} from '@/schemas/auth.schema';

const TOKEN_KEY = 'access_token';

interface CreateRolDTO {
  nombre: string;
  refugio_id: string;
}

interface RolResponse {
  id_roles: string;
  nombre: string;
  refugio_id: string;
}

export const AuthService = {
  async registroCompleto(data: RegistroCompletoData): Promise<AuthResponse> {
    // 1. Crear refugio
    const refugioCreado = await RefugiosService.create(data.refugio);

    // 2. Crear rol "propietario" vinculado al refugio
    const rolPayload: CreateRolDTO = {
      nombre: 'propietario',
      refugio_id: refugioCreado.id_refugio,
    };

    

    const rolCreado = await apiFetch<RolResponse>(ENDPOINTS.ROLES, {
      method: 'POST',
      body: JSON.stringify(rolPayload),
    });

    // 3. Crear usuario con el refugio y rol creados
    const registerPayload: RegisterDTO = {
      nombre: data.usuario.nombre,
      apellido_p: data.usuario.apellido_p,
      apellido_m: data.usuario.apellido_m,
      email: data.usuario.email,
      contrasena: data.usuario.contrasena,
      activo: true,
      rol_id: rolCreado.id_roles,
      refugio_id: refugioCreado.id_refugio,
    };

    // auth.service.ts - línea antes del apiFetch de register
    console.log('Payload register:', JSON.stringify(registerPayload, null, 2));

    const response = await apiFetch<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(registerPayload),
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