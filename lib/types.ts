export type Lang = "en" | "ar";
export type Theme = "light" | "dark";

/** Delivery status of a project. Keys are translation ids, not display strings. */
export type StatusId = "underConstruction" | "ready" | "delivered";

export interface Project {
  id: string;
  name: { en: string; ar: string };
  developer: string;
  area: { en: string; ar: string };
  lng: number;
  lat: number;
  /** Screen-pixel offset of the pill from its map point (leader line length/direction). */
  dx: number;
  dy: number;
  status: StatusId;
  description: { en: string; ar: string };
  amenities: { en: string[]; ar: string[] };
  /** Satellite zoom used for this project's hero thumbnail. */
  heroZoom?: number;
  /** Whether a 360 tour exists — drives the grey/blue VR button state. */
  vr?: boolean;
  /** Optional path in /public, e.g. /logos/my-project.svg */
  logo?: string;
  url?: string;
  source?: string;
  /** Coordinates are the area centre rather than the exact site. */
  areaApprox?: boolean;
}

export interface Landmark {
  id: string;
  name: { en: string; ar: string };
  lng: number;
  lat: number;
  dx: number;
  dy: number;
  icon: string;
}

/** A non-project point of interest shown by one of the map layers. */
export type PoiCategory = "school" | "mall" | "transit" | "health";

export interface Poi {
  id: string;
  name: { en: string; ar: string };
  category: PoiCategory;
  /** University | International School | Metro | Light Rail | Airport | Mall */
  subtype: string;
  area: { en: string; ar: string };
  lat: number;
  lng: number;
  /** Curriculum / fee tier for schools, IATA code for airports. */
  note?: string;
  areaApprox?: boolean;
  source?: string;
}

/** Which of the six toolbar layers is active. */
export type LayerId = "landmarks" | "school" | "health" | "shopping" | "roads" | "transit";

/** Camera presets applied when the map settles. */
export interface ViewState {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}
