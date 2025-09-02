"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FarmType } from "@/types/farm";
import {
  Bell,
  Calendar,
  ChevronRight,
  Image,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  farm: FarmType;
  plot: string;
}

export function PlotSidebar({ farm, plot }: Props) {
  const grid = farm.sections?.find((section) => section.id === plot);
  const router = useRouter();

  const missingPictureGrids = grid?.grids.filter((grid) => grid.missingPicture);
  const gridsWithAlerts = grid?.grids.filter((grid) => grid.alerts?.length);

  return (
    <div className="w-[300px] flex flex-col gap-6">
      <Card className="py-4 gap-3 shadow-lg">
        <CardHeader className="px-4">
          <CardTitle className="flex items-center gap-2">
            <TriangleAlert size={16} />
            <p>Alerts</p>
          </CardTitle>

          <CardAction>
            <ChevronRight size={16} />
          </CardAction>
        </CardHeader>
        <CardContent
          className="text-sm text-gray-500 flex flex-col px-4 overflow-y-auto flex flex-col gap-2"
          style={{ maxHeight: "50px" }}
        >
          {gridsWithAlerts?.map((grid) => (
            <p key={grid.id}>
              {grid.alerts?.[0]} - {grid.name}
            </p>
          ))}

          {missingPictureGrids?.map((grid) => (
            <p key={grid.id}>In-field photo required - {grid.name}</p>
          ))}
        </CardContent>
      </Card>

      <Card className="py-4 gap-3 shadow-lg">
        <CardHeader className="px-4">
          <CardTitle className="flex items-center gap-2">
            <Bell size={16} />
            <p>Plot KPIs</p>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col px-4 gap-2">
          <div className="bg-gray-50 py-1 px-3 rounded-lg text-sm">
            <div className="mb-1">ETA To Harvest</div>
            <div className="text-gray-500 text-xs">5 - 7 days</div>
          </div>

          <div className="bg-gray-50 py-1 px-3 rounded-lg text-sm">
            <div className="mb-1">Expected Yield</div>
            <div className="text-gray-500 text-xs">7.8 tons</div>
          </div>

          <div className="bg-gray-50 py-1 px-3 rounded-lg text-sm">
            <div className="mb-1">Forecasted Grade </div>
            <div className="me-[50px] flex items-center">
              <div className="w-[52%]">
                <div className="bg-[#319480] text-white p-1 text-center">A</div>
                <div className="text-xs text-gray-500 ms-1">52%</div>
              </div>
              <div className="w-[27%]">
                <div className="bg-[#f7947B] p-1 text-center">B</div>
                <div className="text-xs text-gray-500 ms-1">27%</div>
              </div>
              <div className="w-[21%]">
                <div className="bg-[#ECF493] p-1 text-center">C</div>
                <div className="text-xs text-gray-500 ms-1">21%</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 py-1 px-3 rounded-lg text-sm">
            <div className="mb-1">Estimated Revenue</div>
            <div className="text-gray-500 text-xs">6,140 USD</div>
          </div>
        </CardContent>
      </Card>

      {!!missingPictureGrids?.length && (
        <Card className="py-4 gap-3 shadow-lg">
          <CardHeader className="px-4">
            <CardTitle className="flex items-center gap-2">
              <Image size={16} />
              <p>Attach Pictures</p>
            </CardTitle>
            <Link href={`/fields/${farm.id}/${plot}/add-pictures`}>
              <CardAction
                onClick={() =>
                  router.push(`/fields/${farm.id}/${plot}/add-pictures`)
                }
              >
                <ChevronRight size={16} />
              </CardAction>
            </Link>
          </CardHeader>

          <CardContent
            className="flex flex-col px-4 gap-2 overflow-y-auto"
            style={{ height: "95px" }}
          >
            {missingPictureGrids.map((ele) => (
              <div
                className="bg-gray-50 py-2 px-3 rounded-lg text-sm flex items-center justify-between"
                key={ele.id}
              >
                <div>{ele.name}</div>
                <Link href={`/fields/${farm.id}/${plot}/add-pictures`}>
                  <div className="text-[#0D826B] flex items-center gap-1">
                    <Image size={16} />
                    Add
                  </div>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="p-4 pb-2 gap-3 shadow-lg">
        <CardHeader className="p-0 items-center m-0">
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            <p>Tasks / Schedule</p>
          </CardTitle>

          <CardAction>
            <ChevronRight size={16} />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
