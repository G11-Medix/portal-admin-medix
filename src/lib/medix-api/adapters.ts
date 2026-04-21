import {
  type AppointmentAdminRow,
  type InstitutionOption,
  type PatientAdminRow,
} from "@/types/admin";

import {
  type CitaResponse,
  type InstitucionResponse,
  type PacienteResponse,
} from "./types";

export function toPatientAdminRow(patient: PacienteResponse): PatientAdminRow {
  return {
    id: String(patient.id_paciente),
    fullName: `${patient.nombres} ${patient.apellidos}`.trim(),
    email: patient.correo ?? "Sin correo",
    phone: patient.telefono ?? undefined,
    documentId: patient.numero_documento,
    documentType: patient.tipo_documento,
    status: normalizeStatus(patient.estado),
    epsId: patient.id_eps,
    createdAt: formatDate(patient.fecha_creacion),
    birthDate: formatDate(patient.fecha_nacimiento),
    supabaseUserId: patient.id_usuario ?? undefined,
  };
}

export function toInstitutionOption(institution: InstitucionResponse): InstitutionOption {
  return {
    id: institution.id_institucion,
    name: institution.nombre,
  };
}

export function toAppointmentAdminRow(
  appointment: CitaResponse,
  institution: InstitutionOption,
): AppointmentAdminRow {
  return {
    id: String(appointment.id),
    code: `CITA-${appointment.id}`,
    patientName: appointment.nombre_paciente,
    patientDocumentId: appointment.cedula_paciente,
    doctorName: appointment.nombre_prestador ?? "Prestador no informado",
    specialty: appointment.especialidad,
    institution: institution.name,
    ips: institution.name,
    date: formatDate(appointment.fecha),
    time: formatTime(appointment.hora),
    status: normalizeStatus(appointment.estado_cita),
    observations: appointment.motivo_cancelacion ?? undefined,
    source: "medix-appointments-api",
    institutionId: institution.id,
  };
}

function normalizeStatus(status: string) {
  return status.trim().toLowerCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-CA");
}

function formatTime(value: string) {
  return value.slice(0, 5) || "Sin hora";
}
