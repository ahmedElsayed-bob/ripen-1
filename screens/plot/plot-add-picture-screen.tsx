"use client";

import { getFarmById } from "@/lib/storage";
import { FarmType } from "@/types/farm";
import { useEffect, useState } from "react";
import { PlotPageHeader } from "./plot-page-header";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, ChevronDown, Grid2X2, TriangleAlert } from "lucide-react";
import { PictureUploadBox } from "./components/picture-upload-box";

interface PlotAddPictureScreenProps {
  id: string;
  plot: string;
}

export function PlotAddPictureScreen({ id, plot }: PlotAddPictureScreenProps) {
  const [farm, setFarm] = useState<FarmType>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const farm = getFarmById(id);
    setFarm(farm);
    setIsLoading(false);
  }, [id, plot]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        LOADING....
      </div>
    );

  if (!farm) return <>No farm found</>;

  const grids = farm.sections?.find((section) => section.id === plot)?.grids;
  const missingPictureGrids = grids?.filter((grid) => grid.missingPicture);

  return (
    <>
      <PlotPageHeader
        farmName={farm.name}
        id={id}
        title={`Field Picture`}
        subtitle="Track crop conditions and assess field readiness for optimal harvest"
        breadcrumbSuffix={[
          { label: plot, href: `/fields/${id}/${plot}` },
          { label: "Adding Photo" },
        ]}
      />

      <div className="container mx-auto">
        <div className="flex gap-4">
          <div className="flex-1 p-4 rounded-xl shadow-lg">
            <div className="h-[500px] bg-black rounded-xl"></div>
          </div>

          <div className="w-[400px] flex flex-col gap-4">
            <Card className="py-4 gap-3 shadow-lg">
              <CardHeader className="px-4">
                <CardTitle className="flex items-center gap-2">
                  <Grid2X2 size={16} />
                  <p>Grids of Field</p>
                </CardTitle>

                <CardAction>
                  <ChevronDown size={16} />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-1">
                  {grids?.map((grid) => (
                    <div
                      key={grid.id}
                      className="bg-gray-100 min-h-16 flex flex-col gap-1 items-center justify-center text-xs"
                    >
                      {grid.missingPicture ? (
                        <Camera size={12} />
                      ) : (
                        <TriangleAlert size={12} />
                      )}
                      {grid.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {missingPictureGrids?.map((ele) => (
              <PictureUploadBox key={ele.id} grid={ele} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
