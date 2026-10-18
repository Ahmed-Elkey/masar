"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DEFAULT_VIEW, LANDMARKS, MAX_ZOOM, MIN_ZOOM, RING_KM, RING_LABEL_BEARINGS } from "@/lib/data";
import { circlePolygon, ESRI_ATTRIBUTION, ESRI_TILE, formatDistance, offsetCoord } from "@/lib/geo";
import ProjectWordmark from "./ProjectWordmark";
import { projectMedia, previewSrc } from "./ProjectImage";
import MapHoverPreview from "./MapHoverPreview";
import LandmarkIcon from "./LandmarkIcon";
import RouteSummary from "./RouteSummary";
import type { RouteState } from "@/lib/routing";
import { pointOnRoute,routeDistances } from "@/lib/routing";
import { roadLayers, ROAD_LAYER_IDS } from "@/lib/mapLayers";
import type { LayerId, Lang, Poi, Project, Theme } from "@/lib/types";

interface Slot {
  key: string;
  el: HTMLDivElement;
  kind: "project" | "poi" | "landmark";
  id: string;
}

/** Scales the per-project leader offsets so the pill clears its anchor dot. */
const LEADER_SCALE = 1.55;

/** Projects closer than this on screen share one pill, so labels cannot overlap. */
const CLUSTER_RADIUS = 100;

/** Cloud start spots as viewport fractions, plus drift in px/s. */
const CLOUD_SPOTS = [
  { fx: 0.18, fy: 0.1, drift: 5.2 },
  { fx: 0.72, fy: 0.02, drift: 3.9 },
  { fx: 0.3, fy: 0.88, drift: 6.4 },
  { fx: 0.85, fy: 0.95, drift: 4.6 },
];
/** Past this zoom every project keeps its own pill, however close the anchors are. */
const CLUSTER_MAX_ZOOM = 12.6;
/** Landmark bubbles shrink on the regional overview to keep cluster pills clear. */
const FAR_ZOOM = 10.3;

function leader(dx: number, dy: number) {
  const x = dx * LEADER_SCALE;
  const y = dy * LEADER_SCALE;
  const len = Math.hypot(x, y);
  const deg = (Math.atan2(y, x) * 180) / Math.PI;
  return { width: len, transform: `rotate(${deg}deg)`, x, y };
}

const EMPTY = { type: "FeatureCollection" as const, features: [] };

/** Which POI category each layer button reveals. */
const POI_LAYER_CATEGORY: Partial<Record<LayerId, Poi["category"]>> = {
  school: "school",
  health: "health",
  shopping: "mall",
  transit: "transit",
};

interface Props {
  projects: Project[];
  pois: Poi[];
  lang: Lang;
  theme: Theme;
  /** All active layers. Several can be on at once; `projects` is always on. */
  layers: LayerId[];
  selectedId: string | null;
  selectedPoiId: string | null;
  /** Project filters from the drawer; when active, non-matching markers fade. */
  filterActive: boolean;
  matchedIds: Set<string>;
  route: RouteState;
  onSelectProject: (id: string) => void;
  onSelectPoi: (id: string) => void;
  onReady: (map: maplibregl.Map) => void;
}

export default function MapCanvas({
  projects,
  pois,
  lang,
  theme,
  layers,
  selectedId,
  selectedPoiId,
  filterActive,
  matchedIds,
  route,
  onSelectProject,
  onSelectPoi,
  onReady,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const ringLabels = useRef<maplibregl.Marker[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [routeLabel,setRouteLabel]=useState<HTMLDivElement|null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [groups, setGroups] = useState<{ key: string; ids: string[]; leader: string }[]>([]);
  const [hovered,setHovered]=useState<{kind:Slot['kind']|'cluster';id:string}|null>(null);
  const clearHover=useCallback(()=>setHovered(null),[]);
  const pressTimer=useRef<number|null>(null);
  const suppressClick=useRef(false);
  const clearPress=useCallback(()=>{if(pressTimer.current!==null){window.clearTimeout(pressTimer.current);pressTimer.current=null;}},[]);
  // A long press opens the same preview that mouse hover shows, without
  // selecting the project on release.
  const previewEvents=(kind:Slot['kind'],id:string)=>({
    onPointerEnter:(event:React.PointerEvent)=>{if(event.pointerType==='mouse')setHovered({kind,id});},
    onPointerLeave:()=>{clearPress();clearHover();},
    onPointerDown:(event:React.PointerEvent)=>{
      clearPress();clearHover();
      if(event.pointerType==='mouse')return;
      suppressClick.current=false;
      pressTimer.current=window.setTimeout(()=>{suppressClick.current=true;setHovered({kind,id});},450);
    },
    onPointerUp:clearPress,
    onPointerCancel:clearPress,
    onContextMenu:(event:React.MouseEvent)=>event.preventDefault(),
    onFocus:(event:React.FocusEvent<HTMLElement>)=>{if(event.currentTarget.matches(':focus-visible'))setHovered({kind,id});},
    onBlur:()=>{clearPress();clearHover();},
    'aria-describedby':hovered?.kind===kind&&hovered.id===id?'map-hover-preview':undefined,
  });
  useEffect(()=>{clearHover();},[selectedId,selectedPoiId,layers,lang,clearHover]);
  useEffect(()=>()=>clearPress(),[clearPress]);
  useEffect(()=>{
    if(!hovered)return;
    const dismiss=(event:PointerEvent)=>{if(event.pointerType!=='mouse')clearHover();};
    window.addEventListener('pointerdown',dismiss);
    return()=>window.removeEventListener('pointerdown',dismiss);
  },[hovered,clearHover]);
  useEffect(()=>{
    const map=mapRef.current;if(!map||!loaded)return;
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&hovered){event.preventDefault();event.stopImmediatePropagation();clearHover();}};
    const onMove=()=>{clearPress();clearHover();};
    map.on('movestart',onMove);window.addEventListener('keydown',escape,true);
    return()=>{map.off('movestart',onMove);window.removeEventListener('keydown',escape,true);};
  },[loaded,clearHover,clearPress,hovered]);

  // Warm the preview images in the background so hover and long-press show
  // the photo immediately instead of starting a network request.
  useEffect(()=>{
    if(!loaded)return;
    const connection=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection;
    if(connection?.saveData)return;
    const urls=projects.map(project=>projectMedia(project).images[0]?.src).filter((src):src is string=>Boolean(src)).map(previewSrc);
    if(!urls.length)return;
    let cancelled=false;
    const start=()=>{if(!cancelled)urls.forEach(src=>{const image=new Image();image.decoding="async";image.src=src;});};
    const idle=window.requestIdleCallback?.(start,{timeout:2500});
    const fallback=idle===undefined?window.setTimeout(start,1500):undefined;
    return()=>{cancelled=true;if(idle!==undefined)window.cancelIdleCallback?.(idle);if(fallback!==undefined)window.clearTimeout(fallback);};
  },[loaded,projects]);

  const visibleIds = useMemo(() => new Set(projects.map(p => p.id)), [projects]);
  const [mapError, setMapError] = useState(false);
  const [roadsFallback, setRoadsFallback] = useState(false);
  const [layerError, setLayerError] = useState<string|null>(null);
  const [baseError, setBaseError] = useState(false);
  const satFailures = useRef(0);
  const retryPending = useRef(false);

  /** Every POI layer that is switched on contributes its own category. */
  const activePois = useMemo(() => {
    const cats = new Set(
      layers.map((l) => POI_LAYER_CATEGORY[l]).filter((c): c is Poi["category"] => Boolean(c)),
    );
    return cats.size ? pois.filter((p) => cats.has(p.category)) : [];
  }, [pois, layers]);

  /* ---------- map bootstrap ---------- */
  useEffect(() => {
    if (!container.current) return;
    setLoaded(false);

    let map: maplibregl.Map;
    try { map = new maplibregl.Map({
      container: container.current,
      style: {
        version: 8,
        glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
        sources: {
          streets: {type:"vector", url:"https://tiles.openfreemap.org/planet", attribution:'&copy; <a href="https://openfreemap.org/" target="_blank" rel="noreferrer">OpenFreeMap</a> / OpenStreetMap contributors'},
          roads: { type: "raster", tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"], tileSize: 256, maxzoom: 19, attribution: "Transportation &copy; Esri" },
          rail: { type: "raster", tiles: ["https://a.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"], tileSize: 256, maxzoom: 19, attribution: '&copy; <a href="https://www.openrailwaymap.org/" target="_blank" rel="noreferrer">OpenRailwayMap</a> / OpenStreetMap contributors' },
          sat: {
            type: "raster",
            tiles: [ESRI_TILE],
            tileSize: 256,
            maxzoom: 19,
            attribution: ESRI_ATTRIBUTION,
          },
        },
        layers: [
          { id: "bg", type: "background", paint: { "background-color": "#0a0a0a" } },
          { id: "sat", type: "raster", source: "sat" },
          { id: "roads", type: "raster", source: "roads", layout: {visibility: "none"} },
          { id: "rail", type: "raster", source: "rail", layout: {visibility: "none"} },
          ...roadLayers(),
        ],
      },
      center: DEFAULT_VIEW.center,
      zoom: DEFAULT_VIEW.zoom - (window.innerWidth <= 900 ? 0.8 : 0),
      pitch: DEFAULT_VIEW.pitch,
      bearing: DEFAULT_VIEW.bearing,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      attributionControl: false,
    });

    } catch { setMapError(true); return; }
    map.on("error", (event) => {
      const sourceId = (event as unknown as {sourceId?: string}).sourceId;
      if (sourceId === "streets") setRoadsFallback(true);
      if (sourceId === "roads" || sourceId === "rail") setLayerError(sourceId);
      // A single missing tile is normal at some coordinates; only surface the
      // banner after repeated failures so one bad tile cannot hide the map.
      if (sourceId === "sat" && ++satFailures.current >= 3) setBaseError(true);
    });
    map.on("sourcedata", (event) => {
      if (event.sourceId !== "sat" || !retryPending.current) return;
      retryPending.current = false;
      setBaseError(false);
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    const markers: maplibregl.Marker[] = [];
    const next: Slot[] = [];
    const add = (kind: Slot["kind"], id: string, lng: number, lat: number) => {
      const el = document.createElement("div");
      el.className = "mk-anchor";
      markers.push(
        new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([lng, lat]).addTo(map),
      );
      el.setAttribute("role", "presentation");
      el.removeAttribute("aria-label");
      next.push({ key: `${kind}-${id}`, el, kind, id });
    };

    // Every project and POI gets a marker up front; the render pass below
    // decides what each one actually shows.
    projects.forEach((p) => add("project", p.id, p.lng, p.lat));
    pois.forEach((p) => add("poi", p.id, p.lng, p.lat));
    LANDMARKS.forEach((p) => add("landmark", p.id, p.lng, p.lat));
    setSlots(next);

    map.on("load", () => {
      map.addSource("rings", { type: "geojson", data: EMPTY });
      map.addLayer({
        id: "ring-fill",
        type: "fill",
        source: "rings",
        paint: { "fill-color": "#ffffff", "fill-opacity": 0 },
      });
      // A dark halo under the white stroke keeps the rings legible over bright
      // desert imagery, which a plain white line washes out on.
      map.addLayer({
        id: "ring-halo",
        type: "line",
        source: "rings",
        paint: { "line-color": "rgba(0,0,0,0.35)", "line-width": 5 },
      });
      map.addLayer({
        id: "ring-line",
        type: "line",
        source: "rings",
        paint: { "line-color": "#ffffff", "line-width": 2.2, "line-opacity": 0.95 },
      });
      map.addSource("driving-route", {type:"geojson",data:EMPTY});
      map.addLayer({id:"driving-route-halo",type:"line",source:"driving-route",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#ffffff","line-width":8,"line-opacity":.15}});
      map.addLayer({id:"driving-route-line",type:"line",source:"driving-route",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#ffffff","line-width":5.5}});
      setLoaded(true);
    });

    mapRef.current = map;
    onReady(map);

    return () => {
      markers.forEach((m) => m.remove());
      ringLabels.current.forEach((m) => m.remove());
      ringLabels.current = [];
      map.remove();
      mapRef.current = null;
      setSlots([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- nearby projects share a pill once their labels would collide ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    let frame = 0;

    const compute = () => {
      frame = 0;
      const zoom = map.getZoom();
      map.getContainer().classList.toggle("is-far", zoom < FAR_ZOOM);
      if (zoom > CLUSTER_MAX_ZOOM) {
        setGroups((prev) => (prev.length ? [] : prev));
        return;
      }

      // The selected project always keeps its own pill; it may sit among a group.
      const selectedProject = projects.find((p) => p.id === selectedId);
      const selectedPoint = selectedProject ? map.project([selectedProject.lng, selectedProject.lat]) : null;
      const points = projects
        .filter((p) => p.id !== selectedId)
        .map((p) => ({ id: p.id, ...map.project([p.lng, p.lat]) }));

      // Connected components within CLUSTER_RADIUS: one chain per built-up area.
      const parent = points.map((_, index) => index);
      const find = (index: number): number => {
        while (parent[index] !== index) {
          parent[index] = parent[parent[index]];
          index = parent[index];
        }
        return index;
      };
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          if (Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) <= CLUSTER_RADIUS) {
            parent[find(i)] = find(j);
          }
        }
      }

      const buckets = new Map<number, string[]>();
      points.forEach((point, index) => {
        const root = find(index);
        const ids = buckets.get(root);
        if (ids) ids.push(point.id);
        else buckets.set(root, [point.id]);
      });

      const next = [...buckets.values()]
        .filter((ids) => ids.length > 1)
        .map((ids) => {
          // Anchor the pill on a member so the label sits over the built-up area
          // instead of its edge, and away from the selected project's own label.
          const members = ids.map((id) => points.find((point) => point.id === id)!);
          const cx = members.reduce((sum, point) => sum + point.x, 0) / members.length;
          const cy = members.reduce((sum, point) => sum + point.y, 0) / members.length;
          const score = (point: { x: number; y: number }) =>
            selectedPoint
              ? Math.hypot(point.x - selectedPoint.x, point.y - selectedPoint.y)
              : -Math.hypot(point.x - cx, point.y - cy);
          let leader = ids[0];
          let best = -Infinity;
          members.forEach((point) => {
            const value = score(point);
            if (value > best) {
              best = value;
              leader = point.id;
            }
          });
          return { key: ids.join("+"), ids, leader };
        });
      setGroups((prev) =>
        prev.length === next.length && prev.every((group, index) => group.key === next[index].key)
          ? prev
          : next,
      );
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    map.on("move", schedule);
    map.on("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      map.off("move", schedule);
      map.off("resize", schedule);
    };
  }, [loaded, projects, selectedId]);

  /* ---------- clouds belong to the map, not the screen ---------- */
  useEffect(() => {
    const map = mapRef.current;
    const layer = atmosphereRef.current;
    if (!map || !layer) return;
    const nodes = Array.from(layer.children) as HTMLElement[];
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionPreference.matches;
    const box = map.getContainer();
    const getAnchors = () => CLOUD_SPOTS.map((spot) => map.unproject([spot.fx * box.clientWidth, spot.fy * box.clientHeight]));
    let anchors = getAnchors();
    const start = performance.now();
    const wrap = (value: number, period: number) => ((value % period) + period) % period;
    let frame = 0;
    let resizeFrame = 0;

    const draw = () => {
      frame = 0;
      if (document.hidden) return;
      const w = box.clientWidth;
      const h = box.clientHeight;
      const elapsed = reduced ? 0 : (performance.now() - start) / 1000;
      nodes.forEach((node, index) => {
        const spot = CLOUD_SPOTS[index % CLOUD_SPOTS.length];
        const point = map.project(anchors[index % anchors.length]);
        const cw = node.offsetWidth;
        const ch = node.offsetHeight;
        const x = wrap(point.x + elapsed * spot.drift + cw / 2, w + cw) - cw;
        const y = wrap(point.y + ch / 2, h + ch) - ch;
        node.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      });
      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const resize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = requestAnimationFrame(() => {
          resizeFrame = 0;
          anchors = getAnchors();
          schedule();
        });
      });
    };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    };
    const motionChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      cancelAnimationFrame(frame);
      frame = 0;
      schedule();
    };

    map.on("move", schedule);
    map.on("resize", resize);
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(box);
    document.addEventListener("visibilitychange", visibility);
    motionPreference.addEventListener("change", motionChange);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      map.off("move", schedule);
      map.off("resize", resize);
      sizeObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      motionPreference.removeEventListener("change", motionChange);
    };
  }, [loaded]);

  /* ---------- distance rings follow the selection ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    ringLabels.current.forEach((m) => m.remove());
    ringLabels.current = [];

    const p = projects.find((x) => x.id === selectedId);
    const src = map.getSource("rings") as maplibregl.GeoJSONSource | undefined;

    if (!p || !src || !visibleIds.has(p.id)) {
      src?.setData(EMPTY);
      return;
    }

    src.setData({ type: "FeatureCollection", features: RING_KM.map((r) => circlePolygon(p.lng, p.lat, r)) });

    const labels: maplibregl.Marker[] = [];
    RING_KM.forEach((r) => {
      (RING_LABEL_BEARINGS[r] ?? [268]).forEach((bearing) => {
        const [lng, lat] = offsetCoord(p.lng, p.lat, bearing, r);
        const el = document.createElement("div");
        el.className = "ring-label";
        el.textContent = lang === "ar" ? `${r.toLocaleString("ar-EG")} كم` : formatDistance(r);
        labels.push(new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([lng, lat]).addTo(map));
        el.setAttribute("role", "presentation");
        el.removeAttribute("aria-label");
      });
    });
    ringLabels.current = labels;
  }, [selectedId, projects, visibleIds, loaded, lang]);

  /* The route is road geometry from OSRM, never a straight-line estimate. */
  useEffect(()=>{
    const map=mapRef.current,source=map?.getSource("driving-route") as maplibregl.GeoJSONSource|undefined;
    if(!map||!source)return;
    if(!route.data){source.setData(EMPTY);return;}
    const coords=route.data.geometry.coordinates;
    const cumulative=routeDistances(coords);
    const label=document.createElement("div");label.className="route-label-anchor";
    const labelMarker=new maplibregl.Marker({element:label,anchor:"center"}).setLngLat(pointOnRoute(coords,cumulative,.5).coordinate).addTo(map);
    label.setAttribute("role","presentation");label.removeAttribute("aria-label");setRouteLabel(label);
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame=0,start=performance.now();
    const draw=(now:number)=>{
      const progress=reduced?1:Math.min(1,(now-start)/900);
      const end=pointOnRoute(coords,cumulative,progress);
      source.setData({type:"Feature",properties:{},geometry:{type:"LineString",coordinates:progress===1?coords:[...coords.slice(0,end.index),end.coordinate]}});
      if(progress<1)frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);
    const rtl=lang==="ar";
    const project=projects.find(p=>p.id===selectedId);
    const labelOffset=project?leader(project.dx||45,project.dy||-55):{x:0};
    const leftClear=Math.max(160,140-labelOffset.x),rightClear=Math.max(160,labelOffset.x+140);
    const bounds=coords.reduce((bounds,coord)=>bounds.extend(coord),new maplibregl.LngLatBounds(coords[0],coords[0]));
    const fit=()=>{
      const narrow=window.innerWidth<=900;
      map.fitBounds(bounds,{maxZoom:14,pitch:40,bearing:0,duration:reduced?0:1000,padding:{top:110,bottom:narrow?Math.min(window.innerHeight*.64,window.innerHeight-200):100,left:narrow?Math.min(65,window.innerWidth*.12):(leftClear+(rtl?410:0)),right:narrow?Math.min(180,window.innerWidth*.32):(rightClear+(!rtl?410:0))}});
    };
    fit();map.on("resize",fit);
    return()=>{cancelAnimationFrame(frame);map.off("resize",fit);labelMarker.remove();setRouteLabel(null);};
  },[route.data,loaded,lang,selectedId,projects]);

  /* ---------- theme ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer("sat")) return;
    const overlay = layers.includes("roads") || layers.includes("transit");
    map.setPaintProperty("sat", "raster-brightness-max", overlay ? 0.65 : 1);
    map.setPaintProperty("sat", "raster-saturation", -0.05);
    map.setPaintProperty("sat", "raster-contrast", 0.05);
    map.setLayoutProperty("roads", "visibility", layers.includes("roads") && roadsFallback ? "visible" : "none");
    ROAD_LAYER_IDS.forEach(id=>map.setLayoutProperty(id,"visibility",layers.includes("roads")&&!roadsFallback?"visible":"none"));
    map.setLayoutProperty("rail", "visibility", layers.includes("transit") ? "visible" : "none");
    if(map.getLayer("driving-route-line")){
      map.setPaintProperty("driving-route-line","line-color",theme==="light"?"#ffffff":"#222222");
      map.setPaintProperty("driving-route-halo","line-color",theme==="light"?"#000000":"#ffffff");
    }
    if(map.getLayer("ring-line")){
      map.setPaintProperty("ring-line","line-color",theme==="dark"?"#161616":"#fff");
      map.setPaintProperty("ring-halo","line-opacity",theme==="dark"?0:.35);
    }
    setLayerError(null);
  }, [theme, loaded, layers, roadsFallback]);

  // Keep labels whose geographic anchors are visible clear of the viewport edges.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    let frame = 0;
    let disposed = false;
    const place = () => {
      frame = 0;
      const viewport = map.getContainer().getBoundingClientRect();
      for (const slot of slots.filter(item => item.kind === "project")) {
        const bubble = slot.el.querySelector<HTMLElement>(".project-bubble, .cluster-bubble");
        if (!bubble) continue;
        const project = projects.find(item => item.id === slot.id);
        if (!project) continue;
        const original = bubble.classList.contains("cluster-bubble") ? {x:0,y:0} : leader(project.dx || 45, project.dy || -55);
        bubble.style.left = `${original.x}px`;
        bubble.style.top = `${original.y}px`;
        const point = map.project([project.lng, project.lat]);
        let x = original.x, y = original.y;
        if (point.x >= 0 && point.x <= viewport.width && point.y >= 0 && point.y <= viewport.height) {
          const rect = bubble.getBoundingClientRect();
          const left = viewport.left + 50, right = viewport.right - 16;
          const top = viewport.top + 80, bottom = viewport.bottom - 90;
          x += Math.max(left - rect.left, Math.min(0, right - rect.right));
          y += Math.max(top - rect.top, Math.min(0, bottom - rect.bottom));
          bubble.style.left = `${x}px`;
          bubble.style.top = `${y}px`;
        }
        const line = slot.el.querySelector<HTMLElement>(".mk-line");
        if (line) {
          line.style.width = `${Math.hypot(x,y)}px`;
          line.style.transform = `rotate(${Math.atan2(y,x)*180/Math.PI}deg)`;
        }
      }
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(place); };
    schedule();
    map.on("move", schedule);
    map.on("resize", schedule);
    const observer = new ResizeObserver(schedule);
    slots.forEach(slot => {
      const bubble = slot.el.querySelector(".project-bubble, .cluster-bubble");
      if (bubble) observer.observe(bubble);
    });
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); map.off("move",schedule); map.off("resize",schedule); };
  }, [loaded, slots, groups, selectedId, projects, lang]);

  const handleProject = useCallback((id: string) => {
    if(suppressClick.current){suppressClick.current=false;return;}
    onSelectProject(id);
  }, [onSelectProject]);
  const handlePoi = useCallback((id: string) => {
    if(suppressClick.current){suppressClick.current=false;return;}
    onSelectPoi(id);
  }, [onSelectPoi]);
  const retrySat = useCallback(() => {
    const map = mapRef.current;
    const source = map?.getSource("sat");
    if (source && "setTiles" in source) (source as maplibregl.RasterTileSource).setTiles([ESRI_TILE]);
    satFailures.current = 0;
    retryPending.current = true;
  }, []);

  const groupedIds = useMemo(() => {
    const byId = new Map<string, { key: string; ids: string[]; leader: string }>();
    groups.forEach((group) => group.ids.forEach((id) => byId.set(id, group)));
    return byId;
  }, [groups]);

  const groupArea = useCallback((ids: string[]) => {
    const areas: string[] = [];
    ids.forEach((id) => {
      const area = projects.find((p) => p.id === id)?.area[lang];
      if (area && !areas.includes(area)) areas.push(area);
    });
    const englishAreas = new Set(ids.map(id => projects.find(p => p.id === id)?.area.en));
    if (englishAreas.size > 1) {
      if ([...englishAreas].every(area => area && ["Sheikh Zayed", "6th October"].includes(area))) {
        return lang === "ar" ? "غرب القاهرة" : "West Cairo";
      }
      if ([...englishAreas].every(area => area && ["New Capital", "New Cairo"].includes(area))) {
        return lang === "ar" ? "شرق القاهرة" : "East Cairo";
      }
      if ([...englishAreas].every(area => area && ["New Capital", "New Cairo", "Sheikh Zayed", "6th October"].includes(area))) {
        return lang === "ar" ? "القاهرة الكبرى" : "Greater Cairo";
      }
      if ([...englishAreas].every(area => area && ["El Gouna", "Soma Bay"].includes(area))) {
        return lang === "ar" ? "البحر الأحمر" : "Red Sea";
      }
    }
    return areas.join(lang === "ar" ? " و" : " & ");
  }, [projects, lang]);

  const zoomToGroup = useCallback((ids: string[]) => {
    const map = mapRef.current;
    if (!map) return;
    const members = new Set(ids);
    const bounds = new maplibregl.LngLatBounds();
    projects.forEach((p) => {
      if (members.has(p.id)) bounds.extend([p.lng, p.lat]);
    });
    const narrow = window.innerWidth <= 900;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.fitBounds(bounds, {
      maxZoom: 14,
      duration: reduced ? 0 : 900,
      padding: {
        top: 100,
        bottom: narrow && selectedId ? Math.min(window.innerHeight * 0.55, window.innerHeight - 220) : 90,
        left: narrow ? 55 : 90 + (selectedId && lang === "ar" ? 384 : 0),
        right: narrow ? 55 : 90 + (selectedId && lang === "en" ? 384 : 0),
      },
    });
  }, [projects, selectedId, lang]);

  return (
    <>
      <div ref={container} className={`map${hovered?` has-marker-hover hover-${hovered.kind}`:''}`} />
      {loaded && mapRef.current && createPortal(<div ref={atmosphereRef} className="map-atmosphere" aria-hidden="true">{[1,2,3,4].map(n => <div key={n} className={`map-cloud cloud-${n}`}/>)}</div>, mapRef.current.getContainer())}
      {hovered&&hovered.kind!=='cluster'&&createPortal(<MapHoverPreview lang={lang}
        project={hovered.kind==='project'?projects.find(p=>p.id===hovered.id):undefined}
        place={hovered.kind==='landmark'?LANDMARKS.find(p=>p.id===hovered.id):hovered.kind==='poi'?pois.find(p=>p.id===hovered.id):undefined}
        isLandmark={hovered.kind==='landmark'}/>,document.body)}
      {mapError ? <div className="map-error" role="alert"><p>{lang === "ar" ? "تعذر تحميل الخريطة. تحقق من الاتصال بالإنترنت ودعم WebGL." : "The map could not be loaded. Check your connection and WebGL support."}</p><button onClick={() => window.location.reload()}>{lang === "ar" ? "إعادة المحاولة" : "Reload"}</button></div> : null}
      {layerError || baseError ? <div className="layer-error" role="status">
        <span>{baseError
          ? (lang === "ar" ? "تعذر تحميل صور القمر الصناعي." : "Satellite imagery could not load.")
          : (lang === "ar" ? "تعذر تحميل طبقة الخريطة. حاول إيقافها وتشغيلها مرة أخرى." : "This map layer could not load. Toggle it off and on to retry.")}</span>
        {baseError && <button type="button" onClick={retrySat}>{lang === "ar" ? "إعادة المحاولة" : "Retry"}</button>}
      </div> : null}

      {routeLabel&&route.data&&createPortal(<RouteSummary route={route} lang={lang} compact/>,routeLabel)}
      {slots.map((s) => {
        /* ---------------- POI layer ---------------- */
        if (s.kind === "poi") {
          const poi = pois.find((x) => x.id === s.id)!;
          if (!activePois.some((x) => x.id === poi.id)) return null;
          const on = selectedPoiId === poi.id;
          return createPortal(
            <button
              className={`poi ${on ? "is-on" : ""}${hovered?.kind==='poi'&&hovered.id===poi.id?' is-hovered':''}`}
              {...previewEvents('poi',poi.id)}
              aria-label={poi.name[lang]}
              aria-pressed={on}
              onClick={() => handlePoi(poi.id)}
            >
              <span className="poi-icon">{poiGlyph(poi.category)}</span>
              <span className="poi-name">{poi.name[lang]}</span>

            </button>,
            s.el,
            s.key,
          );
        }

        if (s.kind === "landmark") {
          if (!layers.includes("landmarks")) return null;
          const landmark = LANDMARKS.find((x) => x.id === s.id)!;
          const l = leader(landmark.dx * .65, landmark.dy * .65);
          const on = selectedPoiId === `landmark:${landmark.id}`;
          return createPortal(
            <div className={`landmark-marker ${on ? "is-on" : ""}${hovered?.kind==='landmark'&&hovered.id===landmark.id?' is-hovered':''}`}>
              <span className="mk-line" style={{ width: l.width, transform: l.transform }} />
              <span className="mk-dot" />
              <button className="landmark-bubble" {...previewEvents('landmark',landmark.id)} style={{ left: l.x, top: l.y }} aria-label={landmark.name[lang]} aria-pressed={on} onClick={() => handlePoi(`landmark:${landmark.id}`)}>
                <LandmarkIcon name={landmark.icon} />
                {route.status==="idle"&&<span className="landmark-caption">{landmark.name[lang]}</span>}
              </button>
            </div>, s.el, s.key,
          );
        }

        const p = projects.find((x) => x.id === s.id)!;
        if (!visibleIds.has(p.id)) return null;
        const group = groupedIds.get(p.id);
        if (group) {
          if (group.leader !== p.id) return null;
          const area = groupArea(group.ids);
          const shownIds = filterActive ? group.ids.filter(id => matchedIds.has(id)) : group.ids;
          const hidden = filterActive && shownIds.length === 0;
          const listedIds = hidden ? group.ids : shownIds;
          return createPortal(
            <button
              className={`cluster-bubble${hidden ? " is-filtered-out" : ""}${hovered?.kind==='cluster'&&hovered.id===group.key?' is-hovered':''}`}
              title={projects.filter(project => listedIds.includes(project.id)).map(project => project.name[lang]).join(" • ")}
              aria-label={lang === "ar"
                ? `${area}، ${listedIds.length} مشاريع. اضغط للتقريب`
                : `${area}, ${listedIds.length} projects. Zoom in`}
              onPointerEnter={event=>{if(event.pointerType==='mouse')setHovered({kind:'cluster',id:group.key});}}
              onPointerLeave={clearHover}
              onPointerDown={clearHover}
              onFocus={event=>{if(event.currentTarget.matches(':focus-visible'))setHovered({kind:'cluster',id:group.key});}}
              onBlur={clearHover}
              onClick={() => zoomToGroup(group.ids)}
            >
              <span className="cluster-area">{area}</span>
              <span className="cluster-count">{listedIds.length.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}</span>
            </button>,
            s.el,
            s.key,
          );
        }
        const selected = selectedId === p.id;
        const faded = filterActive && !matchedIds.has(p.id) && !selected;
        const l = leader(p.dx || 45, p.dy || -55);
        return createPortal(
          <div className={`project-marker ${selected ? "is-selected" : ""}${faded ? " is-filtered-out" : ""}${hovered?.kind==='project'&&hovered.id===p.id?' is-hovered':''}`}>
            <span className="mk-line" style={{ width: l.width, transform: l.transform }} />
            <button className="project-bubble" {...previewEvents('project',p.id)} style={{ left: l.x, top: l.y }} aria-label={p.name[lang]} aria-pressed={selected} onClick={() => handleProject(p.id)}>
              <ProjectWordmark project={p} lang={lang}/>
            </button>
            <span className="mk-dot" />
          </div>, s.el, s.key,
        );
      })}
    </>
  );
}

/** Small inline glyph so POI markers need no icon-font dependency. */
function poiGlyph(category: Poi["category"]) {
  const d: Record<Poi["category"], string> = {
    health: "M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z",
    school: "M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5 M5 18h14",
    mall: "M5 8h14l-1 12H6L5 8z M9 8a3 3 0 0 1 6 0",
    transit: "M6 4h12v9H6z M6 13l-2 5 M18 13l2 5 M9 17h6 M6 9h12",
  };
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d={d[category]} />
    </svg>
  );
}
