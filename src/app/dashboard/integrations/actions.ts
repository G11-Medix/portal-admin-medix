"use server";

import {
  medixApiFetch,
  MedixApiError,
  getSupabaseAccessToken,
} from "@/lib/medix-api/client";
import {
  type InstitucionHealthResponse,
  type InstitucionResponse,
  type InstitucionUpdatePayload,
} from "@/lib/medix-api/types";
import { toIntegrationInstitutionRow } from "@/lib/medix-api/adapters";
import { type IntegrationInstitutionRow } from "@/types/admin";

export type IntegrationActionResult<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: string };

export async function updateInstitutionAction(
  id: number,
  payload: InstitucionUpdatePayload,
): Promise<IntegrationActionResult<IntegrationInstitutionRow>> {
  const token = await getSupabaseAccessToken();
  if (!token) {
    return { error: "No se encontro una sesion activa." };
  }

  try {
    const institution = await medixApiFetch<InstitucionResponse>(
      `/api/instituciones/${id}`,
      token,
      {
        method: "PUT",
        body: payload,
      },
    );
    return { data: toIntegrationInstitutionRow(institution) };
  } catch (error) {
    return { error: getActionError(error, "No fue posible actualizar la institucion.") };
  }
}

export async function checkInstitutionHealthAction(
  id: number,
): Promise<IntegrationActionResult<InstitucionHealthResponse>> {
  const token = await getSupabaseAccessToken();
  if (!token) {
    return { error: "No se encontro una sesion activa." };
  }

  try {
    return {
      data: await medixApiFetch<InstitucionHealthResponse>(
        `/api/instituciones/${id}/health`,
        token,
      ),
    };
  } catch (error) {
    return { error: getActionError(error, "No fue posible ejecutar el health check.") };
  }
}

function getActionError(error: unknown, fallback: string) {
  return error instanceof MedixApiError ? error.message : fallback;
}
