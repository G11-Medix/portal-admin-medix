import {
  toIntegrationInstitutionRow,
  toAppointmentAdminRow,
  toInstitutionOption,
  toPatientAdminRow,
} from "./adapters";
import { medixApiFetch, MedixApiError, getSupabaseAccessToken } from "./client";
import {
  type CitaResponse,
  type InstitucionResponse,
  type PacienteResponse,
} from "./types";

export type DashboardDataResult<T> =
  | { data: T; error?: undefined }
  | { data: T; error: string };

export async function getPatientsDashboardData() {
  return withMedixApiData(async (token) => {
    const patients = await medixApiFetch<PacienteResponse[]>("/api/pacientes/?limit=100", token);
    return patients.map(toPatientAdminRow);
  }, []);
}

export async function getAppointmentsDashboardData(selectedInstitutionId?: number) {
  return withMedixApiData(async (token) => {
    const institutions = (
      await medixApiFetch<InstitucionResponse[]>("/api/instituciones/?limit=100", token)
    ).map(toInstitutionOption);
    const selectedInstitution =
      institutions.find((institution) => institution.id === selectedInstitutionId) ??
      institutions[0];

    if (!selectedInstitution) {
      return { appointments: [], institutions, selectedInstitutionId: undefined };
    }

    const appointments = await medixApiFetch<CitaResponse[]>(
      `/api/instituciones/${selectedInstitution.id}/citas/`,
      token,
    );

    return {
      appointments: appointments.map((appointment) =>
        toAppointmentAdminRow(appointment, selectedInstitution),
      ),
      institutions,
      selectedInstitutionId: selectedInstitution.id,
    };
  }, {
    appointments: [],
    institutions: [],
    selectedInstitutionId: undefined as number | undefined,
  });
}

export async function getIntegrationsDashboardData() {
  return withMedixApiData(async (token) => {
    const institutions = await medixApiFetch<InstitucionResponse[]>(
      "/api/instituciones/?limit=100",
      token,
    );
    return institutions.map(toIntegrationInstitutionRow);
  }, []);
}

async function withMedixApiData<T>(
  loader: (token: string) => Promise<T>,
  fallback: T,
): Promise<DashboardDataResult<T>> {
  const token = await getSupabaseAccessToken();

  if (!token) {
    return {
      data: fallback,
      error: "No se encontro una sesion activa para consultar medix-appointments-api.",
    };
  }

  try {
    return { data: await loader(token) };
  } catch (error) {
    return {
      data: fallback,
      error: error instanceof MedixApiError ? error.message : "No fue posible cargar los datos.",
    };
  }
}
