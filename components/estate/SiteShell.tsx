"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/types";
import { BRAND } from "@/lib/i18n";
import { Arrow, Blossom, Seal } from "./Brand";

export function siteHref(path: string, lang: Lang) { return `${path}${path.includes("?") ? "&" : "?"}lang=${lang}`; }
export function c(lang: Lang, en: string, ar: string) { return lang === "ar" ? ar : en; }

export function EditorialLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <Link className={`editorial-link ${className}`} href={href}><span>{children}</span><span className="link-flower"><Blossom /><Arrow /></span></Link>;
}

export default function SiteShell({ children, lang = "en", lightHeader = false }: { children: ReactNode; lang?: Lang; lightHeader?: boolean }) {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(lightHeader);
  const [leaving, setLeaving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    setLeaving(false);
    setMenu(false);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.add("estate-document");
    const root = document.querySelector<HTMLElement>(".estate-site");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY, h = window.innerHeight;
      const darkSection = Array.from(root?.querySelectorAll<HTMLElement>(".estate-hero,.project-hero,.living-section,.project-location,.next-project,.estate-footer,.destination-scene,.lower-panorama,.lower-architecture[data-full=true],.lower-finale-sticky,.blue-editorial,.contact-scenic") ?? []).some(el => { const r = el.getBoundingClientRect(); return r.top <= 95 && r.bottom > 95; });
      setScrolled(!darkSection && (lightHeader || y > h * .7));
      const currentSurface = Array.from(root?.querySelectorAll<HTMLElement>("section,.estate-footer") ?? []).find(el => { const r = el.getBoundingClientRect(); return r.top <= 95 && r.bottom > 95; });
      const surface = currentSurface ? getComputedStyle(currentSurface).backgroundColor : "";
      const edge = root?.dataset.skyHeader === "true" ? "#bdcfd8" : darkSection ? (currentSurface?.classList.contains("estate-footer") || currentSurface?.classList.contains("project-location") ? "#331326" : "#17233b") : surface && surface !== "rgba(0, 0, 0, 0)" ? surface : "#f3f0e7";
      document.documentElement.style.setProperty("--estate-edge", edge);
      if (progressRef.current) progressRef.current.style.height = `${100 * y / Math.max(1, document.documentElement.scrollHeight - h)}%`;
      root?.style.setProperty("--hero-progress", String(Math.min(1, y / h)));
      root?.querySelectorAll<HTMLElement>("[data-parallax]").forEach(el => {
        const rect = el.parentElement!.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < h) el.style.setProperty("--parallax", reduced.matches ? "0px" : `${(rect.top + rect.height / 2 - h / 2) * -.08}px`);
      });
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", scroll); update();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-revealed"); observer.unobserve(entry.target); } }), { threshold: .12 });
    root?.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    return () => { document.documentElement.classList.remove("estate-document"); document.documentElement.style.removeProperty("--estate-edge"); observer.disconnect(); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); cancelAnimationFrame(frame); clearTimeout(pending.current); };
  }, [lang, pathname, lightHeader]);
  useEffect(() => {
    if (menuRef.current) menuRef.current.inert = !menu;
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const main = document.querySelector<HTMLElement>(".estate-main"); if (main) main.inert = true;
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenu(false); menuButton.current?.focus(); }
      if (e.key === "Tab") {
        const controls = [menuButton.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a,button") ?? [])].filter(Boolean) as HTMLElement[];
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; if (main) main.inert = false; window.removeEventListener("keydown", key); };
  }, [menu]);
  const links = [["/", "Home", "الرئيسية"], ["/projects", "The collection", "المشاريع"], ["/map", "Explore the map", "استكشف الخريطة"], ["/planner", "My planner", "اختياراتي"], ["/updates", "Project updates", "التحديثات"], ["/about", "About us", "عنّا"], ["/contact", "Find your place", "اكتشف مكانك"]];
  return <div className={`estate-site${lang === "ar" ? " estate-arabic" : ""}${leaving ? " is-leaving" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"} onClickCapture={e => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute("download")) return;
    const url = new URL(a.href);
    if (url.pathname === location.pathname && url.searchParams.has("lang") && url.searchParams.get("lang") !== lang) {
      const current = new URL(location.href);
      current.searchParams.set("lang", url.searchParams.get("lang")!);
      url.search = current.search;
    }
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search && url.hash)) return;
    if (url.pathname === location.pathname && url.search === location.search && !url.hash) { setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    e.preventDefault(); e.stopPropagation(); setLeaving(true); setMenu(false);
    pending.current = setTimeout(() => router.push(url.pathname + url.search + url.hash), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 430);
  }}>
    <a className="estate-skip" href="#main">{c(lang, "Skip to content", "انتقل إلى المحتوى")}</a>
    <header className={`estate-header${scrolled ? " on-paper" : ""}${menu ? " menu-active" : ""}`}>
      <Link href={siteHref("/", lang)} className="estate-home" aria-label={c(lang, "Masar — Home", "مَسَار — الرئيسية")}><Seal lang={lang} /></Link>
      <nav className="estate-header-nav" aria-label={c(lang, "Main navigation", "القائمة الرئيسية")}>
        <Link className="header-feature" href={siteHref("/projects", lang)}>{c(lang, "Explore the", "اكتشف")}<br />{c(lang, "collection", "المشاريع")}</Link>
        <Link className="header-map" href={siteHref("/map", lang)}>{c(lang, "Explore the map", "استكشف الخريطة")} ↗</Link>
        <button ref={menuButton} className="estate-menu-button" aria-expanded={menu} aria-controls="estate-menu" onClick={() => setMenu(!menu)}>{c(lang, menu ? "Close" : "Menu", menu ? "إغلاق" : "القائمة")}<span className={menu ? "menu-dots is-open" : "menu-dots"}><i /><i /><i /></span></button>
      </nav>
    </header>
    <div className="estate-menu" id="estate-menu" ref={menuRef} data-open={menu} role={menu ? "dialog" : undefined} aria-modal={menu || undefined} aria-label={c(lang, "Navigation", "التنقل")}>
      <div className="menu-eyebrow">{c(lang, "Places for a life well lived", "أماكن لحياة تستحقها")}</div>
      <nav>{links.map(([path, en, ar], i) => <Link key={path} style={{ "--order": i } as React.CSSProperties} href={siteHref(path, lang)}><small>0{i + 1}</small><span>{c(lang, en, ar)}</span><Arrow diagonal /></Link>)}</nav>
      <div className="menu-bottom"><span>{c(lang, "EGYPT · MASAR", "مصر · مَسَار")}</span><Link href={siteHref(pathname, lang === "ar" ? "en" : "ar")}>{lang === "ar" ? "الإنجليزية" : "Arabic"}</Link></div>
      <Blossom className="menu-art" />
    </div>
    <div className="estate-scroll-rail" aria-hidden="true"><span>{c(lang, "SCROLL TO DISCOVER", "اكتشف المزيد")}</span><i><span ref={progressRef} /></i><span>↓</span></div>
    <main id="main" className="estate-main">{children}</main>
    <footer className="estate-footer">
      <div className="footer-top"><Blossom /><p>{c(lang, "A place to live.\nA place to return to.", "مكان تعيش فيه.\nومكان تحب ترجع له.")}</p><EditorialLink href={siteHref("/map", lang)}>{c(lang, "Find your place", "اكتشف مكانك")}</EditorialLink></div>
      <div className="footer-nav"><nav aria-label={c(lang, "Footer", "روابط الموقع")}>{links.slice(1).map(([path, en, ar]) => <Link key={path} href={siteHref(path, lang)}>{c(lang, en, ar)}</Link>)}</nav><Link href={siteHref("/account",lang)}>{c(lang,"My account","حسابي")}</Link><Link href={siteHref(pathname, lang === "ar" ? "en" : "ar")}>{lang === "ar" ? "الإنجليزية" : "Arabic"}</Link><a href="#main">{c(lang, "Back to top", "العودة لأعلى")} ↑</a></div>
      <div className="footer-wordmark" aria-label={c(lang, "Masar", "مَسَار")}>{c(lang, "MASAR", "مَسَار")}<span>{c(lang, "Egypt", "مصر")}</span></div>
      <div className="footer-legal"><span>© {new Date().getFullYear()} {BRAND[lang].name}</span><span>{c(lang, "Property imagery belongs to the credited sources.", "صور المشاريع تابعة للمصادر الموضحة.")}</span><Link href={siteHref("/data",lang)}>{c(lang,"Sources & privacy","المصادر والخصوصية")}</Link></div>
    </footer>
    <div className="estate-page-curtain" aria-hidden="true"><Blossom /></div>
  </div>;
}
