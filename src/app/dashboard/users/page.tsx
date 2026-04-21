import { UsersView } from "@/components/dashboard/users-view";
import { getPatientsDashboardData } from "@/lib/medix-api/dashboard";

export default async function UsersPage() {
  const { data: patients, error } = await getPatientsDashboardData();

  return <UsersView users={patients} error={error} />;
}
