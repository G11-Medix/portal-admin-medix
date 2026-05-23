export type PacienteResponse = {
  id_paciente: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  telefono: string | null;
  correo: string | null;
  estado: string;
  id_eps: number;
  fecha_creacion: string;
  id_usuario: string | null;
};

export type CitaResponse = {
  id: number;
  nombre_paciente: string;
  cedula_paciente: string;
  nombre_prestador: string | null;
  especialidad: string;
  fecha: string;
  hora: string;
  estado_cita: string;
  motivo_cancelacion: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
};

export type InstitucionResponse = {
  id_institucion: number;
  nombre: string;
  nit: string;
  direccion: string | null;
  telefono: string | null;
  estado: string;
  longitud: number | null;
  latitud: number | null;
  logo_url: string | null;
  service_url: string | null;
};

export type InstitucionUpdatePayload = {
  nombre?: string;
  nit?: string;
  direccion?: string | null;
  telefono?: string | null;
  estado?: string;
  longitud?: number | null;
  latitud?: number | null;
  logo_url?: string | null;
  service_url?: string | null;
};

export type InstitucionHealthResponse = {
  id_institucion: number;
  status: "UP" | "DOWN" | "NOT_CONFIGURED";
  service_url: string | null;
  status_code: number | null;
  latency_ms: number | null;
  message: string;
};
