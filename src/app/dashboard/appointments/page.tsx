import { AppointmentsView } from "@/components/dashboard/appointments-view";
import { getAppointmentsDashboardData } from "@/lib/medix-api/dashboard";

type AppointmentsPageProps = {
  searchParams: Promise<{ institutionId?: string }>;
};

export default async function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
  const params = await searchParams;
  const requestedInstitutionId = parseInstitutionId(params.institutionId);
  const { data, error } = await getAppointmentsDashboardData(requestedInstitutionId);

  return (
    <AppointmentsView
      appointments={data.appointments}
      error={error}
      institutions={data.institutions}
      selectedInstitutionId={data.selectedInstitutionId}
    />
  );
}

function parseInstitutionId(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}
