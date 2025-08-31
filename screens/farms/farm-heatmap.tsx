"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  Polygon,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";
import * as turf from "@turf/turf";
import type { Feature, Polygon as GeoPolygon } from "geojson";

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

const sections22 = [
  {
    id: "section-1",
    coords: [
      {
        lat: 25.090457849295085,
        lng: 55.92451133123873,
      },
      {
        lat: 25.090846506958282,
        lng: 55.92476345888613,
      },
      {
        lat: 25.090394692308205,
        lng: 55.925718325295435,
      },
      {
        lat: 25.09023922881706,
        lng: 55.92560030809878,
      },
      {
        lat: 25.090015749702488,
        lng: 55.925487655320154,
      },
      {
        lat: 25.09002546619419,
        lng: 55.92539646021365,
      },
    ],
    color: "green",
    centroid: {
      lat: 25.09033,
      lng: 55.925246,
    },
    areaM2: 5493,
    name: "Section 1",
  },

  {
    id: "section-2",
    coords: [
      {
        lat: 25.089978550612443,
        lng: 55.925516348338235,
      },
      {
        lat: 25.08959960671804,
        lng: 55.92633978650581,
      },
      {
        lat: 25.089956688496603,
        lng: 55.92654363439094,
      },
      {
        lat: 25.09015587651898,
        lng: 55.926098387694466,
      },
      {
        lat: 25.090121868830785,
        lng: 55.92608229444038,
      },
      {
        lat: 25.090243324816626,
        lng: 55.92580602691184,
      },
      {
        lat: 25.090345347751576,
        lng: 55.92573360726844,
      },
    ],
    color: "green",
    centroid: {
      lat: 25.090057,
      lng: 55.926017,
    },
    areaM2: 3963,
    name: "Section 2",
  },

  {
    id: "section-3",
    coords: [
      {
        lat: 25.090866126769612,
        lng: 55.92478604232181,
      },
      {
        lat: 25.091726027324444,
        lng: 55.92531711970676,
      },
      {
        lat: 25.091672587353095,
        lng: 55.92539222155918,
      },
      {
        lat: 25.090832119278815,
        lng: 55.92486650859226,
      },
    ],
    color: "#BE6A3A",
    centroid: {
      lat: 25.091274,
      lng: 55.92509,
    },
    areaM2: 1001,
    name: "Section 3",
  },

  {
    id: "section-4",
    coords: [
      {
        lat: 25.090822319643287,
        lng: 55.924862608156204,
      },
      {
        lat: 25.091684649595912,
        lng: 55.92538295670509,
      },
      {
        lat: 25.091645784151364,
        lng: 55.92544732972145,
      },
      {
        lat: 25.09172108593897,
        lng: 55.925455376348495,
      },
      {
        lat: 25.09172594411722,
        lng: 55.92551438494682,
      },
      {
        lat: 25.09165064233261,
        lng: 55.92563240214348,
      },
      {
        lat: 25.090722726215027,
        lng: 55.925071820459365,
      },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.091425,
      lng: 55.925338,
    },
    areaM2: 2773,
    name: "Section 4",
  },

  {
    id: "section-5",
    coords: [
      {
        lat: 25.090718428306346,
        lng: 55.92505988233136,
      },
      {
        lat: 25.09161719536514,
        lng: 55.925609735179414,
      },
      {
        lat: 25.091651202637724,
        lng: 55.92566337935971,
      },
      {
        lat: 25.09162448263864,
        lng: 55.92570629470395,
      },
      {
        lat: 25.091602620816836,
        lng: 55.92570629470395,
      },
      {
        lat: 25.091534606235175,
        lng: 55.92589673154401,
      },
      {
        lat: 25.09150545711717,
        lng: 55.925867227244844,
      },
      {
        lat: 25.091490882555558,
        lng: 55.92578944318341,
      },
      {
        lat: 25.090618834793563,
        lng: 55.92527177684354,
      },
    ],
    color: "#CBA53E",
    centroid: {
      lat: 25.091374,
      lng: 55.925619,
    },
    areaM2: 2802,
    name: "Section 5",
  },

  {
    id: "section-6",
    coords: [
      {
        lat: 25.090624718132673,
        lng: 55.92527174379293,
      },
      {
        lat: 25.091499194946362,
        lng: 55.92579209234182,
      },
      {
        lat: 25.09150405313344,
        lng: 55.92590474512045,
      },
      {
        lat: 25.09144575487593,
        lng: 55.926012033481044,
      },
      {
        lat: 25.0905469865579,
        lng: 55.92543804075186,
      },
    ],
    color: "green",
    centroid: {
      lat: 25.091124,
      lng: 55.925684,
    },
    areaM2: 2364,
    name: "Section 6",
  },

  {
    id: "section-7",
    coords: [
      {
        lat: 25.090555767121238,
        lng: 55.92544092236513,
      },
      {
        lat: 25.091473968128977,
        lng: 55.925977364168105,
      },
      {
        lat: 25.091095028865542,
        lng: 55.926749840364394,
      },
      {
        lat: 25.090186541493267,
        lng: 55.926197305307326,
      },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.090828,
      lng: 55.926091,
    },
    areaM2: 2364,
    name: "Section 7",
  },

  {
    id: "section-8",
    coords: [
      {
        lat: 25.09018879665297,
        lng: 55.92620510644023,
      },
      {
        lat: 25.09110214221153,
        lng: 55.92674691266124,
      },
      {
        lat: 25.091043843762552,
        lng: 55.92686492985789,
      },
      {
        lat: 25.0910778511945,
        lng: 55.92690784520213,
      },
      {
        lat: 25.0908543736115,
        lng: 55.927283354464215,
      },
      {
        lat: 25.08991187670595,
        lng: 55.92670936173503,
      },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.090696,
      lng: 55.926786,
    },
    areaM2: 7175,
    name: "Section 8",
  },
];

const ddd = [
  {
    id: "section-9",
    coords: [
      {
        lat: 25.089065319049798,
        lng: 55.930347831312496,
      },
      {
        lat: 25.088640418393148,
        lng: 55.930917532705394,
      },
      {
        lat: 25.08833312324895,
        lng: 55.930607548123966,
      },
      {
        lat: 25.08876181873129,
        lng: 55.930042035711885,
      },
      {
        lat: 25.089065319049798,
        lng: 55.930347831312496,
      },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.088708706098174,
      lng: 55.93043998889076,
    },
    areaM2: 7175,
    name: "Section 9",
  },

  {
    id: "section-10",
    coords: [
      { lat: 25.088640418393148, lng: 55.930917532705394 },
      { lat: 25.088283804203346, lng: 55.93139088753921 },
      { lat: 25.087942364111655, lng: 55.93108090295778 },
      { lat: 25.088330194372247, lng: 55.9306043683831 },
      { lat: 25.088640418393148, lng: 55.930917532705394 },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.088708706098174,
      lng: 55.93043998889076,
    },
    areaM2: 7175,
    name: "Section 1",
  },

  {
    id: "section-11",
    coords: [
      { lat: 25.088451201993006, lng: 55.93173637095541 },
      { lat: 25.088064649451756, lng: 55.93225783443543 },
      { lat: 25.087817734105442, lng: 55.93205145572535 },
      { lat: 25.088229384167686, lng: 55.93153199085539 },
      { lat: 25.088451201993006, lng: 55.93173637095541 },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.088708706098174,
      lng: 55.93043998889076,
    },
    areaM2: 7175,
    name: "Section 11",
  },

  {
    id: "section-12",
    coords: [
      { lat: 25.08945967201043, lng: 55.93073855110712 },
      { lat: 25.088966766554694, lng: 55.9313636256704 },
      { lat: 25.088585935689945, lng: 55.93101257369345 },
      { lat: 25.08907312451242, lng: 55.93035087860019 },

      { lat: 25.08945967201043, lng: 55.93073855110712 },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.088708706098174,
      lng: 55.93043998889076,
    },
    areaM2: 7175,
    name: "Section 12",
  },

  {
    id: "section-13",
    coords: [
      { lat: 25.088966766554694, lng: 55.9313636256704 },
      { lat: 25.08866827759145, lng: 55.93174877261856 },
      { lat: 25.088288589438577, lng: 55.931391406757136 },
      { lat: 25.088585935689945, lng: 55.93101257369345 },
      { lat: 25.088966766554694, lng: 55.9313636256704 },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.088708706098174,
      lng: 55.93043998889076,
    },
    areaM2: 7175,
    name: "Section 13",
  },

  {
    id: "section-14",
    coords: [
      { lat: 25.089641334560458, lng: 55.9317033186708 },
      { lat: 25.089224786851798, lng: 55.932301996943515 },
      { lat: 25.088670247235253, lng: 55.93174705898475 },
      { lat: 25.089139946727414, lng: 55.93114469609118 },
      { lat: 25.089641334560458, lng: 55.9317033186708 },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.088708706098174,
      lng: 55.93043998889076,
    },
    areaM2: 7175,
    name: "Section 14",
  },

  {
    id: "section-15",
    coords: [
      { lat: 25.090019355160727, lng: 55.93125842020592 },
      { lat: 25.089641334560458, lng: 55.9317033186708 },
      { lat: 25.089139946727414, lng: 55.93114469609118 },
      { lat: 25.08945967201043, lng: 55.93073855110712 },
      { lat: 25.090019355160727, lng: 55.93125842020592 },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.088708706098174,
      lng: 55.93043998889076,
    },
    areaM2: 7175,
    name: "Section 15",
  },

  {
    id: "section-16",
    coords: [
      { lat: 25.090643948218073, lng: 55.93186174473077 },
      { lat: 25.090315728700336, lng: 55.932291646878866 },
      { lat: 25.089641334560458, lng: 55.9317033186708 },
      { lat: 25.090019355160727, lng: 55.93125842020592 },
      { lat: 25.090643948218073, lng: 55.93186174473077 },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.088708706098174,
      lng: 55.93043998889076,
    },
    areaM2: 7175,
    name: "Section 16",
  },

  {
    id: "section-17",
    coords: [
      { lat: 25.090315728700336, lng: 55.932291646878866 },
      { lat: 25.089679074619703, lng: 55.93302474487086 },
      { lat: 25.089121096516124, lng: 55.932556101540804 },
      { lat: 25.089641334560458, lng: 55.9317033186708 },
      { lat: 25.090315728700336, lng: 55.932291646878866 },
    ],
    color: "#9CBB52",
    centroid: {
      lat: 25.088708706098174,
      lng: 55.93043998889076,
    },
    areaM2: 7175,
    name: "Section 17",
  },
];

const libraries = ["geometry"] as any;

export default function FarmHeatmap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries,
  });

  const [sections, setSections] = useState<Section[]>(ddd);

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load farm data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Try to get from the new format (GeoJSON)
    const geoJsonRaw = localStorage.getItem("farm-geojson");
    if (geoJsonRaw) {
      const geoJson = JSON.parse(geoJsonRaw) as Feature<GeoPolygon>;
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
            onClick={() => setHoverId(section.id)}
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
      </GoogleMap>

      {/* Legend */}
      {sections.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <h4 className="font-semibold mb-2 text-sm">Farm Sections</h4>
          <div className="space-y-1">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 p-1 rounded"
                onMouseEnter={() => setHoverId(section.id)}
                onMouseLeave={() => setHoverId(null)}
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
