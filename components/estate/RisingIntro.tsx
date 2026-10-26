"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";
import type { Lang } from "@/lib/types";
import { c } from "@/lib/estate";
import { Blossom } from "./Brand";

/** A pinned film with a scroll-linked disc, followed by the matching blue section. */
export default function RisingIntro({ children, lang }: { children: ReactNode; lang: Lang }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const id = `rise-${useId().replace(/:/g, "")}`;
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = wrapper.current?.closest<HTMLElement>(".estate-site");
    let frame = 0;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const smooth = (v: number) => v * v * (3 - 2 * v);
    const update = () => {
      frame = 0;
      const stage = wrapper.current, circle = disc.current;
      if (!stage || !circle) return;
      if (motion.matches) { if (root) delete root.dataset.skyHeader; return; }
      const rect = stage.getBoundingClientRect(), h = window.innerHeight, w = window.innerWidth;
      const distance = Math.max(1, rect.height - h);
      const p = clamp((-rect.top - h * .6) / Math.max(1, distance - h * .6));
      const expansion = smooth(clamp((p - .65) / .35));
      const fullSize = Math.hypot(w, h) * 2;
      const size = w * 1.06 + (fullSize - w * 1.06) * expansion;
      const riseTop = h * (1.14 - 1.5 * p ** 1.8);
      const top = riseTop * (1 - expansion) + (h / 2 - fullSize / 2) * expansion;
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
      circle.style.top = `${top}px`;
      circle.style.setProperty("--disc-size", `${size}px`);
      circle.style.setProperty("--disc-label-opacity", String(1 - smooth(clamp((p - .66) / .3))));
      stage.style.backgroundColor = p > .98 ? "#bdcfd8" : "#17233b";
      const pinnedTop = Math.min(0, rect.bottom - h);
      const centreY = pinnedTop + top + size / 2;
      const underDisc = (w / 2 - 65) ** 2 + (85 - centreY) ** 2 < (size / 2) ** 2;
      if (root) root.dataset.skyHeader = String(underDisc && rect.bottom > 85 && rect.top < 0);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    update();
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); motion.removeEventListener("change", schedule); cancelAnimationFrame(frame); if (root) delete root.dataset.skyHeader; };
  }, []);
  return <div className="hero-transition" ref={wrapper}><div className="hero-pinned">
    {children}
    <div className="hero-rise-disc" ref={disc} aria-hidden="true">
      <svg className="disc-type" viewBox="0 0 1000 1000"><defs><path id={id} d="M100 500A400 400 0 0 1 900 500" /></defs><text><textPath href={`#${id}`} startOffset="50%" textAnchor="middle" textLength={lang === "en" ? 810 : undefined} lengthAdjust="spacing">{c(lang, "THREE WAYS TO FIND YOUR PLACE", "ثلاث طرق لاكتشاف مكانك")}</textPath></text></svg>
      <div className="disc-stamp"><span>{c(lang, "EGYPT", "مصر")}</span><Blossom /><span>{c(lang, "MASAR", "مَسَار")}</span></div>
      <span className="disc-stem" />
    </div>
  </div></div>;
}
