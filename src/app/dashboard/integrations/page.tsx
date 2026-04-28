import { IntegrationsView } from "@/components/dashboard/integrations-view";
import { getIntegrationsDashboardData } from "@/lib/medix-api/dashboard";

export default async function IntegrationsPage() {
  const { data: institutions, error } = await getIntegrationsDashboardData();

  return <IntegrationsView institutions={institutions} error={error} />;
}
