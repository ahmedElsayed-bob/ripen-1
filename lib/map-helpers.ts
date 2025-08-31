type LngLat = { lat: number; lng: number };

export function polygonCentroid(coords: LngLat[]): LngLat {
  if (coords.length < 3) {
    // Fallback: average the points

    const lat = coords.reduce((s, p) => s + p.lat, 0) / coords.length;
    const lng = coords.reduce((s, p) => s + p.lng, 0) / coords.length;
    return { lat, lng };
  }

  // Drop duplicate closing vertex if present
  const pts =
    coords[0].lat === coords[coords.length - 1].lat &&
    coords[0].lng === coords[coords.length - 1].lng
      ? coords.slice(0, -1)
      : coords;

  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0, n = pts.length; i < n; i++) {
    const { lng: x0, lat: y0 } = pts[i];
    const { lng: x1, lat: y1 } = pts[(i + 1) % n];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }

  area *= 0.5;
  if (Math.abs(area) < 1e-12) {
    // Degenerate polygon: fallback to average
    const lat = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
    const lng = pts.reduce((s, p) => s + p.lng, 0) / pts.length;
    return { lat, lng };
  }

  return { lat: cy / (6 * area), lng: cx / (6 * area) };
}

export function polygonBoundsCenter(coords: LngLat[]): LngLat {
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;
  for (const { lat, lng } of coords) {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }
  return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
}

export function generateGrid(
  coords: LngLat[],
  cellSizeDeg = 0.0003 // ~30m depending on latitude
) {
  // Remove duplicate last coord if present
  const pts =
    coords[0].lat === coords[coords.length - 1].lat &&
    coords[0].lng === coords[coords.length - 1].lng
      ? coords.slice(0, -1)
      : coords;

  // Get bounds
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;
  for (const p of pts) {
    minLat = Math.min(minLat, p.lat);
    maxLat = Math.max(maxLat, p.lat);
    minLng = Math.min(minLng, p.lng);
    maxLng = Math.max(maxLng, p.lng);
  }

  const polygon = new google.maps.Polygon({
    paths: pts.map((p) => new google.maps.LatLng(p.lat, p.lng)),
  });

  const grid: any[] = [];
  let row = 0;

  for (let lat = minLat; lat < maxLat; lat += cellSizeDeg) {
    let col = 0;
    for (let lng = minLng; lng < maxLng; lng += cellSizeDeg) {
      const square = [
        { lat, lng },
        { lat: lat + cellSizeDeg, lng },
        { lat: lat + cellSizeDeg, lng: lng + cellSizeDeg },
        { lat, lng: lng + cellSizeDeg },
        { lat, lng },
      ];

      // Check if square center is inside polygon
      const center = new google.maps.LatLng(
        lat + cellSizeDeg / 2,
        lng + cellSizeDeg / 2
      );
      if (google.maps.geometry.poly.containsLocation(center, polygon)) {
        grid.push({
          id: `${String.fromCharCode(65 + row)}${col + 1}`, // A1, A2...
          coords: square,
          name: `${String.fromCharCode(65 + row)}${col + 1}`,
        });
      }
      col++;
    }
    row++;
  }

  return grid;
}

export function isPointInsidePolygon(coords: LngLat[], point: LngLat): boolean {
  const pts =
    coords[0].lat === coords[coords.length - 1].lat &&
    coords[0].lng === coords[coords.length - 1].lng
      ? coords.slice(0, -1)
      : coords;

  const polygon = new google.maps.Polygon({
    paths: pts.map((p) => new google.maps.LatLng(p.lat, p.lng)),
  });

  const testPoint = new google.maps.LatLng(point.lat, point.lng);
  return google.maps.geometry.poly.containsLocation(testPoint, polygon);
}
