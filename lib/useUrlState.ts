import { useEffect } from "react";
import type { Lang, Theme } from "./types";

export function readUrlState(): { lang: Lang; theme: Theme } {
  const p = new URLSearchParams(window.location.search);
  return {
    lang: p.get("lang") === "ar" ? "ar" : "en",
    theme: p.get("theme") === "dark" ? "dark" : "light",
  };
}

/** Keeps ?lang=&theme= in the address bar and applies lang/dir to <html>. */
export function useSyncUrlAndHtml(lang: Lang, theme: Theme, ready = true, selectedId: string | null = null, landmarkId: string | null = null, poiId: string | null = null) {
  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    if (selectedId) url.searchParams.set("project", selectedId);
    else url.searchParams.delete("project");
    if(landmarkId)url.searchParams.set("landmark",landmarkId);
    else url.searchParams.delete("landmark");
    if(poiId)url.searchParams.set("poi",poiId);else url.searchParams.delete("poi");
    url.searchParams.set("lang", lang);
    url.searchParams.set("theme", theme);
    window.history.replaceState(null, "", url.toString());
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.theme = theme;
  }, [lang, theme, ready, selectedId, landmarkId, poiId]);
}
