import ScheduleScreen from "@/screens/schedule/schedule-screen";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ScheduleScreen id={id} />;
}
