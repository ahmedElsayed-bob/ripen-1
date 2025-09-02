"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CircleArrowLeft, ClipboardList, DollarSign, Sun } from "lucide-react";
import { CalendarComponent } from "./calendar";
import { Label } from "@/components/ui/label";
import MapFarmSelector, { FarmShape } from "./map-farm-selector";
import { upsertFarm } from "@/lib/storage";
import { FarmType, GeoJsonPolygon } from "@/types/farm";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { SECTIONS_DATA } from "@/constants/farms";
import Image from "next/image";
interface AttachNewFarmModalProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export function AttachNewFarmModal(props: AttachNewFarmModalProps) {
  const { children, onClose } = props;
  const router = useRouter();
  const [name, setName] = React.useState<string>("New Field Name");
  const [country, setCountry] = React.useState<string>("uae");
  const [crop, setCrop] = React.useState<string>("wheat");
  const [plantingDate, setPlantingDate] = React.useState<string>("");

  const handleSave = (farm: FarmShape) => {
    if (!name) {
      alert("Please enter a farm name");
      return;
    }

    if (!plantingDate) {
      alert("Please select a planting date");
      return;
    }

    const polygon: GeoJsonPolygon = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          farm.path
            .map((p) => [p.lng, p.lat])
            .concat([[farm.path[0].lng, farm.path[0].lat]]),
        ],
      },
      properties: {},
    };

    const farmd: FarmType = {
      id: uuidv4(),
      name: name,
      country: country,
      locationLabel: "Abu Dhabi, uae",
      crops: [crop],
      primaryCrop: crop,
      plantingDate: plantingDate,
      thumbnailUrl: "/imgs/farm.jpg",
      mapCenter: { ...farm.centroid, zoom: farm.zoom },
      centroid: farm.centroid,
      polygon,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readiness: 95,
      sections: SECTIONS_DATA,
    };
    upsertFarm(farmd);

    router.push(`/fields/${farmd.id}`);
    onClose?.();
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="w-[1200px] !max-w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <div
              contentEditable
              className="cursor-pointer"
              onBlur={(e) => setName(e.target.innerText)}
              suppressContentEditableWarning={true}
            >
              {name}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="w-1/3 flex flex-col gap-4">
            <div>
              <Label htmlFor="country" className="text-xs mb-1">
                Country
              </Label>

              <Select
                defaultValue="uae"
                name="country"
                value={country}
                onValueChange={(value) => setCountry(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uae">United Arab Emirates</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="nz">New Zealand</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CalendarComponent
                value={plantingDate}
                onChange={(value) => setPlantingDate(value)}
                label="Planting Date"
              />

              <div className="flex flex-col gap-1">
                <Label htmlFor="units" className="text-xs">
                  Units
                </Label>
                <Select defaultValue="metric" name="units">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric"> Metric</SelectItem>
                    <SelectItem value="imperial">Imperial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Select
                defaultValue="wheat"
                name="country"
                value={crop}
                onValueChange={(value) => setCrop(value)}
              >
                <SelectTrigger className="w-full h-[60px] min-h-12">
                  <SelectValue className="h-[60px] min-h-12" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheat">
                    <Image
                      src="/imgs/wheat.webp"
                      alt="Wheat"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-cover rounded-sm"
                    />
                    Wheat
                  </SelectItem>
                  <SelectItem value="corn">
                    <Image
                      src="/imgs/corn.jpeg"
                      alt="Corn"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-cover rounded-sm"
                    />
                    Corn
                  </SelectItem>
                  <SelectItem value="soy">
                    <Image
                      src="/imgs/soy.jpg"
                      alt="Soy"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-cover rounded-sm"
                    />
                    Soy
                  </SelectItem>
                  <SelectItem value="tomato">
                    <Image
                      src="/imgs/tomato.webp"
                      alt="Tomato"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-cover rounded-sm"
                    />
                    Tomato
                  </SelectItem>
                  <SelectItem value="rice">
                    <Image
                      src="/imgs/rice.webp"
                      alt="Rice"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-cover rounded-sm"
                    />
                    Rice
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <Label
              htmlFor="satellite-imagery"
              className="flex items-center gap-2 justify-between border border-gray-200 rounded-lg p-4"
            >
              <div className="flex gap-2">
                <CircleArrowLeft size={20} />
                <p className="text-sm ">Satellite Imagery</p>
              </div>
              <Switch defaultChecked id="satellite-imagery" />
            </Label> */}

            <div className="flex items-center gap-2 justify-between border border-gray-200 rounded-lg p-3">
              <div className="flex gap-2">
                <ClipboardList size={20} />
                <p className="text-sm">ERP/Telematics</p>
              </div>
              <Button size="sm" variant="link" className="cursor-pointer">
                Connect
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <MapFarmSelector onSave={handleSave} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DataSources() {
  return (
    <div className="w-[300px] bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">Data sources</h2>

      <div className="bg-white p-4 rounded-md flex flex-col gap-2">
        <div className="flex items-center gap-2 justify-between border-b border-gray-200 pb-2">
          <div className="flex gap-2">
            <CircleArrowLeft className="mt-1 text-green-500" />
            <div>
              <p className="text-sm font-bold">Satellite Imagery</p>
              <p className="text-xs text-gray-500">Sentinel 2. Planet</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center gap-2 justify-between border-b border-gray-200 pb-2">
          <div className="flex gap-2">
            <Sun className="mt-1 text-green-500" />
            <div>
              <p className="text-sm font-bold">Weather</p>
              <p className="text-xs text-gray-500">Meteomatics/OpenWeather</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-2">
            <DollarSign className="mt-1 text-green-500" />
            <div>
              <p className="text-sm font-bold">Price feeds</p>
              <p className="text-xs text-gray-500">Local market</p>
            </div>
          </div>
          <Button size="sm" variant="link" className="cursor-pointer">
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
}
