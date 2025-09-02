import { Button } from "@/components/ui/button";
import { PlotGridType } from "@/types/farm";
import { Camera, TriangleAlert } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PLOT_YELLOW = ["#ffff4d", "#ffff1a", "#c6c600", "#b2b300", "#7f8000"];

const generatePlotGridsData = (
  grids: PlotGridType[],
  isBeforeTwoMonths: boolean
) => {
  const pickRandomColor = () => {
    return PLOT_YELLOW[Math.floor(Math.random() * PLOT_YELLOW.length)];
  };

  return grids.map((grid) => {
    return {
      ...grid,
      color: isBeforeTwoMonths ? pickRandomColor() : grid.color,
    };
  });
};

export function PlotGrids({
  grids,
  farmId,
  sectionId,
  isBeforeTwoMonths,
}: {
  grids: PlotGridType[];
  farmId: string;
  sectionId: string;
  isBeforeTwoMonths: boolean;
}) {
  const gridsData = generatePlotGridsData(grids, isBeforeTwoMonths);

  return (
    <div className="min-h-[500px] relative">
      <div className="grid grid-cols-5 rounded-xl overflow-hidden">
        {gridsData.map((grid) => {
          return (
            <Tooltip key={grid.id}>
              <TooltipTrigger>
                <GridCell color={grid.color}>
                  <div className="flex flex-col items-center justify-center gap-2">
                    {!!grid.alerts?.length && <TriangleAlert size={24} />}
                    {grid.name}
                    {grid.missingPicture && (
                      <Link
                        href={`/fields/${farmId}/${sectionId}/add-pictures`}
                      >
                        <Button variant="secondary" size="sm">
                          <Camera /> Add
                        </Button>
                      </Link>
                    )}
                  </div>
                </GridCell>
              </TooltipTrigger>
              <TooltipContent>
                <p>Readiness: {100}%</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* <div className="absolute bottom-4 left-4">
        <ReadinessOverlay />
      </div> */}
    </div>
  );
}

function GridCell({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`h-40 flex items-center justify-center border font-bold text-white`}
      style={{
        backgroundColor: color,
      }}
    >
      {children}
    </div>
  );
}
