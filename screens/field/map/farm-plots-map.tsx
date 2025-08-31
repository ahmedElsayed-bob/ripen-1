"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Polygon,
  useJsApiLoader,
  OverlayView,
} from "@react-google-maps/api";
import { FarmType } from "@/types/farm";
import { isPointInsidePolygon, polygonBoundsCenter } from "@/lib/map-helpers";
import { SECTIONS_DATA } from "../constants/sections";
import FarmSectionsMap from "@/screens/farms/farm-section-map";

type GLL = google.maps.LatLngLiteral;

const libraries = ["drawing", "geometry", "places"] as (
  | "drawing"
  | "geometry"
  | "places"
)[];

export function FarmPlotsMap({ farm }: { farm: FarmType }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries,
  });

  const [farmPath, setFarmPath] = useState<GLL[]>([]);
  const [mapCenter, setMapCenter] = useState<GLL>({ lat: 24.5, lng: 54.5 });
  const mapRef = useRef<google.maps.Map | null>(null);

  // Extract farm coordinates and setup map
  useEffect(() => {
    if (!farm?.polygon?.geometry?.coordinates) {
      console.log("No farm polygon data available");
      return;
    }

    try {
      // Extract coordinates from GeoJSON polygon
      const coords = farm.polygon.geometry.coordinates[0];
      const path: GLL[] = coords
        .slice(0, -1)
        .map(([lng, lat]) => ({ lat, lng }));

      setFarmPath(path);

      // Calculate center from farm coordinates or use provided mapCenter
      let center: GLL;
      if (farm.mapCenter) {
        center = { lat: farm.mapCenter.lat, lng: farm.mapCenter.lng };
      } else if (farm.centroid) {
        center = { lat: farm.centroid.lat, lng: farm.centroid.lng };
      } else {
        // Calculate centroid from path
        const avgLat = path.reduce((sum, p) => sum + p.lat, 0) / path.length;
        const avgLng = path.reduce((sum, p) => sum + p.lng, 0) / path.length;
        center = { lat: avgLat, lng: avgLng };
      }

      setMapCenter(center);

      // Fit map to farm bounds when map is loaded
      if (mapRef.current && path.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point));
        mapRef.current.fitBounds(bounds);
      }
    } catch (error) {
      console.error("Error processing farm coordinates:", error);
    }
  }, [farm]);

  // Fit bounds when map loads
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (farmPath.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      farmPath.forEach((point) => bounds.extend(point));
      map.fitBounds(bounds);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div>Loading map...</div>
      </div>
    );
  }

  const isPointInsidePolygond = isPointInsidePolygon(farmPath, {
    lat: 25.0892112355825,
    lng: 55.931436044164634,
  });
  console.log({ isPointInsidePolygond });

  if (isPointInsidePolygond === false) {
    return <FarmSectionsMap id={farm.id} />;
  }

  return (
    <div className="h-full w-full">
      <GoogleMap
        onLoad={onMapLoad}
        onUnmount={() => {
          mapRef.current = null;
        }}
        center={mapCenter}
        zoom={farm.mapCenter?.zoom || 15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          mapTypeId: "hybrid",
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: true,
          zoomControl: true,
        }}
      >
        {/* Render farm boundary polygon */}
        {farmPath.length > 0 && (
          <Polygon
            paths={farmPath}
            options={{
              //   fillOpacity: 0.2,
              //   fillColor: "#4CAF50",
              //   strokeColor: "#2E7D32",
              //   strokeWeight: 2,
              //   strokeOpacity: 0.8,
              fillColor: "transparent",
            }}
          />
        )}

        {SECTIONS_DATA.map((section) => (
          <React.Fragment key={section.id}>
            <Polygon
              paths={section.coords}
              options={{
                //   fillOpacity: hoverId === section.id ? 0.6 : 0.4,
                fillColor: section.color,
                fillOpacity: 0.8,
                strokeColor: "#000",
                strokeWeight: 1.5,
                //   strokeWeight: hoverId === section.id ? 3 : 2,
                strokeOpacity: 0.8,
                clickable: true,
              }}
              // onMouseOver={() => setHoverId(section.id)}
              // onMouseOut={() => setHoverId(null)}
              // onClick={() => setHoverId(section.id)}
            />

            <OverlayView
              key={section.id}
              position={polygonBoundsCenter(section.coords)}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-sm text-white">{section.name}</p>
              </div>
            </OverlayView>
          </React.Fragment>
        ))}

        {/* {SECTIONS_DATA.map((section) => (
         
        ))} */}
      </GoogleMap>

      {/* Farm info overlay */}
      {/* {farm && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <h3 className="font-semibold text-lg">{farm.name}</h3>
          {farm.locationLabel && (
            <p className="text-sm text-gray-600">{farm.locationLabel}</p>
          )}
          {farm.primaryCrop && (
            <p className="text-sm">
              <span className="font-medium">Primary Crop:</span>{" "}
              {farm.primaryCrop}
            </p>
          )}
          {farm.plantingDate && (
            <p className="text-sm">
              <span className="font-medium">Planted:</span>{" "}
              {new Date(farm.plantingDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )} */}
    </div>
  );
}
