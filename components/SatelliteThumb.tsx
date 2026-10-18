"use client";

import { useMemo } from "react";
import { ESRI_TILE, TILE_SIZE, lngLatToTile } from "@/lib/geo";

interface Props {
  lat: number;
  lng: number;
  /** Zoom level of the tiles used as imagery. */
  zoom: number;
  /** Number of tiles per side to render. Odd numbers centre exactly. */
  grid?: number;
  className?: string;
  alt?: string;
}

/**
 * Renders a cropped satellite view of a point by tiling Esri World Imagery.
 *
 * Every project's hero image on this map is a real aerial view of its own site,
 * so there is no placeholder art to replace.
 */
export default function SatelliteThumb({ lat, lng, zoom, grid = 3, className, alt }: Props) {
  const tiles = useMemo(() => {
    const { x, y } = lngLatToTile(lng, lat, zoom);
    const startX = Math.floor(x) - (grid >> 1);
    const startY = Math.floor(y) - (grid >> 1);

    const out: { key: string; url: string; left: number; top: number }[] = [];
    for (let dy = 0; dy < grid; dy++) {
      for (let dx = 0; dx < grid; dx++) {
        const tx = startX + dx;
        const ty = startY + dy;
        if (ty < 0 || ty >= 2 ** zoom) continue;
        out.push({
          key: `${tx}/${ty}`,
          url: ESRI_TILE.replace("{z}", String(zoom))
            .replace("{y}", String(ty))
            .replace("{x}", String(tx)),
          left: dx * TILE_SIZE,
          top: dy * TILE_SIZE,
        });
      }
    }
    return out;
  }, [lat, lng, zoom, grid]);

  const total = grid * TILE_SIZE;
  const point = lngLatToTile(lng, lat, zoom);
  const offsetX = (point.x - Math.floor(point.x) - 0.5) * TILE_SIZE;
  const offsetY = (point.y - Math.floor(point.y) - 0.5) * TILE_SIZE;

  return (
    <div className={`sat-thumb ${className ?? ""}`} role="img" aria-label={alt ?? ""}>
      <div className="sat-inner" style={{ width: total, height: total, left: `calc(50% - ${offsetX}px)`, top: `calc(50% - ${offsetY}px)` }}>
        {tiles.map((t) => (
          <img key={t.key} src={t.url} alt="" draggable={false} style={{ left: t.left, top: t.top }} />
        ))}
      </div>
    </div>
  );
}
