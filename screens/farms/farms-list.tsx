"use client";

import { Calendar, MapPin, Plus, Sprout, RefreshCw } from "lucide-react";
import Image from "next/image";
import { AttachNewFarmModal } from "./attach-new-farm-modal";
import Link from "next/link";
import { FarmType } from "@/types/farm";
import { useEffect, useState } from "react";
import { loadState } from "@/lib/storage";

export function FarmsList() {
  const [farms, setFarms] = useState<FarmType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Add a small delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 300));
    const freshData = loadState().farms;
    setFarms(freshData);
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      {/* <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Fields ({farms.length})</h2>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            isRefreshing
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          title="Refresh data"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div> */}

      {/* Farms grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AttachNewFarmModal>
          <div className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col items-center justify-center h-full cursor-pointer">
            <Plus />
            <p>Add new field</p>
          </div>
        </AttachNewFarmModal>
        {farms.map((farm) => (
          <FarmCard key={farm.id} {...farm} />
        ))}
      </div>
    </div>
  );
}

function FarmCard(props: FarmType) {
  const {
    id,
    name,
    thumbnailUrl,
    readiness,
    primaryCrop,
    locationLabel,
    createdAt,
  } = props;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <Link href={`/fields/${id}`}>
        <div className="flex flex-row gap-2 mb-4">
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={props.name}
              width={64}
              height={64}
              className="rounded-lg w-16 h-16 object-cover"
            />
          )}
          <div className="flex-1">
            <p className="font-bold">{name}</p>
            <FarmReadiness readiness={readiness} />
          </div>
        </div>

        <div className="flex justify-between gap-2 mb-2 items-center">
          <WithIcon icon={<Sprout size={16} />} text={primaryCrop || ""} />
          <WithIcon icon={<Calendar size={16} />} text={createdAt} />
        </div>

        <WithIcon icon={<MapPin size={16} />} text={locationLabel || ""} />
      </Link>
    </div>
  );
}

function FarmReadiness(props: { readiness: number }) {
  const { readiness } = props;

  const colors =
    readiness >= 75
      ? " bg-[#AFD8D44D] border-green-700 text-green-700"
      : readiness >= 50
      ? " bg-[#F5E7894D] border-yellow-700 text-yellow-700"
      : "bg-[#E8E2DB] border-gray-700 text-gray-700";

  return (
    <p className={`inline-block border rounded-md px-2 text-sm ${colors} `}>
      Readiness: {readiness}%
    </p>
  );
}

function WithIcon(props: { icon: React.ReactNode; text: string }) {
  const { icon, text } = props;

  return (
    <div className="flex flex-row gap-1 items-center">
      {icon}
      <p className="text-sm">{text}</p>
    </div>
  );
}
