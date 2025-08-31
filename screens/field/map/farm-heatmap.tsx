"use client";

import { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Polygon,
  useJsApiLoader,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import * as turf from "@turf/turf";
import { Button } from "@/components/ui/button";
import { Plus, Settings, MapPin } from "lucide-react";
import { GeoJsonPolygon } from "@/types/farm";
import { getFarmById } from "@/lib/storage";

type GLL = google.maps.LatLngLiteral;

type FarmData = {
  path: GLL[];
  areaSqMeters: number;
  perimeterMeters: number;
  centroid: GLL;
  bounds: {
    east: number;
    north: number;
    west: number;
    south: number;
  };
};

type Section = {
  id: string;
  coords: GLL[];
  color: string;
  centroid: GLL;
  areaM2: number;
  name: string;
  readiness: number; // 0-100 representing harvest readiness
};

const libraries = ["drawing", "geometry", "places"] as (
  | "drawing"
  | "geometry"
  | "places"
)[];

// Helper function to get color based on readiness
function getReadinessColor(readiness: number): string {
  if (readiness >= 80) return "#22c55e"; // Green - ready to harvest
  if (readiness >= 60) return "#eab308"; // Yellow - almost ready
  if (readiness >= 40) return "#f97316"; // Orange - getting ready
  return "#ef4444"; // Red - not ready
}

// Helper function to create sections by subdividing the farm polygon
function createHeatmapSections(farmData: FarmData): Section[] {
  const { path, areaSqMeters } = farmData;
  const sections: Section[] = [];

  console.log("Creating heatmap sections for farm:", {
    path,
    bounds: farmData.bounds,
    pathLength: path?.length,
    areaSqMeters,
  });

  // Validate farm data
  if (!path || path.length < 3) {
    console.error("Invalid farm path:", path);
    return [];
  }

  // Calculate farm centroid
  const centroidLat = path.reduce((sum, p) => sum + p.lat, 0) / path.length;
  const centroidLng = path.reduce((sum, p) => sum + p.lng, 0) / path.length;
  const centroid: GLL = { lat: centroidLat, lng: centroidLng };

  // Create a grid of sections (3x3 = 9 sections for simpler debugging)
  const gridSize = 3;
  const bounds = farmData.bounds;
  const latStep = (bounds.north - bounds.south) / gridSize;
  const lngStep = (bounds.east - bounds.west) / gridSize;

  console.log("Grid setup:", { gridSize, bounds, latStep, lngStep });

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const south = bounds.south + i * latStep;
      const north = bounds.south + (i + 1) * latStep;
      const west = bounds.west + j * lngStep;
      const east = bounds.west + (j + 1) * lngStep;

      // Create section coordinates
      const sectionCoords: GLL[] = [
        { lat: south, lng: west },
        { lat: north, lng: west },
        { lat: north, lng: east },
        { lat: south, lng: east },
      ];

      // Simple check if section center is inside the farm polygon
      const sectionCenter = {
        lat: (south + north) / 2,
        lng: (west + east) / 2,
      };

      try {
        // Create farm polygon for intersection
        const farmPolygon = turf.polygon([
          path.map((p) => [p.lng, p.lat]).concat([[path[0].lng, path[0].lat]]),
        ]);

        // Create section polygon
        const sectionPolygon = turf.polygon([
          [
            [west, south],
            [west, north],
            [east, north],
            [east, south],
            [west, south],
          ],
        ]);

        // Simpler, more robust overlap detection
        let hasOverlap = false;

        try {
          console.log(`Testing overlap for section ${i}-${j}:`, {
            sectionBounds: { south, north, west, east },
            sectionCenter,
          });

          // First, try the simple center point test
          const centerPoint = turf.point([
            sectionCenter.lng,
            sectionCenter.lat,
          ]);
          const centerInFarm = turf.booleanPointInPolygon(
            centerPoint,
            farmPolygon
          );

          // Also test the corners of the section
          const corners = [
            turf.point([west, south]),
            turf.point([west, north]),
            turf.point([east, north]),
            turf.point([east, south]),
          ];

          const cornersInFarm = corners.map((corner) =>
            turf.booleanPointInPolygon(corner, farmPolygon)
          );
          const anyCornerInFarm = cornersInFarm.some((inFarm) => inFarm);

          // Try intersection test
          let hasIntersection = false;
          try {
            const intersection = turf.intersect(
              farmPolygon as any,
              sectionPolygon as any
            );
            hasIntersection = intersection !== null;
          } catch (intersectionError) {
            console.log(
              `Intersection test failed for section ${i}-${j}:`,
              intersectionError
            );
          }

          hasOverlap = centerInFarm || anyCornerInFarm || hasIntersection;

          console.log(`Overlap tests for section ${i}-${j}:`, {
            centerInFarm,
            anyCornerInFarm,
            cornersInFarm,
            hasIntersection,
            hasOverlap,
          });
        } catch (error) {
          console.error(
            `Overlap detection error for section ${i}-${j}:`,
            error
          );
          hasOverlap = false; // Default to false if all tests fail
        }

        if (hasOverlap) {
          console.log(`Section ${i}-${j} has overlap, processing...`);
          let finalCoords = sectionCoords;
          let finalArea = latStep * lngStep * 111000 * 111000; // Default area

          // Try to use intersection for better boundaries, but don't fail if it doesn't work
          try {
            const intersection = turf.intersect(
              farmPolygon as any,
              sectionPolygon as any
            );

            console.log(`Intersection result for section ${i}-${j}:`, {
              hasIntersection: !!intersection,
              geometryType: intersection?.geometry?.type,
              coordinatesLength:
                intersection?.geometry?.coordinates?.[0]?.length,
            });

            if (
              intersection &&
              intersection.geometry &&
              intersection.geometry.coordinates &&
              intersection.geometry.coordinates[0] &&
              intersection.geometry.coordinates[0].length > 3 // At least 3 points + closing point
            ) {
              // Use intersected polygon - this ensures no overflow
              const coords = intersection.geometry.coordinates[0] as number[][];
              finalCoords = coords
                .slice(0, -1) // Remove duplicate last point
                .map(([lng, lat]) => ({
                  lat: lat as number,
                  lng: lng as number,
                }));

              finalArea = turf.area(intersection);
              console.log(
                `Using intersected boundary for section ${i}-${j} with ${finalCoords.length} points, area: ${finalArea}`
              );
            } else {
              console.log(
                `Using original section bounds for section ${i}-${j} (intersection not usable)`
              );
              // Keep the original section coordinates and area
            }
          } catch (intersectionError) {
            console.log(
              `Intersection failed for section ${i}-${j}, using original bounds:`,
              intersectionError
            );
            // Keep the original section coordinates and area
          }

          // Generate random readiness (0-100)
          const readiness = Math.floor(Math.random() * 100);

          console.log(`Creating section ${i}-${j}:`, {
            sectionCenter,
            readiness,
            coordsCount: finalCoords.length,
            finalArea,
          });

          const newSection = {
            id: `section-${i}-${j}`,
            coords: finalCoords,
            color: getReadinessColor(readiness),
            centroid: sectionCenter,
            areaM2: finalArea,
            name: `Section ${i + 1}-${j + 1}`,
            readiness,
          };

          sections.push(newSection);
          console.log(
            `Successfully added section ${i}-${j}, total sections: ${sections.length}`
          );
        } else {
          console.log(`Section ${i}-${j} has no overlap, skipping`);
        }
      } catch (error) {
        console.error("Error processing section", i, j, error);
      }
    }
  }

  console.log(`Created ${sections.length} heatmap sections`);
  return sections;
}

export default function FarmHeatmap({ id }: { id: string }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries,
  });

  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  console.log({ sections });
  // Load farm data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    console.log("Loading farm data for ID:", id);

    // Try to get from the new format (GeoJSON)
    const geoJsonRaw = getFarmById(id);
    console.log("Found farm data:", geoJsonRaw);

    const geoJson = geoJsonRaw?.polygon;
    console.log("Extracted polygon:", geoJson);

    if (geoJson) {
      const coords = geoJson.geometry.coordinates[0];
      const path: GLL[] = coords
        .slice(0, -1)
        .map(([lng, lat]) => ({ lat, lng })); // Remove last duplicate point

      // Calculate area, perimeter, centroid, bounds
      const area = turf.area(geoJson);
      const line = turf.lineString([...coords]);
      const perimeter = turf.length(line, { units: "meters" });
      const centroidFeature = turf.centroid(geoJson);
      const [cLng, cLat] = centroidFeature.geometry.coordinates;
      const bbox = turf.bbox(geoJson);

      const farmDataObj = {
        path,
        areaSqMeters: area,
        perimeterMeters: perimeter,
        centroid: { lat: cLat, lng: cLng },
        bounds: {
          west: bbox[0],
          south: bbox[1],
          east: bbox[2],
          north: bbox[3],
        },
      };

      console.log("Setting farm data:", farmDataObj);
      setFarmData(farmDataObj);

      // Generate heatmap sections
      const heatmapSections = createHeatmapSections(farmDataObj);
      console.log("Generated heatmap sections:", heatmapSections);
      setSections(heatmapSections);
    } else {
      console.error("No farm data found for ID:", id, "or no polygon data");
      setFarmData(null);
      setSections([]);
    }
  }, [id]);

  if (!isLoaded) return <div>Loading map...</div>;

  const center = farmData?.centroid || { lat: 24.5, lng: 54.5 };

  return (
    <div className="h-full w-full relative">
      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2 text-sm">Harvest Readiness</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs">Ready (80-100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-xs">Almost Ready (60-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-xs">Getting Ready (40-59%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-xs">Not Ready (0-39%)</span>
          </div>
        </div>
      </div>

      <GoogleMap
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onUnmount={() => {
          mapRef.current = null;
        }}
        center={center}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          mapTypeId: "hybrid",
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: true,
          zoomControl: true,
        }}
      >
        {/* Render farm boundary */}
        {farmData && (
          <Polygon
            paths={farmData.path}
            options={{
              fillOpacity: 0.1,
              fillColor: "#333",
              strokeColor: "#000",
              strokeWeight: 3,
              strokeOpacity: 0.8,
            }}
          />
        )}

        {/* Render heatmap sections */}
        {sections.map((section) => (
          <Polygon
            key={section.id}
            paths={section.coords}
            options={{
              fillOpacity: 0.7,
              fillColor: section.color,
              strokeColor: "#fff",
              strokeWeight: 1,
              strokeOpacity: 0.8,
            }}
            onClick={() => setSelectedSection(section)}
          />
        ))}

        {/* Info window for selected section */}
        {selectedSection && (
          <InfoWindow
            position={selectedSection.centroid}
            onCloseClick={() => setSelectedSection(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedSection.name}</h3>
              <p className="text-sm">Readiness: {selectedSection.readiness}%</p>
              <p className="text-sm">
                Area: {(selectedSection.areaM2 / 10000).toFixed(2)} ha
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
