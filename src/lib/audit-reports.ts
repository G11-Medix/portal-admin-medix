import { createClient } from "@/lib/supabase/server-client";

export type AuditLogRow = {
  id: number;
  occurredAt: string;
  action: string;
  userId: string | null;
  userRole: string;
  userStatus: string;
  ipAddress: string;
  result: string;
  detail: string;
  statusCode: string;
  path: string;
  query: string;
  method: string;
  resource: string;
};

export type AuditReportsResult =
  | { data: AuditLogRow[]; error?: undefined }
  | { data: AuditLogRow[]; error: string };

type AuditLogRecord = {
  id_log: number;
  fecha_hora: string;
  tipo_accion: string;
  id_usuario: string | null;
  ip_origen: string | null;
  resultado: string;
  detalle: string | null;
  Usuario?: {
    rol?: string | null;
    estado?: string | null;
  } | null;
};

export async function getAuditReportsData(limit = 500): Promise<AuditReportsResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Log_Auditoria")
    .select(
      `
        id_log,
        fecha_hora,
        tipo_accion,
        id_usuario,
        ip_origen,
        resultado,
        detalle,
        Usuario (
          rol,
          estado
        )
      `,
    )
    .order("fecha_hora", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      data: [],
      error: `No fue posible cargar Log_Auditoria: ${error.message}`,
    };
  }

  return { data: ((data ?? []) as AuditLogRecord[]).map(toAuditLogRow) };
}

function toAuditLogRow(record: AuditLogRecord): AuditLogRow {
  const detail = record.detalle ?? "";
  const parsedDetail = parseDetail(detail);
  const actionParts = record.tipo_accion.trim().split(/\s+/);
  const method = actionParts[0]?.toUpperCase() ?? "N/A";
  const path = parsedDetail.path ?? actionParts.slice(1).join(" ") ?? "N/A";

  return {
    id: record.id_log,
    occurredAt: record.fecha_hora,
    action: record.tipo_accion,
    userId: record.id_usuario,
    userRole: record.Usuario?.rol ?? "Sin usuario",
    userStatus: record.Usuario?.estado ?? "N/A",
    ipAddress: record.ip_origen ?? "Sin IP",
    result: record.resultado,
    detail,
    statusCode: parsedDetail.status ?? "N/A",
    path: path || "N/A",
    query: parsedDetail.query ?? "-",
    method,
    resource: getResourceName(path),
  };
}

function parseDetail(detail: string) {
  return detail.split(";").reduce<Record<string, string>>((fields, item) => {
    const [rawKey, ...rawValue] = item.trim().split("=");
    const key = rawKey?.trim();
    const value = rawValue.join("=").trim();

    if (key && value) {
      fields[key] = value;
    }

    return fields;
  }, {});
}

function getResourceName(path: string) {
  const segments = path
    .split("?")[0]
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
  const apiIndex = segments.indexOf("api");
  const resource = apiIndex >= 0 ? segments[apiIndex + 1] : segments[0];

  return resource ?? "sin-ruta";
}
