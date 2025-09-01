import { Button } from "@/components/ui/button";
import { PlotGridType } from "@/types/farm";
import { Camera, TriangleAlert } from "lucide-react";

export function PlotGrids({ grids }: { grids: PlotGridType[] }) {
  return (
    <div className="min-h-[500px]">
      <div className="grid grid-cols-5 rounded-xl overflow-hidden">
        {grids.map((grid) => {
          return (
            <GridCell
              key={grid.id}
              color={grid.missingPicture ? "#f7947b" : grid.color}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                {!grid.missingPicture && <TriangleAlert size={24} />}
                {grid.name}
                {grid.missingPicture && (
                  <Button variant="secondary" size="sm">
                    <Camera /> Add
                  </Button>
                )}
              </div>
            </GridCell>
          );
        })}
      </div>
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
      className={`h-40 flex items-center justify-center border border-[#319480] font-bold text-white`}
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  );
}
