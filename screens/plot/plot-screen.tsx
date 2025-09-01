"use client";

import React, { useEffect, useState } from "react";
import { getFarmById } from "@/lib/storage";
import { FarmType } from "@/types/farm";
import { PlotGrids } from "./plot-grids";
import { PLOTS_GRIDS_DATA } from "@/constants/farms";
import { PlotHeadSection } from "./plot-head-section";
import { PlotSidebar } from "./plot-sidebar";
import { PlotPageHeader } from "./plot-page-header";

export function PlotScreen({ id, plot }: { id: string; plot: string }) {
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

  const grid = farm.sections?.find((section) => section.id === plot);

  return (
    <>
      <PlotPageHeader
        title={farm.name}
        subtitle={`Track crop conditions and assess field readiness for optimal harvest.`}
        farmName={farm.name}
        id={id}
        breadcrumbSuffix={[{ label: plot }]}
      />

      <div className="container mx-auto">
        <div className="flex gap-4">
          <div className="flex-1 p-4 rounded-xl shadow-lg flex flex-col gap-4">
            <PlotHeadSection
              sections={farm.sections || []}
              farmId={id}
              plot={plot}
            />

            <PlotGrids
              grids={grid?.grids || PLOTS_GRIDS_DATA}
              farmId={id}
              sectionId={plot}
            />
          </div>

          <PlotSidebar farm={farm} plot={plot} />
        </div>
      </div>
    </>
  );
}
