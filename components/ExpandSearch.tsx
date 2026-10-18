"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import type { Lang } from "@/lib/types";

export default function ExpandSearch({ open, value, lang, onOpenChange, onChange }: {
  open: boolean; value: string; lang: Lang;
  onOpenChange: (open: boolean) => void; onChange: (value: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [hint, setHint] = useState("");
  const [spin, setSpin] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextRipple = useRef(0);
  const label = lang === "ar" ? "ابحث عن مشروع أو مطوّر" : "Search projects or developers";
  const close = () => { onOpenChange(false); toggle.current?.focus({ preventScroll: true }); };
  useEffect(() => {
    input.current?.toggleAttribute("inert", !open);
    if (!open) return;
    const timer = setTimeout(() => input.current?.focus({ preventScroll: true }), 350);
    return () => clearTimeout(timer);
  }, [open]);
  useEffect(() => {
    setHint(label);
    if (!open || value || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const phrases = lang === "ar" ? ["ابحث عن مشروع أو مطوّر", "جرّب سيناريو", "اكتب اسم المشروع"] : [label, "Try Scenario", "Find a developer"];
    let index = 0, length = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      const phrase = phrases[index];
      length += deleting ? -1 : 1;
      setHint(phrase.slice(0, length) || "\u200b");
      let delay = deleting ? 32 : 70;
      if (length >= phrase.length) { deleting = true; delay = 1700; }
      if (length <= 0) { deleting = false; index = (index + 1) % phrases.length; delay = 350; }
      timer = setTimeout(step, delay);
    };
    timer = setTimeout(() => { setHint("\u200b"); step(); }, 900);
    return () => clearTimeout(timer);
  }, [open, value, lang, label]);
  useEffect(() => {
    if (!ripples.length) return;
    const timer = setTimeout(() => setRipples([]), 650);
    return () => clearTimeout(timer);
  }, [ripples]);
  return <div className={`rail-expand-search${open ? " is-open" : ""}${value ? " has-query" : ""}`}>
    <div className="expand-bar">
      <button ref={toggle} type="button" className="rail-search-toggle expand-search-button" aria-label={label} aria-expanded={open} aria-controls="rail-search-input"
        onPointerDown={event => {
          if (open || event.button !== 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const rect = event.currentTarget.getBoundingClientRect();
          setRipples(items => [...items, { id: nextRipple.current++, x: event.clientX - rect.left, y: event.clientY - rect.top }]);
        }} onClick={() => { onOpenChange(true); if (open) input.current?.focus(); }}>
        <Icon name="search" size={22}/>
        {ripples.map(ripple => <span key={ripple.id} className="expand-ripple" style={{ left: ripple.x, top: ripple.y }}/>) }
        {value && !open && <span className="expand-query-dot"/>}
      </button>
      <input ref={input} id="rail-search-input" type="search" value={value} tabIndex={open ? 0 : -1} aria-hidden={!open} aria-label={label} placeholder={hint || label}
        onChange={event => onChange(event.target.value)} onKeyDown={event => {
          if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); }
          if (event.key === "Enter") event.preventDefault();
        }}/>
    </div>
    <button type="button" className="expand-clear" aria-label={value ? (lang === "ar" ? "مسح البحث" : "Clear search") : (lang === "ar" ? "إغلاق البحث" : "Close search")}
      tabIndex={open ? 0 : -1} aria-hidden={!open} onClick={() => {
        if (!value) { close(); return; }
        onChange(""); setSpin(count => count + 1); input.current?.focus();
      }}><span key={spin} className={spin ? "expand-clear-spin" : ""}><Icon name="close" size={18}/></span></button>
  </div>;
}
