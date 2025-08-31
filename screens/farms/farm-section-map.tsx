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
};

// Helper function to create sections by subdividing the actual farm polygon
function createManualSections(farmData: FarmData, colors: string[]): Section[] {
  const { path, areaSqMeters, bounds } = farmData;
  const sections: Section[] = [];

  // Calculate farm centroid
  const centroidLat = path.reduce((sum, p) => sum + p.lat, 0) / path.length;
  const centroidLng = path.reduce((sum, p) => sum + p.lng, 0) / path.length;
  const centroid: GLL = { lat: centroidLat, lng: centroidLng };

  // Create rectangular sections by dividing the farm into strips
  const numSections = 4; // Using 4 sections for cleaner rectangular divisions

  // Determine if we should divide horizontally or vertically based on farm shape
  const farmWidth = bounds.east - bounds.west;
  const farmHeight = bounds.north - bounds.south;
  const divideVertically = farmWidth > farmHeight;

  // Create boundary-aligned rectangular sections
  for (let i = 0; i < numSections; i++) {
    let sectionCoords: GLL[] = [];
    let sectionCentroid: GLL;

    if (divideVertically) {
      // Divide farm into vertical strips
      const stripWidth = farmWidth / numSections;
      const leftBound = bounds.west + i * stripWidth;
      const rightBound = bounds.west + (i + 1) * stripWidth;

      // Find intersection points with farm boundary at these longitude lines
      const leftPoints = findBoundaryIntersections(path, leftBound, "lng");
      const rightPoints = findBoundaryIntersections(path, rightBound, "lng");

      // Create rectangular section using boundary intersections
      if (leftPoints.length >= 2 && rightPoints.length >= 2) {
        // Sort points by latitude to get proper order
        leftPoints.sort((a, b) => a.lat - b.lat);
        rightPoints.sort((a, b) => a.lat - b.lat);

        sectionCoords = [
          leftPoints[0], // Bottom left
          rightPoints[0], // Bottom right
          rightPoints[rightPoints.length - 1], // Top right
          leftPoints[leftPoints.length - 1], // Top left
          leftPoints[0], // Close the polygon
        ];
      } else {
        // Fallback: create section using bounds
        sectionCoords = [
          { lat: bounds.south, lng: leftBound },
          { lat: bounds.south, lng: rightBound },
          { lat: bounds.north, lng: rightBound },
          { lat: bounds.north, lng: leftBound },
          { lat: bounds.south, lng: leftBound },
        ];
      }

      sectionCentroid = {
        lat: (bounds.south + bounds.north) / 2,
        lng: (leftBound + rightBound) / 2,
      };
    } else {
      // Divide farm into horizontal strips
      const stripHeight = farmHeight / numSections;
      const bottomBound = bounds.south + i * stripHeight;
      const topBound = bounds.south + (i + 1) * stripHeight;

      // Find intersection points with farm boundary at these latitude lines
      const bottomPoints = findBoundaryIntersections(path, bottomBound, "lat");
      const topPoints = findBoundaryIntersections(path, topBound, "lat");

      // Create rectangular section using boundary intersections
      if (bottomPoints.length >= 2 && topPoints.length >= 2) {
        // Sort points by longitude to get proper order
        bottomPoints.sort((a, b) => a.lng - b.lng);
        topPoints.sort((a, b) => a.lng - b.lng);

        sectionCoords = [
          bottomPoints[0], // Bottom left
          bottomPoints[bottomPoints.length - 1], // Bottom right
          topPoints[topPoints.length - 1], // Top right
          topPoints[0], // Top left
          bottomPoints[0], // Close the polygon
        ];
      } else {
        // Fallback: create section using bounds
        sectionCoords = [
          { lat: bottomBound, lng: bounds.west },
          { lat: bottomBound, lng: bounds.east },
          { lat: topBound, lng: bounds.east },
          { lat: topBound, lng: bounds.west },
          { lat: bottomBound, lng: bounds.west },
        ];
      }

      sectionCentroid = {
        lat: (bottomBound + topBound) / 2,
        lng: (bounds.west + bounds.east) / 2,
      };
    }

    sections.push({
      id: `section-${i + 1}`,
      coords: sectionCoords,
      color: colors[i % colors.length],
      centroid: sectionCentroid,
      areaM2: areaSqMeters / numSections,
      name: `A${i + 1}`,
    });
  }

  console.log(
    "Created",
    sections.length,
    "rectangular sections aligned with farm boundaries"
  );
  return sections;
}

// Helper function to find intersection points between a line (horizontal or vertical) and the farm boundary
function findBoundaryIntersections(
  path: GLL[],
  lineValue: number,
  axis: "lat" | "lng"
): GLL[] {
  const intersections: GLL[] = [];

  for (let i = 0; i < path.length; i++) {
    const current = path[i];
    const next = path[(i + 1) % path.length];

    const currentVal = axis === "lat" ? current.lat : current.lng;
    const nextVal = axis === "lat" ? next.lat : next.lng;

    // Check if the line crosses this edge
    if (
      (currentVal <= lineValue && nextVal >= lineValue) ||
      (currentVal >= lineValue && nextVal <= lineValue)
    ) {
      if (currentVal === nextVal) {
        // Edge is parallel to our line, skip
        continue;
      }

      // Calculate intersection point
      const ratio = (lineValue - currentVal) / (nextVal - currentVal);
      const intersection: GLL = {
        lat:
          axis === "lat"
            ? lineValue
            : current.lat + ratio * (next.lat - current.lat),
        lng:
          axis === "lng"
            ? lineValue
            : current.lng + ratio * (next.lng - current.lng),
      };

      intersections.push(intersection);
    }
  }

  return intersections;
}

const libraries = ["drawing", "geometry", "places"] as (
  | "drawing"
  | "geometry"
  | "places"
)[];

export default function FarmSectionsMap({ id }: { id: string }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries,
  });

  const [sections, setSections] = useState<Section[]>([]);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load farm data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Try to get from the new format (GeoJSON)
    const geoJsonRaw = getFarmById(id);

    const geoJson = geoJsonRaw?.polygon;
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

      setFarmData({
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
      });
    }
  }, []);

  // Create sections when farm data is loaded
  useEffect(() => {
    if (!farmData) {
      console.log("No farm data");
      return;
    }

    console.log("Farm data loaded:", farmData);

    // Fit map to farm bounds
    if (mapRef.current) {
      const bounds = new google.maps.LatLngBounds(
        { lat: farmData.bounds.south, lng: farmData.bounds.west },
        { lat: farmData.bounds.north, lng: farmData.bounds.east }
      );
      mapRef.current.fitBounds(bounds);
    }

    // Create a simple grid-based section division
    const { bounds, path } = farmData;

    // Ensure the polygon is properly closed
    const polygonCoords = path.map((p) => [p.lng, p.lat]);
    // Only add closing point if it's not already closed
    const lastPoint = polygonCoords[polygonCoords.length - 1];
    const firstPoint = polygonCoords[0];
    if (lastPoint[0] !== firstPoint[0] || lastPoint[1] !== firstPoint[1]) {
      polygonCoords.push([firstPoint[0], firstPoint[1]]);
    }

    const farmPolygon = turf.polygon([polygonCoords]);
    console.log("Farm polygon created:", farmPolygon);

    // Calculate grid size based on farm area
    const farmAreaKm2 = farmData.areaSqMeters / 1_000_000;
    console.log("Farm area km2:", farmAreaKm2);

    const targetSections = Math.max(4, Math.min(9, Math.ceil(farmAreaKm2 * 2))); // 4-9 sections
    const cellSize = Math.max(0.05, Math.sqrt(farmAreaKm2 / targetSections)); // in km
    console.log("Target sections:", targetSections, "Cell size:", cellSize);

    // Create grid
    const bbox = [bounds.west, bounds.south, bounds.east, bounds.north] as [
      number,
      number,
      number,
      number
    ];
    console.log("Bbox:", bbox);

    const grid = turf.squareGrid(bbox, cellSize, { units: "kilometers" });
    console.log("Grid created with", grid.features.length, "cells");

    const colors = [
      "#6EA8FE", // Light blue
      "#FFD166", // Yellow
      "#95D5B2", // Light green
      "#EE7752", // Orange
      "#CDB4DB", // Light purple
      "#90CAF9", // Sky blue
      "#FFADAD", // Light pink
      "#A8E6CF", // Mint green
      "#FFB3BA", // Pink
    ];

    const newSections: Section[] = [];
    let colorIndex = 0;

    // If grid intersection fails, create simple manual sections
    if (grid.features.length === 0) {
      console.log("No grid features, creating manual sections");
      // Create 4 simple sections by dividing the farm
      const sections = createManualSections(farmData, colors);
      newSections.push(...sections);
    } else {
      for (let i = 0; i < grid.features.length; i++) {
        const cell = grid.features[i];
        console.log(`Processing cell ${i + 1}/${grid.features.length}`);

        if (!cell || !cell.geometry || !farmPolygon || !farmPolygon.geometry) {
          console.log("Invalid cell or farm polygon");
          continue;
        }

        try {
          const intersection = turf.intersect(cell as any, farmPolygon as any);
          console.log("Intersection result:", intersection);

          if (!intersection) {
            console.log("No intersection for cell", i);
            continue;
          }

          // Handle both Polygon and MultiPolygon results
          const polygons =
            intersection.geometry.type === "MultiPolygon"
              ? intersection.geometry.coordinates.map((coords) =>
                  turf.polygon(coords)
                )
              : [intersection as GeoJsonPolygon];

          console.log("Polygons to process:", polygons.length);

          for (const poly of polygons) {
            const area = turf.area(poly);
            console.log("Polygon area:", area);

            if (area < 50) {
              console.log("Skipping small polygon");
              continue; // Skip tiny pieces
            }

            const coords: GLL[] = poly.geometry.coordinates[0]
              .slice(0, -1) // Remove duplicate last point
              .map(([lng, lat]) => ({ lat, lng }));

            const centroid = turf.centroid(poly);
            const [cLng, cLat] = centroid.geometry.coordinates;

            const section = {
              id: `section-${newSections.length + 1}`,
              coords,
              color: colors[colorIndex % colors.length],
              centroid: { lat: cLat, lng: cLng },
              areaM2: area,
              name: `A${newSections.length + 1}`,
            };

            console.log("Adding section:", section);
            newSections.push(section);
            colorIndex++;
          }
        } catch (error) {
          console.warn("Error processing grid cell", i, ":", error);
          continue;
        }
      }
    }

    // Fallback: if no sections were created, create manual ones
    if (newSections.length === 0) {
      console.log("No sections created from grid, using manual fallback");
      const manualSections = createManualSections(farmData, colors);
      newSections.push(...manualSections);
    }

    console.log("Final sections:", newSections);
    setSections(newSections);
  }, [farmData]);

  // Handle section actions
  const handleSectionAction = (
    sectionId: string,
    action: "add" | "settings"
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    setSelectedSectionId(sectionId);

    switch (action) {
      case "add":
        console.log(`Adding item to section: ${section.name}`);
        // You can add your custom logic here, e.g., open a modal, navigate to another page, etc.
        alert(`Add item to ${section.name}`);
        break;
      case "settings":
        console.log(`Opening settings for section: ${section.name}`);
        // You can add your custom logic here
        alert(`Settings for ${section.name}`);
        break;
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  const center = farmData?.centroid || { lat: 24.5, lng: 54.5 };

  return (
    <div className="h-full w-full">
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

        {/* Render sections */}
        {sections.map((section) => (
          <Polygon
            key={section.id}
            paths={section.coords}
            options={{
              fillOpacity: hoverId === section.id ? 0.6 : 0.4,
              fillColor: section.color,
              strokeColor: "#fff",
              strokeWeight: hoverId === section.id ? 3 : 2,
              strokeOpacity: 0.8,
              clickable: true,
            }}
            onMouseOver={() => setHoverId(section.id)}
            onMouseOut={() => setHoverId(null)}
            onClick={() => setSelectedSectionId(section.id)}
          />
        ))}

        {/* Info window for hovered section */}
        {hoverId && sections.find((s) => s.id === hoverId) && (
          <InfoWindow
            position={sections.find((s) => s.id === hoverId)!.centroid}
            onCloseClick={() => setHoverId(null)}
            options={{ disableAutoPan: true }}
          >
            <div className="p-2 text-sm">
              <div className="font-semibold">
                {sections.find((s) => s.id === hoverId)!.name}
              </div>
              <div>
                Area:{" "}
                {(
                  sections.find((s) => s.id === hoverId)!.areaM2 / 10_000
                ).toFixed(2)}{" "}
                ha
              </div>
              <div>
                ({sections.find((s) => s.id === hoverId)!.areaM2.toFixed(0)} m²)
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Section center overlays with icons and buttons */}
        {sections.map((section) => (
          <OverlayView
            key={`overlay-${section.id}`}
            position={section.centroid}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2">
              {/* Section marker icon */}
              <div
                className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                  selectedSectionId === section.id
                    ? "bg-white border-2 border-blue-500 scale-110"
                    : "bg-white/90 border border-gray-300 hover:bg-white hover:scale-105"
                }`}
              >
                <MapPin
                  className={`w-4 h-4 ${
                    selectedSectionId === section.id
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                />
              </div>

              <p>{section.name}</p>

              {/* Action buttons - show on hover or when selected */}
              <div
                className={`flex gap-1 transition-all duration-200 ${
                  hoverId === section.id || selectedSectionId === section.id
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 px-2 bg-white/95 hover:bg-white shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSectionAction(section.id, "add");
                  }}
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 px-2 bg-white/95 hover:bg-white shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSectionAction(section.id, "settings");
                  }}
                >
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </OverlayView>
        ))}
      </GoogleMap>

      {/* Legend */}
      {sections.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <h4 className="font-semibold mb-2 text-sm">Farm Sections</h4>
          <div className="space-y-1">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`flex items-center gap-2 text-xs cursor-pointer p-1 rounded transition-colors ${
                  selectedSectionId === section.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onMouseEnter={() => setHoverId(section.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => setSelectedSectionId(section.id)}
              >
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: section.color }}
                />
                <span className="flex-1">{section.name}</span>
                <span className="text-gray-500">
                  {(section.areaM2 / 10_000).toFixed(1)}ha
                </span>
              </div>
            ))}
          </div>
          {farmData && (
            <div className="mt-3 pt-2 border-t text-xs text-gray-600">
              <div>
                Total Farm: {(farmData.areaSqMeters / 10_000).toFixed(2)} ha
              </div>
              <div>Sections: {sections.length}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
