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
import { deleteFarm, getFarmById } from "@/lib/storage";
import { FarmType } from "@/types/farm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  Calendar,
  ChevronRight,
  CircleDollarSign,
  Flame,
  Image,
  Maximize2,
  Send,
  Wheat,
} from "lucide-react";
import { FarmPlotsMap } from "./map/farm-plots-map";
import { useRouter } from "next/navigation";

export function FieldScreen({ id }: { id: string }) {
  const [farm, setFarm] = useState<FarmType>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const farm = getFarmById(id);
    setFarm(farm);
    setIsLoading(false);
  }, [id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        LOADING....
      </div>
    );

  if (!farm) return <EmptyState />;

  const handleDeleteFarm = () => {
    deleteFarm(id);
    router.push("/fields");
  };

  return (
    <div>
      <div className="border-b border-[#f5f2f0] py-4 mb-4">
        <div className="container mx-auto">
          <PageBreadcrumb />

          <h1 className="text-2xl font-bold mb-1">{farm.name}</h1>
          <p className="text-sm text-gray-500">
            Track crop conditions and assess field readiness for optimal
            harvest.
          </p>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex gap-4">
          <div className="h-[700px] flex-1 bg-gray-200 rounded-xl overflow-hidden">
            <FarmPlotsMap farm={farm} />
          </div>

          <div className="w-[300px] flex flex-col gap-6">
            <Card className="py-4 gap-3 shadow-lg">
              <CardHeader className="px-4">
                <CardTitle className="flex items-center gap-2">
                  <Bell size={16} />
                  <p>Notifications</p>
                </CardTitle>
                <CardAction>
                  <ChevronRight size={16} />
                </CardAction>
              </CardHeader>
              <CardContent className="text-sm text-gray-500 flex flex-col gap-2 px-4">
                <div className="flex items-center gap-2">
                  <Flame size={14} />
                  <p>Heat stress risk in A3</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image size={14} />
                  <p>Photo overdue in B4</p>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDollarSign size={14} />
                  <p>Buyer price +5% in B5</p>
                </div>
              </CardContent>
            </Card>

            <Card className="py-4 gap-3 shadow-lg">
              <CardHeader className="px-4">
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={16} />
                  <p>Estimated Time To Harvest</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                <p>7 - 9 days</p>
              </CardContent>
            </Card>

            <Card className="py-4 gap-3 shadow-lg">
              <CardHeader className="px-4">
                <CardTitle className="flex items-center gap-2">
                  <Wheat size={16} />
                  <p>Forecasted Yield</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                <p>128 t</p>
              </CardContent>
            </Card>

            <Card className="py-4 gap-3 shadow-lg">
              <CardHeader className="px-4">
                <CardTitle className="flex items-center gap-2">
                  <CircleDollarSign size={16} />
                  <p>Revenue</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">$1500</CardContent>
            </Card>

            <Card className="p-0 shadow-lg">
              <CardContent className="p-0 relative">
                <textarea
                  className="w-full h-24 resize-none border border-transparent rounded-md p-2 text-sm outline-none"
                  placeholder="Ask Ripen"
                ></textarea>
                <div className="absolute top-4 right-4 cursor-pointer">
                  <Maximize2 size={16} />
                </div>
                <div className="p-2 flex justify-end">
                  <Button
                    size="sm"
                    className="bg-green-500 text-white hover:bg-green-500/90 cursor-pointer"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button variant="destructive" onClick={handleDeleteFarm}>
              Delete field
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageBreadcrumb() {
  return (
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
          <BreadcrumbPage>Readiness heatmap</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const EmptyState = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <p className="text-2xl font-bold">No data found</p>
      <Link href="/fields">
        <Button>Back to fields list</Button>
      </Link>
    </div>
  );
};
