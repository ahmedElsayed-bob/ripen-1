import { FieldScreen } from "@/screens/field/field-screen";

export default function FarmsListPage({ params }: { params: { id: string } }) {
  return <FieldScreen id={params.id} />;
}
