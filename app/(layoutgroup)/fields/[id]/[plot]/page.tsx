import { PlotScreen } from "@/screens/plot/plot-screen";

export default async function FarmsListPage({
  params,
}: {
  params: Promise<{ id: string; plot: string }>;
}) {
  const { id, plot } = await params;

  return <PlotScreen id={id} plot={plot} />;
}
