"use client";

import { getFarmById, updatePlotGrid } from "@/lib/storage";
import { FarmType, PlotGridType } from "@/types/farm";
import { useEffect, useState, useRef } from "react";
import { PlotPageHeader } from "./plot-page-header";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, CameraOff, ChevronDown, Grid2X2, PinIcon } from "lucide-react";
import {
  PictureUploadBox,
  PictureUploadBoxRef,
} from "./components/picture-upload-box";

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

  if (!grids?.length || !missingPictureGrids?.length)
    return <>No missing pictures</>;

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

      <PictureSelector grids={grids || []} farmId={id} sectionId={plot} />
    </>
  );
}

function PictureSelector({
  farmId,
  sectionId,
  grids,
}: {
  farmId: string;
  sectionId: string;
  grids: PlotGridType[];
}) {
  const [GridsList, setGridsList] = useState<PlotGridType[]>(grids);
  const [selectedGrid, setSelectedGrid] = useState<PlotGridType | null>(null);
  const uploadBoxRefs = useRef<Map<string, PictureUploadBoxRef>>(new Map());
  const missingPictureGrids = GridsList.filter((grid) => grid.missingPicture);

  useEffect(() => {
    if (missingPictureGrids.length > 0) {
      setSelectedGrid(missingPictureGrids[0]);
    }
  }, [grids]);

  const handleGridInView = (grid: PlotGridType, isInView: boolean) => {
    if (isInView) {
      setSelectedGrid(grid);
    }
  };

  const onUploadPicture = (grid: PlotGridType) => {
    const updatedGrid = { ...grid, missingPicture: false };
    const gridUpdated = GridsList.map((ele) => {
      if (ele.id === grid.id) {
        return updatedGrid;
      }
      return ele;
    });
    setGridsList(gridUpdated);
    updatePlotGrid(farmId, sectionId, updatedGrid);
  };

  const handleImageClick = () => {
    if (selectedGrid) {
      const uploadBoxRef = uploadBoxRefs.current.get(selectedGrid.id);
      if (uploadBoxRef) {
        uploadBoxRef.triggerUpload();
      }
    }
  };

  const imagesUrls = [
    "/imgs/wheat.webp",
    "/imgs/wheat.webp",
    "/imgs/wheat.webp",
    "/imgs/wheat.webp",
    "/imgs/wheat.webp",
  ];

  return (
    <div className="container mx-auto">
      <div className="flex gap-4">
        <div className="flex-1 p-4 rounded-xl shadow-lg">
          <div className=" bg-black rounded-xl flex gap-4 p-4">
            <div className=" w-40 max-h-[580px] overflow-y-auto">
              {imagesUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="selectedGrid"
                  className="w-32 h-32 object-cover rounded-xl mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleImageClick}
                />
              ))}
            </div>

            <div className="flex-1 text-white flex flex-col gap-4 items-center justify-center relative">
              <img
                src={"/maximzie-rect.png"}
                alt="selectedGrid"
                className="h-[500px]"
                onClick={handleImageClick}
              />
              <div className="w-10 h-10 bg-red-500 rounded-full border-4 border-white" />
              <p className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center gap-2">
                  <CameraOff size={20} />
                  <span className="text-sm font-bold">
                    Connected with Camera
                  </span>
                </div>
              </p>
            </div>
          </div>
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
                {GridsList?.map((grid, index) => (
                  <div
                    key={grid.id}
                    className={`bg-gray-100 min-h-16 flex flex-col gap-1 items-center justify-center text-xs ${
                      index === 2 ? "bg-green-700 text-white" : ""
                    } ${
                      selectedGrid?.id === grid.id
                        ? "bg-gray-300 shadow-sm"
                        : ""
                    }`}
                  >
                    {index === 2 ? <PinIcon size={12} /> : null}
                    {grid.missingPicture ? <Camera size={12} /> : null}
                    {grid.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="h-[200px] overflow-y-auto flex flex-col gap-3 py-10">
            {missingPictureGrids?.map((ele) => (
              <PictureUploadBox
                key={ele.id}
                ref={(ref) => {
                  if (ref) {
                    uploadBoxRefs.current.set(ele.id, ref);
                  } else {
                    uploadBoxRefs.current.delete(ele.id);
                  }
                }}
                grid={ele}
                onInView={(isInView) => handleGridInView(ele, isInView)}
                onUploadPicture={() => onUploadPicture(ele)}
                isSelected={selectedGrid?.id === ele.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
