"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
  Polygon,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PenTool, RotateCcw } from "lucide-react";

type LatLng = google.maps.LatLng | google.maps.LatLngLiteral;

export type FarmShape = {
  path: google.maps.LatLngLiteral[];
  areaSqMeters: number;
  perimeterMeters: number;
  centroid: google.maps.LatLngLiteral;
  zoom: number;
  bounds: google.maps.LatLngBoundsLiteral;
};

const libraries = ["drawing", "geometry", "places"] as (
  | "drawing"
  | "geometry"
  | "places"
)[];

export default function MapFarmSelector({
  onSave,
}: {
  onSave: (farm: FarmShape) => void;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries,
  });

  //   SEARCH BOX
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  );
  const drawnPolygonsRef = useRef<google.maps.Polygon[]>([]);
  const onMapLoad = (m: google.maps.Map) => {
    mapRef.current = m;
  };
  const onMapUnmount = () => {
    mapRef.current = null;
  };

  const onSearchLoad = (sb: google.maps.places.SearchBox) => {
    searchBoxRef.current = sb;
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const geom = place.geometry;
    if (!geom) return;

    if (geom.viewport && mapRef.current) {
      // Fit to the place’s viewport if available
      mapRef.current.fitBounds(geom.viewport);
    } else if (geom.location && mapRef.current) {
      // Otherwise, pan & zoom to the exact location
      mapRef.current.panTo(geom.location);
      mapRef.current.setZoom(16);
    }
  };
  //   END OF SEARCH BOX

  const [polygonPath, setPolygonPath] = useState<google.maps.LatLngLiteral[]>(
    []
  );
  const [farm, setFarm] = useState<FarmShape | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);

  const center = useMemo(() => ({ lat: 25.2048, lng: 55.2708 }), []); // Dubai default

  const computeShapeData = useCallback((path: LatLng[]) => {
    const llPath: google.maps.LatLng[] = path.map((p) =>
      p instanceof google.maps.LatLng ? p : new google.maps.LatLng(p)
    );

    const area = google.maps.geometry.spherical.computeArea(llPath);
    const perimeter =
      google.maps.geometry.spherical.computeLength(llPath) +
      // close the ring
      google.maps.geometry.spherical.computeDistanceBetween(
        llPath[0],
        llPath[llPath.length - 1]
      );

    // centroid (average of points; for complex shapes a true polygon centroid is different,
    // but this works well for simple fields)
    const centroid = llPath.reduce(
      (acc, cur) => {
        acc.lat += cur.lat();
        acc.lng += cur.lng();
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    centroid.lat /= llPath.length;
    centroid.lng /= llPath.length;

    // bounds
    const b = new google.maps.LatLngBounds();
    llPath.forEach((pt) => b.extend(pt));
    const bounds: google.maps.LatLngBoundsLiteral = {
      east: b.getNorthEast().lng(),
      north: b.getNorthEast().lat(),
      west: b.getSouthWest().lng(),
      south: b.getSouthWest().lat(),
    };

    return {
      path: llPath.map((p) => ({ lat: p.lat(), lng: p.lng() })),
      areaSqMeters: area,
      perimeterMeters: perimeter,
      centroid,
      bounds,
    } as FarmShape;
  }, []);

  const startPolygonDrawing = useCallback(() => {
    if (drawingManagerRef.current) {
      setIsDrawingMode(true);
      drawingManagerRef.current.setDrawingMode(
        google.maps.drawing.OverlayType.POLYGON
      );
    }
  }, []);

  const stopDrawing = useCallback(() => {
    if (drawingManagerRef.current) {
      setIsDrawingMode(false);
      drawingManagerRef.current.setDrawingMode(null);
    }
  }, []);

  const clearPolygon = useCallback(() => {
    setPolygonPath([]);
    setFarm(null);

    // Remove all drawn polygons from the map
    drawnPolygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });
    drawnPolygonsRef.current = [];

    // Also stop drawing mode if active
    if (isDrawingMode) {
      stopDrawing();
    }
  }, [isDrawingMode, stopDrawing]);

  const onPolygonComplete = useCallback(
    (poly: google.maps.Polygon) => {
      console.log("onPolygonComplete", poly);
      // Stop drawing mode after completing a polygon
      stopDrawing();

      // Store the polygon reference for later cleanup
      drawnPolygonsRef.current.push(poly);

      // read path
      const path = poly.getPath().getArray();
      const shape = computeShapeData(path);
      setPolygonPath(shape.path);
      setFarm(shape);

      // allow edits after drawing
      poly.setEditable(true);
      poly.setDraggable(false);

      // keep state in sync if user adjusts vertices
      const sync = () => {
        const updated = poly.getPath().getArray();
        const s = computeShapeData(updated);
        setPolygonPath(s.path);
        setFarm(s);
      };
      google.maps.event.addListener(poly.getPath(), "insert_at", sync);
      google.maps.event.addListener(poly.getPath(), "set_at", sync);
      google.maps.event.addListener(poly.getPath(), "remove_at", sync);
    },
    [computeShapeData, stopDrawing]
  );

  const handleOnSave = () => {
    if (!farm) return;
    const zoom = mapRef.current?.getZoom() || 10;
    onSave({ ...farm, zoom });
  };

  if (!isLoaded) return null;

  return (
    <>
      <div className="relative">
        <div className="absolute z-20 left-8 right-8 top-4">
          <StandaloneSearchBox
            onLoad={onSearchLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Search address, farm, landmark…"
              className="border border-gray-200 w-full h-10 p-3 rounded-lg outline-none bg-white"
            />
          </StandaloneSearchBox>
        </div>

        {/* Drawing Controls */}
        <div className="absolute bottom-4 left-8 flex gap-3 z-20">
          <Button
            onClick={isDrawingMode ? stopDrawing : startPolygonDrawing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PenTool />
            {isDrawingMode ? "Cancel Drawing" : "Draw"}
          </Button>

          <Button
            onClick={clearPolygon}
            variant="outline"
            className="flex items-center gap-2"
            disabled={polygonPath.length === 0 && !farm}
          >
            <RotateCcw />
            Clear Polygon
          </Button>
        </div>

        <GoogleMap
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          center={center}
          zoom={10}
          mapContainerStyle={{
            width: "100%",
            height: "700px",
            marginBottom: "20px",
            borderRadius: "20px",
          }}
          options={{
            mapTypeId: "hybrid",
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {/* Drawing tools: polygon & rectangle (rectangle returns a path too) */}
          <DrawingManager
            onLoad={(drawingManager) => {
              drawingManagerRef.current = drawingManager;
            }}
            onPolygonComplete={onPolygonComplete}
            onRectangleComplete={(rect) => {
              // Store the rectangle reference for later cleanup (rectangles are also overlays)
              drawnPolygonsRef.current.push(rect as any);

              const bounds = rect.getBounds();
              if (!bounds) return;
              const path = [
                {
                  lat: bounds.getNorthEast()!.lat(),
                  lng: bounds.getSouthWest()!.lng(),
                },
                {
                  lat: bounds.getNorthEast()!.lat(),
                  lng: bounds.getNorthEast()!.lng(),
                },
                {
                  lat: bounds.getSouthWest()!.lat(),
                  lng: bounds.getNorthEast()!.lng(),
                },
                {
                  lat: bounds.getSouthWest()!.lat(),
                  lng: bounds.getSouthWest()!.lng(),
                },
              ];
              const shape = computeShapeData(path);
              setPolygonPath(shape.path);
              setFarm(shape);
              rect.setEditable(true);
              rect.setDraggable(false);
              // keep in sync while resizing
              google.maps.event.addListener(rect, "bounds_changed", () => {
                const b = rect.getBounds();
                if (!b) return;
                const p = [
                  {
                    lat: b.getNorthEast()!.lat(),
                    lng: b.getSouthWest()!.lng(),
                  },
                  {
                    lat: b.getNorthEast()!.lat(),
                    lng: b.getNorthEast()!.lng(),
                  },
                  {
                    lat: b.getSouthWest()!.lat(),
                    lng: b.getNorthEast()!.lng(),
                  },
                  {
                    lat: b.getSouthWest()!.lat(),
                    lng: b.getSouthWest()!.lng(),
                  },
                ];
                const s = computeShapeData(p);
                setPolygonPath(s.path);
                setFarm(s);
              });
            }}
            options={{
              drawingControl: false, // Always hide the drawing controls

              polygonOptions: {
                fillOpacity: 0.2,
                strokeWeight: 2,
                editable: true,
                draggable: false,
              },
              rectangleOptions: {
                fillOpacity: 0.2,
                strokeWeight: 2,
                editable: true,
                draggable: false,
              },
            }}
          />

          {/* Show polygon from state too (optional; DrawingManager will render its own) */}
          {polygonPath.length > 0 && (
            <Polygon
              paths={polygonPath}
              options={{
                fillOpacity: 0.12,
                strokeWeight: 2,
                editable: true,
                draggable: false,
              }}
              key={polygonPath.length + 1}
              onMouseUp={(e) => {
                // when user finishes dragging a vertex
                if (!e || !e.latLng) return;
                // sync via paths prop changes if needed
              }}
            />
          )}
        </GoogleMap>
      </div>

      <div className="flex justify-end gap-3">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleOnSave} disabled={!farm}>
          Save
        </Button>
      </div>
    </>
  );
}

{
  /* <aside
        style={{
          padding: 12,
          border: "1px solid #eee",
          borderRadius: 8,
          overflow: "scroll",
          height: "200px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Selected Farm</h3>
        {!farm ? (
          <p>Use the polygon or rectangle tool to draw your farm.</p>
        ) : (
          <>
            <p>
              <strong>Area:</strong> {(farm.areaSqMeters / 10_000).toFixed(2)}{" "}
              ha &nbsp;(
              {farm.areaSqMeters.toFixed(0)} m²)
            </p>
            <p>
              <strong>Perimeter:</strong>{" "}
              {(farm.perimeterMeters / 1000).toFixed(3)} km
            </p>
            <p>
              <strong>Centroid:</strong> {farm.centroid.lat.toFixed(6)},{" "}
              {farm.centroid.lng.toFixed(6)}
            </p>
            <p>
              <strong>Bounds:</strong> N {farm.bounds.north.toFixed(6)} · S{" "}
              {farm.bounds.south.toFixed(6)} · E {farm.bounds.east.toFixed(6)} ·
              W {farm.bounds.west.toFixed(6)}
            </p>
            <details>
              <summary>
                <strong>Path (coordinates)</strong>
              </summary>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(farm.path, null, 2)}
              </pre>
            </details>
          </>
        )}
        <hr />
        <button
          onClick={() => {
            setPolygonPath([]);
            setFarm(null);
            // page reload also clears any shapes DrawingManager added
            location.reload();
          }}
        >
          Clear
        </button>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => {
            if (!farm) return;

            localStorage.setItem(
              "farm-geojson",
              JSON.stringify({
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [
                    farm.path
                      .map((p) => [p.lng, p.lat])
                      .concat([[farm.path[0].lng, farm.path[0].lat]]),
                  ], // closed ring
                },
                properties: {},
              })
            );

            // Example: send to your API
            // fetch("/api/farm", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({
            //     coordinates: farm.path, // [{lat, lng}, ...]
            //     areaSqMeters: farm.areaSqMeters, // number
            //     perimeterMeters: farm.perimeterMeters,
            //     centroid: farm.centroid,
            //     bounds: farm.bounds,
            //     // optional: also store as GeoJSON polygon
            //     geojson: {
            //       type: "Feature",
            //       geometry: {
            //         type: "Polygon",
            //         coordinates: [farm.path.map((p) => [p.lng, p.lat])],
            //       },
            //       properties: {},
            //     },
            //   }),
            // });
          }}
        >
          Save
        </button>
      </aside> */
}
