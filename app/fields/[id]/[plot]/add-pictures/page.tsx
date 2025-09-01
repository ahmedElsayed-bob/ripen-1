import { PlotAddPictureScreen } from "@/screens/plot/plot-add-picture-screen";

export default function AppPicturePage({
  params,
}: {
  params: { id: string; plot: string };
}) {
  return <PlotAddPictureScreen id={params.id} plot={params.plot} />;
}
