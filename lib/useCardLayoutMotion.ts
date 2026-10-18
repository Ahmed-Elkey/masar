import { useLayoutEffect, useRef } from "react";

type Layout = { element: HTMLElement; rect: DOMRect; animation?: Animation };

/** Interpolate measured bounds so centered, docked and sheet layouts can transition. */
export function useCardLayoutMotion(layoutKey: string) {
  const previous = useRef(new Map<string, Layout>());
  useLayoutEffect(() => {
    const app = document.querySelector<HTMLElement>(".app");
    if (!app) return;
    const old = previous.current;
    const interrupted = new Map<string, DOMRect>();
    old.forEach((entry, key) => {
      if (entry.animation?.playState === "running") interrupted.set(key, entry.element.getBoundingClientRect());
      entry.animation?.cancel();
    });
    const card = app.querySelector<HTMLElement>(".card");
    if (card && window.innerWidth <= 900) app.style.setProperty("--project-sheet-height", `${card.offsetHeight}px`);
    const place = app.querySelector<HTMLElement>(".landmark-detail");
    if (place) app.style.setProperty("--place-card-height", `${place.offsetHeight}px`);
    const origin = app.getBoundingClientRect();
    const next = new Map<string, Layout>();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const selector of [".card", ".landmark-detail"]) {
      const element = app.querySelector<HTMLElement>(selector);
      if (!element) continue;
      const measured = element.getBoundingClientRect();
      // Entrance/exit slides use `translate`; store layout bounds independently
      // so an arriving route response cannot restart the sheet from offscreen.
      const translate = getComputedStyle(element).translate.split(/\s+/);
      const pixels = (value: string | undefined, size: number) => !value || value === "none" ? 0 : parseFloat(value) * (value.endsWith("%") ? size / 100 : 1);
      const rect = new DOMRect(measured.x - pixels(translate[0], measured.width), measured.y - pixels(translate[1], measured.height), measured.width, measured.height);
      const entry: Layout = { element, rect };
      next.set(selector, entry);
      const before = old.get(selector);
      if (reduced || !before || before.element !== element || element.classList.contains("is-exiting")) continue;
      const from = interrupted.get(selector) ?? before.rect;
      if (Math.abs(from.top - rect.top) < 1 && Math.abs(from.height - rect.height) < 1) continue;
      const frame = (bounds: DOMRect) => ({
        top: `${bounds.top - origin.top}px`, bottom: "auto", height: `${bounds.height}px`,
        maxHeight: "none", transform: "none",
      });
      entry.animation = element.animate([frame(from), frame(rect)], {
        duration: window.innerWidth <= 900 ? 300 : 500,
        easing: window.innerWidth <= 900 ? "linear" : "ease-in-out",
      });
    }
    previous.current = next;
  }, [layoutKey]);
  useLayoutEffect(() => () => {
    previous.current.forEach(entry => entry.animation?.cancel());
    previous.current.clear();
  }, []);
}
