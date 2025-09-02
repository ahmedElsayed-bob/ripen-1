import { ProfitabilityScreen } from "@/screens/profitability/profitability-screen";

export default async function FieldProfitabilityPage({
  params,
}: {
  params: Promise<{ id: string; plot: string }>;
}) {
  const { id, plot } = await params;
  return <ProfitabilityScreen id={id} plot={plot} />;
}
