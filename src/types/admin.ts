export type UserRole =
  | "super_admin"
  | "operaciones"
  | "medico"
  | "recepcion"
  | "soporte"
  | "paciente";

export type UserStatus = "activo" | "suspendido" | "pendiente" | "bloqueado";

export type AppointmentStatus =
  | "reservada"
  | "confirmada"
  | "cancelada"
  | "reprogramada"
  | "completada";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  documentId: string;
  role: UserRole;
  status: UserStatus;
  institution?: string;
  ips: string;
  createdAt: string;
  lastActivityAt: string;
  notes?: string;
};

export type Appointment = {
  id: string;
  code: string;
  patientName: string;
  patientDocumentId: string;
  doctorName: string;
  specialty: string;
  institution: string;
  ips: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  observations?: string;
  source: "portal_paciente" | "call_center" | "recepcion_ips";
};
