"use client";

import { type ReactNode, useEffect, useRef } from "react";

/** Vertical scroll moves a pinned strip of editorial panels across the viewport. */
export default function HorizontalSequence({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const stage = root.current, strip = track.current;
      if (!stage || !strip) return;
      if (motion.matches) { stage.style.height = "auto"; strip.style.transform = "none"; return; }
      const distance = Math.max(0, strip.scrollWidth - innerWidth);
      const travel = distance * 1.15;
      stage.style.height = `${innerHeight + travel}px`;
      const top = stage.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, -top / Math.max(1, travel)));
      strip.style.transform = `translate3d(${-progress * distance}px,0,0)`;
      stage.style.setProperty("--horizontal-progress", String(progress));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    if (track.current) resize.observe(track.current);
    addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", schedule); motion.addEventListener("change", schedule); update();
    return () => { removeEventListener("scroll", schedule); removeEventListener("resize", schedule); motion.removeEventListener("change", schedule); resize.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <div className="lower-horizontal" ref={root} id="horizontal-tour"><div className="lower-horizontal-screen"><div className="lower-horizontal-track" ref={track}>{children}</div><div className="horizontal-progress" aria-hidden="true"><span /></div></div></div>;
}
