import { PlotAddPictureScreen } from "@/screens/plot/plot-add-picture-screen";

export default async function AppPicturePage({
  params,
}: {
  params: Promise<{ id: string; plot: string }>;
}) {
  const { id, plot } = await params;
  return <PlotAddPictureScreen id={id} plot={plot} />;
}
