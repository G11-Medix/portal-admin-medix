import { createClient } from "@/lib/supabase/server-client";

import { getMedixApiUrl } from "./config";

export class MedixApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "MedixApiError";
  }
}

export async function getSupabaseAccessToken() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token;
}

type MedixApiFetchOptions = {
  method?: string;
  body?: unknown;
};

export async function medixApiFetch<T>(
  path: string,
  token: string,
  options: MedixApiFetchOptions = {},
): Promise<T> {
  const url = `${getMedixApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
    });
  } catch {
    throw new MedixApiError(
      "No fue posible conectar con medix-appointments-api. Verifica que este corriendo en http://localhost:8001.",
    );
  }

  if (!response.ok) {
    throw new MedixApiError(await getErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function getErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: unknown };
    if (typeof payload.detail === "string") {
      return payload.detail;
    }
  } catch {
    // Fall back to the status text below when the API does not send JSON.
  }

  return response.statusText || "La API respondio con un error inesperado.";
}
