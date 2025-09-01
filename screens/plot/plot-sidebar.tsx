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

interface Props {
  farm: FarmType;
  plot: string;
}

export function PlotSidebar({ farm, plot }: Props) {
  const grid = farm.sections?.find((section) => section.id === plot);

  const missingPictureGrids = grid?.grids.filter((grid) => grid.missingPicture);

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
        <CardContent className="text-sm text-gray-500 flex flex-col px-4">
          <p>Crop stress </p>
          <p>overheat </p>
        </CardContent>
      </Card>

      <Card className="py-4 gap-3 shadow-lg">
        <CardHeader className="px-4">
          <CardTitle className="flex items-center gap-2">
            <Bell size={16} />
            <p>Polt KPIs</p>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col px-4 gap-2">
          <div className="bg-gray-50 py-1 px-3 rounded-lg text-sm">
            <div>Eta to harvest</div>
            <div className="text-gray-500 text-xs">5 - 7 days</div>
          </div>

          <div className="bg-gray-50 py-1 px-3 rounded-lg text-sm">
            <div>Expected yield</div>
            <div className="text-gray-500 text-xs">7.8 tons</div>
          </div>

          <div className="bg-gray-50 py-1 px-3 rounded-lg text-sm">
            <div className="mb-1">Forecast Grade </div>
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
                <div className="bg-[#ECF493] p-1 text-center">c</div>
                <div className="text-xs text-gray-500 ms-1">21%</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 py-1 px-3 rounded-lg text-sm">
            <div>Estimated Revenue</div>
            <div className="text-gray-500 text-xs">$6k</div>
          </div>
        </CardContent>
      </Card>

      {!!missingPictureGrids?.length && (
        <Card className="py-4 gap-3 shadow-lg">
          <CardHeader className="px-4">
            <CardTitle className="flex items-center gap-2">
              <Image size={16} />
              <p>Attach pictures</p>
            </CardTitle>

            <CardAction>
              <ChevronRight size={16} />
            </CardAction>
          </CardHeader>

          <CardContent className="flex flex-col px-4 gap-2">
            {missingPictureGrids.map((ele) => (
              <div
                className="bg-gray-50 py-2 px-3 rounded-lg text-sm flex items-center justify-between"
                key={ele.id}
              >
                <div>{ele.name}</div>
                <div className="text-[#0D826B] flex items-center gap-1">
                  <Image size={16} />
                  Add
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="p-4 gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Calendar size={20} />
          <p>tasks / schedule</p>
        </div>
      </Card>
    </div>
  );
}
