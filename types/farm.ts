import type {
  Feature,
  Polygon as GeoPolygon,
  GeoJsonProperties,
} from "geojson";

// export type GeoJsonPolygon = {
//   type: "Feature";
//   properties: {
//     name?: string;
//   };
//   geometry: {
//     type: "Polygon";
//     coordinates: number[][][];
//   };
// };

export type GeoJsonPolygon = Feature<GeoPolygon, GeoJsonProperties>;

export type FarmType = {
  id: string;
  name: string;
  country?: string;
  locationLabel?: string; // human-readable address label
  crops?: string[];
  primaryCrop?: string;
  plantingDate?: string; // ISO date
  thumbnailUrl?: string;
  mapCenter?: { lat: number; lng: number; zoom?: number };
  centroid?: { lat: number; lng: number } | null;
  polygon?: GeoJsonPolygon | null;
  readiness: number;
  createdAt: string; // ISO date
  updatedAt?: string; // ISO date
  sections?: FarmSectionType[];
};

export type StoredState = {
  farms: FarmType[];
};

export type PlotGridType = {
  id: string;
  name: string;
  color: string;
  missingPicture?: boolean;
  alerts?: string[];
};

export type FarmSectionType = {
  id: string;
  coords: { lat: number; lng: number }[];
  color: string;
  areaM2: number;
  name: string;
  isMissingPicture?: boolean;
  grids: PlotGridType[];
};

export const EMPTY_STATE: StoredState = { farms: [] };
