import { ENDPOINTS } from '../lib/endpoints';
import { apiFetch } from '../lib/interceptors';
import { RefugiosService } from './refugios.service';
import type { 
  RegisterDTO, 
  LoginDTO, 
  AuthResponse, 
  RegistroCompletoData 
} from '@/schemas/auth.schema';

const ROL_ADMIN_REFUGIO = 'bffc4012-45a4-44ca-8b25-03562ca3c85f';
const TOKEN_KEY = 'access_token';

export const AuthService = {

  async registroCompleto(data: RegistroCompletoData): Promise<AuthResponse> {
    const refugioCreado = await RefugiosService.create(data.refugio);

    const registerPayload: RegisterDTO = {
      nombre: data.usuario.nombre,
      apellido_p: data.usuario.apellido_p,
      apellido_m: data.usuario.apellido_m,
      email: data.usuario.email,
      contrasena: data.usuario.contrasena,
      activo: true,
      rol_id: ROL_ADMIN_REFUGIO,
      refugio_id: refugioCreado.id_refugio,
    };

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
