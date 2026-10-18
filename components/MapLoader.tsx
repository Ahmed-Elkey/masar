"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingScreen from "./LoadingScreen";

// MapLibre needs WebGL and the browser, so the map app is client-only.
const MapApp = dynamic(() => import("./MapApp"), { ssr: false, loading: () => null });

export default function MapLoader() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [arabic, setArabic] = useState(false);
  const started = useRef(0);
  const onMapReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    started.current = performance.now();
    setArabic(new URLSearchParams(location.search).get("lang") === "ar");
    // Reveal the app's own error state if a provider never finishes loading.
    const fallback = window.setTimeout(() => setVisible(false), 20000);
    return () => { clearTimeout(fallback); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    // Match the reference: the loader is removed immediately once the map is ready.
    const timer = window.setTimeout(() => setVisible(false), Math.max(0, 900 - (performance.now() - started.current)));
    return () => clearTimeout(timer);
  }, [ready]);
  return <><MapApp onMapReady={onMapReady} onMapProgress={setProgress} />{visible && <LoadingScreen progress={progress} arabic={arabic}/>}</>;
}
