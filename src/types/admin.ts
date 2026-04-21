export type PatientAdminRow = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  documentId: string;
  documentType: string;
  status: string;
  epsId: number;
  createdAt: string;
  birthDate: string;
  supabaseUserId?: string;
};

export type InstitutionOption = {
  id: number;
  name: string;
};

export type AppointmentAdminRow = {
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
  status: string;
  observations?: string;
  source: string;
  institutionId: number;
};

export const appointmentStatusOptions = [
  "scheduled",
  "cancelled",
  "reservada",
  "confirmada",
  "cancelada",
  "reprogramada",
  "completada",
] as const;

export const patientStatusOptions = ["activo", "inactivo", "pendiente", "bloqueado"] as const;
