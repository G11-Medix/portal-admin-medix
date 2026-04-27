import { AuditReportsView } from "@/components/dashboard/audit-reports-view";
import { getAuditReportsData } from "@/lib/audit-reports";

export default async function AuditReportsPage() {
  const { data: logs, error } = await getAuditReportsData();

  return <AuditReportsView logs={logs} error={error} />;
}
