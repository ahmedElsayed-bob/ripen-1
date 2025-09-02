import ScheduleScreen from "@/screens/field/schedule/schedule-screen";

export default async function FieldSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ScheduleScreen id={id} />;
}
