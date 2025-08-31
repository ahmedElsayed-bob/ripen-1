import { FarmType } from "@/types/farm";

export const FARMS_DATA: FarmType[] = [
  {
    id: "1",
    name: "Al Dhafra wheat farm",
    createdAt: new Date().toISOString(),
    country: "UAE",
    locationLabel: "Abu Dhabi",
    crops: ["Tomatoes", "Wheat"],
    primaryCrop: "Tomatoes",
    plantingDate: "2024-01-01",
    thumbnailUrl: "/imgs/farm.jpg",
    readiness: 98,
  },
];
