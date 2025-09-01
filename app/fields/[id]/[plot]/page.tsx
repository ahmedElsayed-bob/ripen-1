import { PlotScreen } from "@/screens/plot/plot-screen";

export default function FarmsListPage({
  params,
}: {
  params: { id: string; plot: string };
}) {
  return <PlotScreen id={params.id} plot={params.plot} />;
}
