import type { CreateRefugioDTO } from '@/app/services/refugios.service';

export interface RegisterFormData {
  nombreRefugio: string;
  capacidad: number;
  estado: string;
  municipio: string;
  colonia: string;
  calle: string;
  numeroInterior: number;
  numeroExterior: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  contrasena: string;
  confirmarContrasena: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterDTO {
  nombre: string;
  apellido_p: string;
  apellido_m: string;
  email: string;
  contrasena: string;
  activo: boolean;
  rol_id: string;
  refugio_id: string;
}

export interface Usuario extends RegisterDTO {
  id_usuario: string;
  rol?: { id_roles: string; nombre: string };
}

export interface LoginDTO {
  email: string;
  contrasena: string;
}

export interface AuthResponse {
  user: {
    id_usuario: string;
    nombre: string;
    apellido_p: string;
    apellido_m: string;
    email: string;
    activo: boolean;
    rol: {
      id_roles: string;
      nombre: string;
    };
    refugio: {
      id_refugio: string;
      nombre: string;
    };
  };
  access_token: string;
}

export interface RegistroCompletoData {
  refugio: CreateRefugioDTO;
  usuario: {
    nombre: string;
    apellido_p: string;
    apellido_m: string;
    email: string;
    contrasena: string;
  };
}
