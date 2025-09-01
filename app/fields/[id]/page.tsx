import { FieldScreen } from "@/screens/field/field-screen";

export default async function FarmsListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FieldScreen id={id} />;
}
