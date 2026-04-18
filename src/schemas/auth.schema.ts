import { z } from 'zod';
import { passwordSchema } from './password.schema';
import { emailSchema, generalTextSchema, nameSchemaBase } from './inputSchema';

export const loginSchema = z.object({
  email: emailSchema,
  password: generalTextSchema.min(1, 'La contraseña es obligatoria'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registroSchema = z
  .object({
    nombreRefugio: generalTextSchema.min(1, 'El nombre del refugio es obligatorio'),
    capacidad: generalTextSchema.min(1, 'La capacidad es obligatoria'),
    estado: generalTextSchema.min(1, 'El estado es obligatorio'),
    municipio: generalTextSchema.min(1, 'El municipio es obligatorio'),
    colonia: generalTextSchema.min(1, 'La colonia es obligatoria'),
    calle: generalTextSchema.min(1, 'La calle es obligatoria'),
    numeroInterior: generalTextSchema.optional(),
    numeroExterior: generalTextSchema.optional(),
    nombres: nameSchemaBase.min(1, 'El nombre es obligatorio'),
    apellidoPaterno: nameSchemaBase.min(1, 'El apellido paterno es obligatorio'),
    apellidoMaterno: nameSchemaBase.min(1, 'El apellido materno es obligatorio'),
    email: emailSchema,
    contrasena: passwordSchema,
    confirmarContrasena: generalTextSchema.min(1, 'Confirma tu contraseña'),
    acepta_terminos: z.boolean(),
  })
  .refine((data) => !isNaN(Number(data.capacidad)) && Number(data.capacidad) > 0, {
    message: 'La capacidad debe ser mayor a 0',
    path: ['capacidad'],
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarContrasena'],
  });

export type RegisterFormData = z.infer<typeof registroSchema>;

export interface RegisterDTO {
  nombre: string;
  apellido_p: string;
  apellido_m: string;
  email: string;
  contrasena: string;
  activo: boolean;
  rol_id: string;
  refugio_id: string;
  acepta_terminos?: boolean;
  aceptacion_term?: boolean;
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
  user?: {
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
  access_token?: string;
  requires2FA?: boolean;
  userId?: string;
}

export interface RegistroCompletoData {
  refugio: {
    nombre: string;
    capacidad_max: number;
    estado: string;
    municipio: string;
    colonia: string;
    calle: string;
    num_exterior?: number;
    num_interior?: number;
  };
  usuario: {
    nombre: string;
    apellido_p: string;
    apellido_m: string;
    email: string;
    contrasena: string;
    acepta_terminos: boolean;
  };
}