"use client";

import { useEffect, useRef } from "react";
import { Blossom } from "./Brand";

/** The aperture reveals the actual hero underneath, so its image never jumps. */
export default function EntryReveal({ onComplete }: { onComplete: () => void }) {
  const mask = useRef<SVGPathElement>(null);
  const contours = useRef<SVGGElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) { onComplete(); return; }
    const previousOverflow = document.body.style.overflow;
    const previousScroll = document.documentElement.style.scrollBehavior;
    document.body.style.overflow = "hidden";
    document.documentElement.style.scrollBehavior = "auto";
    if (!location.hash) window.scrollTo(0, 0);
    document.documentElement.classList.add("estate-is-entering");
    let frame = 0, start = 0, finished = false;
    const out = (p: number) => 1 - Math.pow(1 - p, 4);
    const inOut = (p: number) => p < .5 ? 8 * p ** 4 : 1 - (-2 * p + 2) ** 4 / 2;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const arch = (x: number, y: number, width: number, bottom: number) => {
      const r = width / 2;
      return `M${x},${bottom}V${y + r}A${r},${r} 0 0 1 ${x + width},${y + r}V${bottom}Z`;
    };
    const restore = () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollBehavior = previousScroll;
      document.documentElement.classList.remove("estate-is-entering");
    };
    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start, w = window.innerWidth, h = window.innerHeight;
      const rise = out(clamp((elapsed - 600) / 1300));
      const expand = inOut(clamp((elapsed - 1900) / 1200));
      const width = w * (.47 + expand * 1.93);
      const top = h * (1.12 - rise * 1.0 - expand * 2.3);
      const x = (w - width) / 2;
      const hole = arch(x, top, width, h * 3);
      svg.current?.setAttribute("viewBox", `0 0 ${w} ${h}`);
      mask.current?.setAttribute("d", `M0,0H${w}V${h}H0Z${hole}`);
      const lines = contours.current?.children;
      [12, 26].forEach((gap, index) => lines?.[index]?.setAttribute("d", arch(x - gap, top - gap, width + gap * 2, h * 3)));
      if (contours.current) contours.current.style.opacity = String(1 - expand);
      if (elapsed >= 3350) { finished = true; restore(); onComplete(); }
      else frame = requestAnimationFrame(tick);
    };
    const reduce = () => { if (motion.matches && !finished) { cancelAnimationFrame(frame); finished = true; restore(); onComplete(); } };
    frame = requestAnimationFrame(tick);
    motion.addEventListener("change", reduce);
    return () => { cancelAnimationFrame(frame); motion.removeEventListener("change", reduce); restore(); };
  }, [onComplete]);
  return <div className="estate-entry" aria-hidden="true">
    <svg ref={svg} className="entry-aperture" viewBox="0 0 100 100" preserveAspectRatio="none"><path ref={mask} d="M0 0H100V100H0Z" fillRule="evenodd" /><g ref={contours} className="entry-contours"><path /><path /></g></svg>
    <div className="entry-watermark"><Blossom /></div>
    <svg className="entry-frame" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M40 0H960L1000 40V960L960 1000H40L0 960V40Z" vectorEffect="non-scaling-stroke" /></svg>
  </div>;
}
