export function getMedixApiUrl() {
  return (process.env.MEDIX_API_URL ?? "http://localhost:8001").replace(/\/$/, "");
}
