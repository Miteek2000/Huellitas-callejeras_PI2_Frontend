export interface RegisterFormData {
  nombreRefugio: string;
  capacidad: string;
  estado: string;
  municipio: string;
  colonia: string;
  calle: string;
  numeroInterior: string;
  numeroExterior: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  contrasena: string;
  confirmarContrasena: string;
}

export interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
}
