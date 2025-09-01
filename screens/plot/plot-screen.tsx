"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFarmById } from "@/lib/storage";
import { FarmType } from "@/types/farm";
import {
  Bell,
  Calendar,
  ChevronRight,
  Image,
  TriangleAlert,
} from "lucide-react";
import { PlotGrids } from "./plot-grids";
import { PLOTS_GRIDS_DATA } from "@/constants/farms";
import { PlotHeadSection } from "./plot-head-section";
import { PlotSidebar } from "./plot-sidebar";

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
      <PageHeader farmName={farm.name} id={id} plot={plot} />

      <div className="container mx-auto">
        <div className="flex gap-4">
          <div className="flex-1 p-4 rounded-xl shadow-lg flex flex-col gap-4">
            <PlotHeadSection
              sections={farm.sections || []}
              farmId={id}
              plot={plot}
            />

            <PlotGrids grids={grid?.grids || PLOTS_GRIDS_DATA} />
          </div>

          <PlotSidebar farm={farm} plot={plot} />
        </div>
      </div>
    </>
  );
}

function PageHeader({
  farmName,
  id,
  plot,
}: {
  farmName: string;
  id: string;
  plot: string;
}) {
  return (
    <div className="border-b border-[#f5f2f0] py-4 mb-4">
      <div className="container mx-auto">
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="/fields">Fields</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href={`/fields/${id}`}>{farmName}</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Plot {plot} </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-bold mb-1">{farmName}</h1>

        <p className="text-sm text-gray-500">
          Track crop conditions and assess field readiness for optimal harvest.
        </p>
      </div>
    </div>
  );
}
