/**
 * Web-Mercator helpers. Used both for the map camera and for the
 * satellite thumbnails used as project hero images.
 */

/** Attribution required by the Esri/Maxar basemap — keep it visible. */
export const ESRI_ATTRIBUTION =
  'Imagery &copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a>, Maxar, Earthstar Geographics';

export const ESRI_TILE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export const EARTH_RADIUS_KM = 6371;

const TILE = 256;

/** Fractional tile coordinates for a lng/lat at a zoom level. */
export function lngLatToTile(lng: number, lat: number, zoom: number) {
  const n = 2 ** zoom;
  const xt = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const yt = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x: xt, y: yt };
}

/** Destination point given a start, a bearing (deg, 0 = north) and a distance. */
export function offsetCoord(lng: number, lat: number, bearingDeg: number, distKm: number): [number, number] {
  const br = (bearingDeg * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  // Angular distance in radians, converted back to degrees.
  const d = (distKm / EARTH_RADIUS_KM) * (180 / Math.PI);
  const dLat = d * Math.cos(br);
  const dLng = d * (Math.sin(br) / Math.cos(latRad));
  return [lng + dLng, lat + dLat];
}

/**
 * A GeoJSON polygon approximating a circle of `radiusKm`, wound so that the
 * interior is on the left (matching the MapLibre fill winding rule).
 */
export function circlePolygon(lng: number, lat: number, radiusKm: number, steps = 96) {
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const bearing = (i / steps) * 360;
    ring.push(offsetCoord(lng, lat, bearing, radiusKm));
  }
  ring.push(ring[0]);
  return {
    type: "Feature" as const,
    properties: { radiusKm },
    geometry: { type: "Polygon" as const, coordinates: [ring] },
  };
}

export function pointFeature(lng: number, lat: number, props: Record<string, unknown>) {
  return {
    type: "Feature" as const,
    properties: props,
    geometry: { type: "Point" as const, coordinates: [lng, lat] },
  };
}

export function featureCollection(features: unknown[]) {
  return { type: "FeatureCollection" as const, features };
}

/** Human label for a distance ring, e.g. 1 -> "1 KM", 0.5 -> "500 M". */
export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} M`;
  return `${km % 1 === 0 ? km : km.toFixed(1)} KM`;
}

export function distanceKm(a: [number, number], b: [number, number]) {
  const R = EARTH_RADIUS_KM;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export { TILE_SIZE };
const TILE_SIZE = TILE;
